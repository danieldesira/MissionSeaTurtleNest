import Game from "../singletons/Game";
import { updateGauge } from "../utils/ui/gameplay";
import Character from "./abstract/Character";
import CharacterOptions from "./interfaces/CharacterOptions";
import IMainCharacter from "./interfaces/IMainCharacter";

class Turtle extends Character implements IMainCharacter {
  static scientificName: string = "Carretta carretta";
  protected readonly _imageFilename: string = "turtle.svg";
  protected readonly _speed: number = 1;
  protected readonly _width: number;
  protected readonly _height: number;
  protected _foodGauge: number;
  protected _lifeGauge: number;
  protected _apetiteGauge: number;
  protected _oxygenGauge: number;

  constructor({ speed, width, height }: CharacterOptions = {}) {
    super();
    this.resetPosition();
    this._speed = speed ?? 1;
    this._width = width ?? 130;
    this._height = height ?? 80;
    this.resetGauges();
  }

  /**
   * Resets position and direction for turtle.
   * @author Daniel Desira
   */
  resetPosition() {
    this._x = 50;
    this._y = 10;
    this._direction = "Right";
  }

  /**
   * Resets turtle gauges with regards to life, oxygen, food and apetite.
   * @author Daniel Desira
   */
  resetGauges() {
    this._apetiteGauge = 100;
    this._foodGauge = 100;
    this._lifeGauge = 100;
    this._oxygenGauge = 100;
  }

  /**
   * Decrements turtle y position and rotates it upwards.
   * @author Daniel Desira
   */
  moveUp() {
    this._direction = "Up";
    if (this._y > 0) {
      this._y -= this._speed;
    }
  }

  /**
   * Increments turtle y position and rotates it downwards.
   * @author Daniel Desira
   */
  moveDown() {
    this._direction = "Down";
    if (this._y < Game.instance.level.bgImg.height) {
      this._y += this._speed;
    }
  }

  /**
   * Decrements turtle x position and rotates it leftwards.
   * @author Daniel Desira
   */
  moveLeft() {
    this._direction = "Left";
    if (this._x > 0) {
      this._x -= this._speed;
    }
  }

  /**
   * Increments turtle x position and rotates it rightwards.
   * @author Daniel Desira
   */
  moveRight() {
    this._direction = "Right";
    this._x += this._speed;
  }

  /**
   * Paints turtle while taking direction into account.
   * @param context The canvas 2D context
   * @override
   * @author Daniel Desira
   */
  paint(context: CanvasRenderingContext2D) {
    this.applyRotation(context);
    context.drawImage(
      this._image,
      this._x - Game.instance.level.bgOffsetX,
      this._y - Game.instance.level.bgOffsetY,
      this._width,
      this._height
    );
    context.resetTransform();
  }

  get foodGauge() {
    return this._foodGauge;
  }

  set foodGauge(value: number) {
    this._foodGauge = value;
    updateGauge("foodGauge", this._foodGauge);
  }

  get lifeGauge() {
    return this._lifeGauge;
  }

  set lifeGauge(value: number) {
    this._lifeGauge = value;
    updateGauge("lifeGauge", this._lifeGauge);
  }

  get apetiteGauge() {
    return this._apetiteGauge;
  }

  set apetiteGauge(value: number) {
    this._apetiteGauge = value;
    updateGauge("apetiteGauge", this._apetiteGauge);
  }

  get oxygenGauge() {
    return this._oxygenGauge;
  }

  set oxygenGauge(value: number) {
    this._oxygenGauge - value;
    updateGauge("oxygenGauge", this._oxygenGauge);
  }

  private incrementValue(value: number, increment: number): number {
    if (value + increment < 100) {
      value += increment;
    } else {
      value = 100;
    }
    return value;
  }

  private decrementValue(value: number, decrement: number): number {
    if (value - decrement > 0) {
      value -= decrement;
    } else {
      value = 0;
    }
    return value;
  }

  eat(foodIncrement: number) {
    this._foodGauge = this.incrementValue(this._foodGauge, foodIncrement);
    updateGauge("foodGauge", this._foodGauge);
  }

  takeDamage(lifeDecrement: number) {
    this._lifeGauge = this.decrementValue(this._lifeGauge, lifeDecrement);
    updateGauge("lifeGauge", this._lifeGauge);
  }

  decrementApetite(apetiteDecrement: number) {
    this._apetiteGauge = this.decrementValue(
      this._apetiteGauge,
      apetiteDecrement
    );
    updateGauge("apetiteGauge", this._apetiteGauge);
  }

  useFood() {
    this._foodGauge = this.decrementValue(this._foodGauge, 0.005);
    updateGauge("foodGauge", this._foodGauge);
  }

  useOxygen() {
    this._oxygenGauge = this.decrementValue(this._oxygenGauge, 0.001);
    updateGauge("oxygenGauge", this._oxygenGauge);
  }

  recoverApetite() {
    this._apetiteGauge = this.incrementValue(this.apetiteGauge, 0.00005);
    updateGauge("apetiteGauge", this._apetiteGauge);
  }

  breath() {
    this._oxygenGauge = this.incrementValue(this._oxygenGauge, 0.5);
    updateGauge("oxygenGauge", this._oxygenGauge);
  }
}

export default Turtle;
