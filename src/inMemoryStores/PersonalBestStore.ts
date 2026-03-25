import type { IStore } from "./interfaces";

class PersonalBestStore implements IStore {
  private _points: number = 0;
  private _level: number = 1;
  private _duration: number = 0;
  private _outcome: "Win" | "Loss" | "" = "";
  private _resetsUsed: number = 0;

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

  set resetsUsed(value) {
    this._resetsUsed = value;
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

  get resetsUsed() {
    return this._resetsUsed;
  }

  reset() {
    this._points = 0;
    this._level = 0;
    this._duration = 0;
    this._outcome = "";
    this._resetsUsed = 0;
  }
}

export const personalBestStore = new PersonalBestStore();
