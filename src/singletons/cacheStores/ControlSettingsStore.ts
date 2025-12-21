class ControlSettingsStore {
  private _screenControlsPosition: "Left" | "Right";

  constructor() {
    this.reset();
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

export const controlSettingsStore = new ControlSettingsStore();
