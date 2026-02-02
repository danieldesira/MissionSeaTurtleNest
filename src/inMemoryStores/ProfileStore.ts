import type { IStore } from "./interfaces";

class ProfileStore implements IStore {
  private _email: string;
  private _name: string;
  private _profilePicUrl: string;
  private _dateOfBirth: Date;
  private _playerIdentifier: string;

  constructor() {
    this.reset();
  }

  set email(value: string) {
    this._email = value;
  }

  get email() {
    return this._email;
  }

  set name(value: string) {
    this._name = value;
  }

  get name() {
    return this._name;
  }

  set profilePicUrl(value: string) {
    this._profilePicUrl = value;
  }

  get profilePicUrl() {
    return this._profilePicUrl;
  }

  set dateOfBirth(value: Date) {
    this._dateOfBirth = value;
  }

  get dateOfBirth() {
    return this._dateOfBirth;
  }

  set playerIdentifier(value: string) {
    this._playerIdentifier = value;
  }

  get playerIdentifier() {
    return this._playerIdentifier;
  }

  reset() {
    this._email = "";
    this._name = "";
    this._profilePicUrl = "";
    this._dateOfBirth = new Date();
    this._playerIdentifier = "";
  }
}

export const profileStore = new ProfileStore();
