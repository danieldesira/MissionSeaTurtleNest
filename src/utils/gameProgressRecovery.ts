import { createCharacterInstance } from "../characters/factory";
import { lastGameStore } from "../inMemoryStores/LastGameStore";
import { game } from "../singletons/Game";

export const restoreGameProgress = () => {
  restoreTurtleState();
  game.currentLevelNo = lastGameStore.store?.levelNo ?? 0;
  game.xp = lastGameStore.store?.xp ?? 0;
  game.timeInSeconds = lastGameStore.store?.duration ?? 0;
  game.interactions = parseInteractions();
  game.remainingLevelResets = lastGameStore.store?.remainingResets ?? 0;
  restoreCharacters();
};

const parseInteractions = () => {
  const interactions: Record<string, number> = {};
  for (const item of lastGameStore.store?.interactions.split("|") ?? []) {
    const [type, count] = item.split(",");
    interactions[type] = parseInt(count);
  }
  return interactions;
};

const restoreTurtleState = () => {
  game.turtle.apetiteGauge = lastGameStore.store?.turtle.stomachCapacity ?? 0;
  game.turtle.foodGauge = lastGameStore.store?.turtle.food ?? 0;
  game.turtle.lifeGauge = lastGameStore.store?.turtle.health ?? 0;
  game.turtle.oxygenGauge = lastGameStore.store?.turtle.oxygen ?? 0;
  game.turtle.direction = lastGameStore.store?.turtle.direction ?? "Left";
  game.turtle.x = lastGameStore.store?.turtle.x ?? 0;
  game.turtle.y = lastGameStore.store?.turtle.y ?? 0;
  game.turtle.isMama = lastGameStore.store?.turtle.isMama ?? false;
};

const restoreCharacters = () => {
  game.currentGameCharacterList.reset();
  for (const { type, x, y, direction } of lastGameStore.store?.characters ??
    []) {
    const characterInstance = createCharacterInstance(type);
    characterInstance.direction = direction;
    characterInstance.x = x;
    characterInstance.y = y;
    game.currentGameCharacterList.characters.add(characterInstance);
  }
};
