import { game } from "../singletons/Game";
import { updateXpSpan } from "../utils/ui/xp";
import type { IStore } from "./interfaces";

class LevelStartSnapshot implements IStore {
  private _turtleHealth: number;
  private _turtleOxygen: number;
  private _turtleFood: number;
  private _turtleApetite: number;
  private _xp: number;
  private _interactions: Record<string, number>;

  constructor() {
    this.reset();
  }

  reset() {
    this._turtleHealth = 100;
    this._turtleOxygen = 100;
    this._turtleFood = 100;
    this._turtleApetite = 100;
    this._xp = 0;
    this._interactions = {};
  }

  get turtleHealth() {
    return this._turtleHealth;
  }

  set turtleHealth(value) {
    this._turtleHealth = value;
  }

  get turtleOxygen() {
    return this._turtleOxygen;
  }

  set turtleOxygen(value) {
    this._turtleOxygen = value;
  }

  get turtleFood() {
    return this._turtleFood;
  }

  set turtleFood(value) {
    this._turtleFood = value;
  }

  get turtleApetite() {
    return this._turtleApetite;
  }

  set turtleApetite(value) {
    this._turtleApetite = value;
  }

  get xp() {
    return this._xp;
  }

  set xp(value) {
    this._xp = value;
  }

  get interactions() {
    return this._interactions;
  }

  set interactions(value) {
    this._interactions = value;
  }

  save() {
    this._interactions = { ...game.interactions };
    this._turtleApetite = game.turtle.apetiteGauge;
    this._turtleFood = game.turtle.foodGauge;
    this._turtleHealth = game.turtle.lifeGauge;
    this._turtleOxygen = game.turtle.oxygenGauge;
    this._xp = game.xp;
  }

  resetCurrentLevel() {
    game.remainingLevelResets--;
    game.interactions = { ...this._interactions };
    game.turtle.apetiteGauge = this._turtleApetite;
    game.turtle.foodGauge = this._turtleFood;
    game.turtle.oxygenGauge = this._turtleOxygen;
    game.turtle.lifeGauge = this._turtleHealth;
    game.xp = this._xp;
    updateXpSpan();
    game.turtle.resetDirection();
    game.turtle.x = 50;
    game.turtle.y = game.level.bgImg.height / 2;
    game.currentGameCharacterList.reset();
    game.currentGameCharacterList.spawnCharacters(game.level.initialCharacters);
  }
}

export const levelStartSnapshot = new LevelStartSnapshot();
