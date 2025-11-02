import type INonMainCharacter from "../characters/interfaces/INonMainCharacter";
import type GameData from "../restoreGame/GameData";

interface ILevel {
  init(isFreshLevel: boolean, gameData: GameData): Promise<void>;
  get bgImg(): HTMLImageElement | null;
  set bgOffsetX(offsetX: number);
  set bgOffsetY(offsetY: number);
  get bgOffsetX(): number;
  get bgOffsetY(): number;
  get characters(): Set<INonMainCharacter>;
  get benthicOffsetY(): number;
  paintCharacters(context: CanvasRenderingContext2D): void;
  moveCharacters(): void;
  get currentSpeed(): number;
  get points(): number;
  checkIfTurtleMeetsCharacters(): void;
  get levelDescription(): string[];
  get imagePath(): string;
}

export default ILevel;
