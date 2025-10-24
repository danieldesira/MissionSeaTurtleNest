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
  static get instance() {
    if (!ControlSettingsStore._instance) {
      ControlSettingsStore._instance = new ControlSettingsStore();
    }
    return ControlSettingsStore._instance;
  }

  /**
   * Screen controls position setter.
   * @author Daniel Desira
   */
  set screenControlsPosition(value: "Left" | "Right") {
    this._screenControlsPosition = value;
  }

  /**
   * Screen controls position getter.
   * @author Daniel Desira
   */
  get screenControlsPosition() {
    return this._screenControlsPosition;
  }

  /**
   * Resets setting states.
   * @author Daniel Desira
   */
  reset() {
    this._screenControlsPosition = "Right";
  }
}

export default ControlSettingsStore;
