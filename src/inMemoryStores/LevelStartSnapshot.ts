import type { IStore } from "./interfaces";

class LevelStartSnapshot implements IStore {
  private _turtleHealth: number;
  private _turtleOxygen: number;
  private _turtleFood: number;
  private _turtleApetite: number;
  private _xp: number;
  private _interactions: Record<string, number>;

  constructor() {
    this.reset();
  }

  reset() {
    this._turtleHealth = 100;
    this._turtleOxygen = 100;
    this._turtleFood = 100;
    this._turtleApetite = 100;
    this._xp = 0;
    this._interactions = {};
  }

  get turtleHealth() {
    return this._turtleHealth;
  }

  set turtleHealth(value) {
    this._turtleHealth = value;
  }

  get turtleOxygen() {
    return this._turtleOxygen;
  }

  set turtleOxygen(value) {
    this._turtleOxygen = value;
  }

  get turtleFood() {
    return this._turtleFood;
  }

  set turtleFood(value) {
    this._turtleFood = value;
  }

  get turtleApetite() {
    return this._turtleApetite;
  }

  set turtleApetite(value) {
    this._turtleApetite = value;
  }

  get xp() {
    return this._xp;
  }

  set xp(value) {
    this._xp = value;
  }

  get interactions() {
    return this._interactions;
  }

  set interactions(value) {
    this._interactions = value;
  }
}

export const levelStartSnapshot = new LevelStartSnapshot();
