import type { IStore } from "./interfaces";

class PersonalBestStore implements IStore {
  private _points: number;
  private _level: number;

  constructor() {
    this.reset();
  }

  /**
   * Points setter.
   * @author Daniel Desira
   */
  set points(value: number) {
    this._points = value;
  }

  /**
   * Level setter.
   * @author Daniel Desira
   */
  set level(value: number) {
    this._level = value;
  }

  /**
   * Points getter.
   * @author Daniel Desira
   */
  get points() {
    return this._points;
  }

  /**
   * Level getter.
   * @author Daniel Desira
   */
  get level() {
    return this._level;
  }

  /**
   * Resets personal best score states.
   * @author Daniel Desira
   */
  reset() {
    this._points = 0;
    this._level = 0;
  }
}

export const personalBestStore = new PersonalBestStore();
