class PersonalBestStore {
  private static _instance: PersonalBestStore;
  private _points: number;
  private _level: number;

  private constructor() {
    this.reset();
  }

  /**
   * Singleton instance accessor.
   * @author Daniel Desira
   */
  public static get instance() {
    if (!PersonalBestStore._instance) {
      PersonalBestStore._instance = new PersonalBestStore();
    }
    return PersonalBestStore._instance;
  }

  /**
   * Points setter.
   * @author Daniel Desira
   */
  public set points(value: number) {
    this._points = value;
  }

  /**
   * Level setter.
   * @author Daniel Desira
   */
  public set level(value: number) {
    this._level = value;
  }

  /**
   * Points getter.
   * @author Daniel Desira
   */
  public get points() {
    return this._points;
  }

  /**
   * Level getter.
   * @author Daniel Desira
   */
  public get level() {
    return this._level;
  }

  /**
   * Resets personal best score states.
   * @author Daniel Desira
   */
  public reset() {
    this._points = 0;
    this._level = 0;
  }
}

export default PersonalBestStore;
