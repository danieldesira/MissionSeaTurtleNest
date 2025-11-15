import Boat from "../characters/Boat";
import Crab from "../characters/Crab";
import NeptuneGrass from "../characters/NeptuneGrass";
import PlasticBag from "../characters/PlasticBag";
import Sardine from "../characters/Sardine";
import Shrimp from "../characters/Shrimp";
import Level from "./Level";
import type { LevelConstructorOptions } from "./types";

const levelsConfig: {
  [key: number]: LevelConstructorOptions;
} = {
  1: {
    title: "Warm Up Level",
    backgroundImageFilename: "level1.png",
    initialCharacters: [
      { Constructor: Shrimp, amount: 20 },
      { Constructor: Sardine, amount: 10 },
      { Constructor: PlasticBag, amount: 8 },
    ],
    benthicOffsetY: 9999,
    currentSpeed: 0.1,
    points: 10,
    levelDescription: [
      "Welcome to the warm up level!",
      "You need to avoid the plastic bags and eat the shrimp and sardines.",
      "You can move around using the arrow keys.",
      "Reach the right end of the level to complete it.",
      "Good luck!",
    ],
  },
  2: {
    title: "Mind the Boat",
    backgroundImageFilename: "level2.png",
    initialCharacters: [
      { Constructor: PlasticBag, amount: 10 },
      { Constructor: NeptuneGrass, amount: 4 },
      { Constructor: Shrimp, amount: 30 },
      { Constructor: Crab, amount: 5 },
      { Constructor: Boat, amount: 1 },
    ],
    benthicOffsetY: 550,
    currentSpeed: 0.15,
    points: 10,
    levelDescription: [
      "Mind the boat. It injures sea turtles but in the game it will kill you instantly!",
      "You may also eat crabs at the bottom for extra points!",
      "Avoid plastic bags as these impact your appetite and cause damage.",
      "Move around using the arrow keys.",
      "Reach the right end of the level to complete it.",
      "Good luck!",
    ],
  },
};

/**
 * Instantiates a level corresponding to a level number.
 * @param levelNo The level number
 * @returns The instance
 * @author Daniel Desira
 */
export const createLevelInstance = (levelNo: number): Level => {
  const contructorOptions = levelsConfig[levelNo];
  if (contructorOptions) {
    return new Level(contructorOptions);
  } else {
    throw new Error("Level undefined");
  }
};

export const levelExists = (levelNo: number) => !!levelsConfig[levelNo];
