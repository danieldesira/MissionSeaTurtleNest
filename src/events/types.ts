import type { INonMainCharacter } from "../characters/interfaces";

/**
 * Character events that can be emitted
 */
export type CharacterEvents = {
  collision: {
    characterType: string;
    points: number;
    stomachImpact: number;
  };
  offscreen: {
    character: INonMainCharacter;
  };
  mateSuccess: {
    points: number;
  };
  mateDeath: {
    reason: string;
  };
};

/**
 * Minimal context interface passed to characters.
 * Breaks the circular dependency by not importing Game directly.
 * @author Daniel Desira
 */
export interface IGameContext {
  /**
   * Canvas width and height
   */
  canvas: {
    width: number;
    height: number;
  };

  /**
   * Level background dimensions
   */
  levelBg: {
    width: number;
    height: number;
  };

  /**
   * Level offset for scrolling
   */
  levelOffset: {
    x: number;
    y: number;
  };
}
