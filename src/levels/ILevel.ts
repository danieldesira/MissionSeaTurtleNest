import INonMainCharacter, {
  CollisionCallbacks,
} from "../characters/interfaces/INonMainCharacter";
import GameData from "../restoreGame/GameData";

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
  checkIfTurtleMeetsCharacters(
    apetite: number,
    callbacks: CollisionCallbacks
  ): void;
  get levelDescription(): string[];
  get imagePath(): string;
}

export default ILevel;
