import { CharacterEvents } from "./types";

/**
 * Custom event emitter wrapping browser's CustomEvent API.
 * Provides a type-safe way to emit and listen to events.
 * @author Daniel Desira
 */
class EventEmitter<T extends Record<string, unknown>> {
  private eventTarget = new EventTarget();

  /**
   * Emit an event with data
   */
  emit<K extends keyof T>(eventType: K & string, detail: T[K]) {
    const event = new CustomEvent(eventType, { detail });
    this.eventTarget.dispatchEvent(event);
  }

  /**
   * Listen to an event
   */
  on<K extends keyof T>(
    eventType: K & string,
    handler: (detail: T[K]) => void
  ): () => void {
    const listener = (event: Event) => {
      if (event instanceof CustomEvent) {
        handler(event.detail);
      }
    };

    this.eventTarget.addEventListener(eventType, listener);

    // Return unsubscribe function
    return () => {
      this.eventTarget.removeEventListener(eventType, listener);
    };
  }

  /**
   * Listen to an event once
   */
  once<K extends keyof T>(
    eventType: K & string,
    handler: (detail: T[K]) => void
  ) {
    const unsubscribe = this.on(eventType, (detail) => {
      handler(detail);
      unsubscribe();
    });

    return unsubscribe;
  }
}

export const eventEmitter = new EventEmitter<CharacterEvents>();
