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
  private _isUploaded: boolean;

  constructor() {
    this.reset();
  }

  reset() {
    this._store = null;
    this._isUploaded = false;
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

  set isUploaded(value: boolean) {
    this._isUploaded = value;
  }

  get isUploaded() {
    return this._isUploaded;
  }
}

export const lastGameStore = new LastGameStore();
