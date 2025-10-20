class ControlSettingsStore {
  private static _instance: ControlSettingsStore;
  private _screenControlsPosition: "Left" | "Right";

  private constructor() {
    this.reset();
  }

  /**
   * Singleton instance accessor.
   * @author Daniel Desira
   */
  public static get instance() {
    if (!ControlSettingsStore._instance) {
      ControlSettingsStore._instance = new ControlSettingsStore();
    }
    return ControlSettingsStore._instance;
  }

  /**
   * Screen controls position setter.
   * @author Daniel Desira
   */
  public set screenControlsPosition(value: "Left" | "Right") {
    this._screenControlsPosition = value;
  }

  /**
   * Screen controls position getter.
   * @author Daniel Desira
   */
  public get screenControlsPosition() {
    return this._screenControlsPosition;
  }

  /**
   * Resets setting states.
   * @author Daniel Desira
   */
  public reset() {
    this._screenControlsPosition = "Right";
  }
}

export default ControlSettingsStore;
