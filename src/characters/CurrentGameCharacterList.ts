import type { LevelCharacter } from "../levels/types";
import PackPrey from "./abstract/PackPrey";
import type {
  ICurrentGameCharacterList,
  INonMainCharacter,
} from "./interfaces";
import { paintOffScreenIndicator } from "./offscreenIndicator";

class CurrentGameCharacterList implements ICurrentGameCharacterList {
  private _characters: Set<INonMainCharacter>;

  constructor() {
    this.reset();
  }

  get characters() {
    return this._characters;
  }

  reset() {
    this._characters = new Set();
  }

  spawnCharacters(spawnableCharacters: LevelCharacter[]) {
    for (const { Constructor, amount, options } of spawnableCharacters) {
      let lastPackCharacter: PackPrey = null;
      for (const _ in Array.from({ length: amount })) {
        const character = new Constructor(options);
        if (character instanceof PackPrey) {
          if (lastPackCharacter) {
            character.previousCharacterX = lastPackCharacter.x;
            character.previousCharacterY = lastPackCharacter.y;
          }
          lastPackCharacter = character;
        }
        character.setInitialPosition();
        this._characters.add(character);
      }
    }
  }

  moveCharacters() {
    for (const character of this._characters) {
      character.swim();
    }
  }

  checkIfTurtleMeetsCharacters() {
    for (const character of this._characters) {
      if (character.isCollidingWithTurtle()) {
        character.handleTurtleCollision();
      }
    }
  }

  paintCharacters(context: CanvasRenderingContext2D) {
    for (const character of this._characters) {
      if (character.isOnScreen()) {
        character.paint(context);
      } else {
        paintOffScreenIndicator(context, character);
      }
    }
  }
}

export default CurrentGameCharacterList;
