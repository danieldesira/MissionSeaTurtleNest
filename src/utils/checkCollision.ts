import type ICharacter from "../characters/interfaces/ICharacter";

interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Checks for collisions using the bounding box algorithm.
 * @param boxA The first bounding box.
 * @param boxB The second bounding box.
 * @author GPT 3.5
 */
const checkBoundingBoxCollision = (
  boxA: BoundingBox,
  boxB: BoundingBox
): boolean => {
  // Check for non-overlapping conditions along x-axis
  if (boxA.maxX < boxB.minX || boxA.minX > boxB.maxX) {
    return false;
  }

  // Check for non-overlapping conditions along y-axis
  if (boxA.maxY < boxB.minY || boxA.minY > boxB.maxY) {
    return false;
  }

  // If both conditions are false, bounding boxes are overlapping
  return true;
};

/**
 * Calculates bounding box for a given character depending on its
 * current direction.
 * @param character The character
 * @returns Character bounding box
 * @author Daniel Desira
 */
export const getCharacterBoundingBox = (character: ICharacter): BoundingBox => {
  let box: BoundingBox = null;
  switch (character.direction) {
    case "Down":
      box = {
        minX: character.x - character.height,
        maxX: character.x,
        minY: character.y,
        maxY: character.y + character.width,
      };
      break;
    case "Up":
      box = {
        minX: character.x,
        maxX: character.x + character.height,
        minY: character.y - character.width,
        maxY: character.y,
      };
      break;
    case "Left":
      box = {
        minX: character.x - character.width,
        maxX: character.x,
        minY: character.y - character.height,
        maxY: character.y,
      };
      break;
    case "Right":
      box = {
        minX: character.x,
        maxX: character.x + character.width,
        minY: character.y,
        maxY: character.y + character.height,
      };
      break;
  }
  return box;
};

export default checkBoundingBoxCollision;
