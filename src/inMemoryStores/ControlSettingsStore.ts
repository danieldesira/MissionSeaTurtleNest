import { defaultAudioVolume } from "../utils/audio";
import type { IStore } from "./interfaces";

class ControlSettingsStore implements IStore {
  private _screenControlsPosition: "Left" | "Right" = "Right";
  private _audioVolume: number = 0.5;

  constructor() {
    this.reset();
  }

  set screenControlsPosition(value: "Left" | "Right") {
    this._screenControlsPosition = value;
  }

  get screenControlsPosition() {
    return this._screenControlsPosition;
  }

  set audioVolume(value: number) {
    this._audioVolume = value;
  }

  get audioVolume() {
    return this._audioVolume;
  }

  reset() {
    this._screenControlsPosition = "Right";
    this._audioVolume = defaultAudioVolume;
  }
}

export const controlSettingsStore = new ControlSettingsStore();
