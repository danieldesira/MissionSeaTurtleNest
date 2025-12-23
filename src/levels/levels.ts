import type { LevelConstructorOptions } from "./types";
import { game } from "../singletons/Game";
import Boat from "../characters/obstacles/Boat";
import Crab from "../characters/prey/Crab";
import NeptuneGrass from "../characters/prey/NeptuneGrass";
import PlasticBag from "../characters/obstacles/PlasticBag";
import Sardine from "../characters/prey/Sardine";
import Shrimp from "../characters/prey/Shrimp";
import Level from "./Level";
import Nurdle from "../characters/obstacles/Nurdle";  
import Rope from "../characters/obstacles/Rope";
import GhostNet from "../characters/obstacles/GhostNet";
import MaleTurtle from "../characters/MaleTurtle";

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
    currentSpeed: 0.1,
    points: 10,
    levelDescription:
      "Welcome to the warm up level! Reach the right end of the level while avoiding obstacles and eating prey.",
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
    levelDescription:
      "Mind the boat. It injures sea turtles but in the game it will kill you instantly! You may also eat crabs for extra points.",
    spawnableObstaclesPer30Second: [
      { Constructor: PlasticBag, amount: 1 },
      { Constructor: Nurdle, amount: 10 },
    ],
  },
  3: {
    title: "Love Abounds",
    backgroundImageFilename: "level3.png",
    initialCharacters: [
      { Constructor: Shrimp, amount: 250 },
      { Constructor: Sardine, amount: 100 },
      { Constructor: PlasticBag, amount: 5 },
      { Constructor: Nurdle, amount: 60 },
      { Constructor: MaleTurtle, amount: 1 },
    ],
    currentSpeed: 0.2,
    points: 50,
    levelDescription:
      "Find and mate with Maximus, the male turtle. He is recognisable through his bigger tail.",
    objectives: [() => game.turtle.isMama],
    spawnableObstaclesPer30Second: [
      { Constructor: PlasticBag, amount: 2 },
      { Constructor: Nurdle, amount: 5 },
    ],
  },
  4: {
    title: "Navigate Ghost Nets",
    backgroundImageFilename: "level4.png",
    initialCharacters: [
      { Constructor: Sardine, amount: 70 },
      { Constructor: Shrimp, amount: 300 },
      { Constructor: Nurdle, amount: 50 },
      { Constructor: GhostNet, amount: 4 },
      { Constructor: Rope, amount: 2 },
    ],
    spawnableObstaclesPer30Second: [
      { Constructor: Nurdle, amount: 2 },
      { Constructor: GhostNet, amount: 1 },
    ],
    levelDescription:
      "Ghost nets are often lost or left unattended by fishermen. Entanglement may result in drowning and death for sea turtles. Avoid them at all cost!",
    currentSpeed: 0.3,
    points: 75,
  },
  5: {
    title: "Western Currents",
    levelDescription:
      "Obstacles shall be coming from the left due to a different current direction. Stay focused and protect mama turtle!",
    currentSpeed: 0.75,
    currentDirection: "Right",
    backgroundImageFilename: "level5.png",
    initialCharacters: [
      { Constructor: Nurdle, amount: 5 },
      {
        Constructor: Sardine,
        amount: 30,
      },
      { Constructor: Shrimp, amount: 300 },
      { Constructor: Boat, amount: 2, options: { width: 200, height: 65 } },
      { Constructor: Boat, amount: 1, options: { speed: 5 } },
    ],
    spawnableObstaclesPer30Second: [
      { Constructor: Nurdle, amount: 10 },
      { Constructor: PlasticBag, amount: 1 },
      { Constructor: GhostNet, amount: 1 },
    ],
    points: 100,
  },
};

/**
 * Instantiates a level corresponding to a level number.
 * @param levelNo The level number
 * @returns The instance
 * @author Daniel Desira
 */
export const createLevelInstance = (levelNo: number) => {
  const contructorOptions = levelsConfig[levelNo];
  if (contructorOptions) {
    return new Level(contructorOptions);
  } else {
    throw new Error("Level undefined");
  }
};

export const levelExists = (levelNo: number) => !!levelsConfig[levelNo];
