class ProfileStore {
  private static _instance: ProfileStore;

  private _email: string;
  private _name: string;
  private _profile_pic_url: string;
  private _date_of_birth: Date;

  private constructor() {
    this.reset();
  }

  /**
   * Singleton instance accessor.
   * @author Daniel Desira
   */
  public static get instance() {
    if (!ProfileStore._instance) {
      ProfileStore._instance = new ProfileStore();
    }
    return ProfileStore._instance;
  }

  /**
   * Email setter.
   * @author Daniel Desira
   */
  public set email(value: string) {
    this._email = value;
  }

  /**
   * Email getter.
   * @author Daniel Desira
   */
  public get email() {
    return this._email;
  }

  /**
   * Name setter.
   * @author Daniel Desira
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Name getter.
   * @author Daniel Desira
   */
  public get name() {
    return this._name;
  }

  /**
   * Profile pic url setter.
   * @author Daniel Desira
   */
  public set profile_pic_url(value: string) {
    this._profile_pic_url = value;
  }

  /**
   * Profile pic url getter.
   * @author Daniel Desira
   */
  public get profile_pic_url() {
    return this._profile_pic_url;
  }

  /**
   * Date of birth setter.
   * @author Daniel Desira
   */
  public set date_of_birth(value: Date) {
    this._date_of_birth = value;
  }

  /**
   * Date of birth getter.
   * @author Daniel Desira
   */
  public get date_of_birth() {
    return this._date_of_birth;
  }

  /**
   * Resets profile state.
   * @author Daniel Desira
   */
  public reset() {
    this._email = "";
    this._name = "";
    this._profile_pic_url = "";
    this._date_of_birth = new Date();
  }
}

export default ProfileStore;
