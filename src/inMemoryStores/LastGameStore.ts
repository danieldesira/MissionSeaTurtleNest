import type { Direction } from "../types";
import type { IStore } from "./interfaces";

export type GameProgressStore = {
  turtle: TurtleData;
  characters: CharacterData[];
  levelNo: number;
  xp: number;
};

type TurtleData = {
  x: number;
  y: number;
  direction: Direction;
  oxygen: number;
  food: number;
  health: number;
  stomachCapacity: number;
  isMama: boolean;
};

type CharacterData = {
  type: string;
  x: number;
  y: number;
  direction: Direction;
};

class LastGameStore implements IStore {
  private _store: GameProgressStore;

  constructor() {
    this.reset();
  }

  reset() {
    this._store = null;
  }

  hasData() {
    return !!this._store;
  }

  set store(value: GameProgressStore) {
    this._store = value;
  }

  get store() {
    return this._store;
  }
}

export const lastGameStore = new LastGameStore();
