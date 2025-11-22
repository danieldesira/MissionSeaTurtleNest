import ProspectiveMate from "./abstract/ProspectiveMate";
import { CharacterOptions } from "./types";

class MaleTurtle extends ProspectiveMate {
  protected _type: string;
  protected _imageFilename: string;
  protected _width: number;
  protected _height: number;

  constructor({ imageFilename, width, height }: CharacterOptions = {}) {
    super();
    this._imageFilename = imageFilename ?? "maleTurtle.svg";
    this._width = width ?? 135;
    this._height = height ?? 36;
    this._type = "MaleTurtle";
  }
}

export default MaleTurtle;
