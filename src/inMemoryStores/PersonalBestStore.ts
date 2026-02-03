import type { IStore } from "./interfaces";

class PersonalBestStore implements IStore {
  private _points: number;
  private _level: number;
  private _duration: number;
  private _outcome: "Win" | "Loss" | "";

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

  set outcome(value: "Win" | "Loss" | "") {
    this._outcome = value;
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

  get outcome() {
    return this._outcome;
  }

  reset() {
    this._points = 0;
    this._level = 0;
    this._duration = 0;
    this._outcome = "";
  }
}

export const personalBestStore = new PersonalBestStore();
