import { createCharacterInstance } from "../characters/factory";
import { lastGameStore } from "../inMemoryStores/LastGameStore";
import { game } from "../singletons/Game";

export const restoreGameProgress = () => {
  restoreTurtleState();
  game.currentLevelNo = lastGameStore.store.levelNo;
  game.xp = lastGameStore.store.xp;
  restoreCharacters();
};

const restoreTurtleState = () => {
  game.turtle.apetiteGauge = lastGameStore.store.turtle.stomachCapacity;
  game.turtle.foodGauge = lastGameStore.store.turtle.food;
  game.turtle.lifeGauge = lastGameStore.store.turtle.health;
  game.turtle.oxygenGauge = lastGameStore.store.turtle.oxygen;
  game.turtle.direction = lastGameStore.store.turtle.direction;
  game.turtle.x = lastGameStore.store.turtle.x;
  game.turtle.y = lastGameStore.store.turtle.y;
  game.turtle.isMama = lastGameStore.store.turtle.isMama;
};

const restoreCharacters = () => {
  game.currentGameCharacterList.reset();
  for (const { type, x, y, direction } of lastGameStore.store.characters) {
    const characterInstance = createCharacterInstance(type);
    characterInstance.direction = direction;
    characterInstance.x = x;
    characterInstance.y = y;
    game.currentGameCharacterList.characters.add(characterInstance);
  }
};
