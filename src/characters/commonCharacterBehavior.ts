import { Directions } from "../constants";
import { game } from "../singletons/Game";
import type { ICharacter, INonMainCharacter } from "./interfaces";

export const swimHorizontally = (character: INonMainCharacter) => {
  if (character.direction === "Left") {
    character.x -= character.speed;
    if (character.x <= 0) {
      character.direction = "Right";
    }
  } else {
    character.x += character.speed;
    if (character.x >= game.level.bgImg.width) {
      character.direction = "Left";
    }
  }
};

type PaintCharacterOptions = {
  context: CanvasRenderingContext2D;
  character: ICharacter;
  rotate?: boolean;
};

export const paintCharacter = ({
  context,
  character,
  rotate = false,
}: PaintCharacterOptions) => {
  if (character.image) {
    context.save();
    context.translate(
      character.x - game.level.bgOffsetX,
      character.y - game.level.bgOffsetY,
    );
    if (rotate) {
      context.rotate(Directions[character.direction].angle);
    }
    context.drawImage(
      character.image,
      -character.width / 2,
      -character.height / 2,
      character.width,
      character.height,
    );
    context.restore();
  }
};
