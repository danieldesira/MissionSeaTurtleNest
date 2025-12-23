import type { IStore } from "./interfaces";

class ProfileStore implements IStore {
  private _email: string;
  private _name: string;
  private _profile_pic_url: string;
  private _date_of_birth: Date;

  constructor() {
    this.reset();
  }

  /**
   * Email setter.
   * @author Daniel Desira
   */
  set email(value: string) {
    this._email = value;
  }

  /**
   * Email getter.
   * @author Daniel Desira
   */
  get email() {
    return this._email;
  }

  /**
   * Name setter.
   * @author Daniel Desira
   */
  set name(value: string) {
    this._name = value;
  }

  /**
   * Name getter.
   * @author Daniel Desira
   */
  get name() {
    return this._name;
  }

  /**
   * Profile pic url setter.
   * @author Daniel Desira
   */
  set profile_pic_url(value: string) {
    this._profile_pic_url = value;
  }

  /**
   * Profile pic url getter.
   * @author Daniel Desira
   */
  get profile_pic_url() {
    return this._profile_pic_url;
  }

  /**
   * Date of birth setter.
   * @author Daniel Desira
   */
  set date_of_birth(value: Date) {
    this._date_of_birth = value;
  }

  /**
   * Date of birth getter.
   * @author Daniel Desira
   */
  get date_of_birth() {
    return this._date_of_birth;
  }

  /**
   * Resets profile state.
   * @author Daniel Desira
   */
  reset() {
    this._email = "";
    this._name = "";
    this._profile_pic_url = "";
    this._date_of_birth = new Date();
  }
}

export const profileStore = new ProfileStore();
