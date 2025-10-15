class ControlSettingsStore {
  private static _instance: ControlSettingsStore;
  private _screenControlsPosition: "Left" | "Right";

  private constructor() {
    this.reset();
  }

  public static get instance() {
    if (!ControlSettingsStore._instance) {
      ControlSettingsStore._instance = new ControlSettingsStore();
    }
    return ControlSettingsStore._instance;
  }

  public set screenControlsPosition(value: "Left" | "Right") {
    this._screenControlsPosition = value;
  }

  public get screenControlsPosition() {
    return this._screenControlsPosition;
  }

  public reset() {
    this._screenControlsPosition = "Right";
  }
}

export default ControlSettingsStore;
