import Level from "./Level";
import Level1 from "./Level1";
import Level2 from "./Level2";

export const levelMap: {
  [key: number]: new () => Level;
} = {
  1: Level1,
  2: Level2,
};

/**
 * Instantiates a level responding to a level number.
 * @param levelNo The level number
 * @returns The instance
 * @author Daniel Desira
 */
export const createLevelInstance = (levelNo: number): Level => {
  const LevelConstructor = levelMap[levelNo];
  if (LevelConstructor) {
    return new LevelConstructor();
  } else {
    throw new Error("Level undefined");
  }
};

/**
 * Returns the text representation of a level number.
 * If the level is not defined, it assumes game completion.
 * @param levelNo The level number
 * @returns The text representation of the level
 * @author Daniel Desira
 */
export const getLevelText = (levelNo: number): string =>
  levelMap[levelNo] ? levelNo.toString() : "Completed";
