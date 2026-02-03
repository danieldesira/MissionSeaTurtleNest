import type { IStore } from "./interfaces";

class PersonalBestStore implements IStore {
  private _points: number;
  private _level: number;
  private _duration: number;

  constructor() {
    this.reset();
  }

  set points(value: number) {
    this._points = value;
  }

  set level(value: number) {
    this._level = value;
  }

  set duration(value: number) {
    this._duration = value;
  }

  get points() {
    return this._points;
  }

  get level() {
    return this._level;
  }

  get duration() {
    return this._duration;
  }

  reset() {
    this._points = 0;
    this._level = 0;
    this._duration = 0;
  }
}

export const personalBestStore = new PersonalBestStore();
