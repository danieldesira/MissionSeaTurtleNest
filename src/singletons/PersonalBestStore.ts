class PersonalBestStore {
  private static _instance: PersonalBestStore;
  private _points: number;
  private _level: number;

  private constructor() {
    this._points = 0;
    this._level = 0;
  }

  public static get instance() {
    if (!PersonalBestStore._instance) {
      PersonalBestStore._instance = new PersonalBestStore();
    }
    return PersonalBestStore._instance;
  }

  public set points(value: number) {
    this._points = value;
  }

  public set level(value: number) {
    this._level = value;
  }

  public get points() {
    return this._points;
  }

  public get level() {
    return this._level;
  }
}

export default PersonalBestStore;
