class ProfileStore {
  private static _instance: ProfileStore;

  private _email: string;
  private _name: string;
  private _profile_pic_url: string;
  private _date_of_birth: Date;

  private constructor() {
    this._email = "";
    this._name = "";
    this._profile_pic_url = "";
    this._date_of_birth = new Date();
  }

  public static get instance() {
    if (!ProfileStore._instance) {
      ProfileStore._instance = new ProfileStore();
    }
    return ProfileStore._instance;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get email() {
    return this._email;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get name() {
    return this._name;
  }

  public set profile_pic_url(value: string) {
    this._profile_pic_url = value;
  }

  public get profile_pic_url() {
    return this._profile_pic_url;
  }

  public set date_of_birth(value: Date) {
    this._date_of_birth = value;
  }

  public get date_of_birth() {
    return this._date_of_birth;
  }
}

export default ProfileStore;
