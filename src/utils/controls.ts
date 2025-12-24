import { game } from "../singletons/Game";

export const setupKeyboardControls = () => {
  const controls: Record<
    "up" | "down" | "left" | "right",
    { keys: string[]; action: () => void }
  > = {
    up: { keys: ["w", "W", "ArrowUp"], action: () => game.turtle.moveUp() },
    down: {
      keys: ["s", "S", "ArrowDown"],
      action: () => game.turtle.moveDown(),
    },
    left: {
      keys: ["a", "A", "ArrowLeft"],
      action: () => game.turtle.moveLeft(),
    },
    right: {
      keys: ["d", "D", "ArrowRight"],
      action: () => game.turtle.moveRight(),
    },
  };

  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (!game.isPaused) {
      handleKey(event.key);
    }
  });

  const handleKey = (pressedKey: string) => {
    const { action } = Object.values(controls).find(({ keys }) =>
      keys.includes(pressedKey)
    );
    // Call the method 5 times to make up for slower triggering of keyboard events
    for (let i = 1; i <= 5; i++) {
      action?.();
    }
  };
};
