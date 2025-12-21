export type CharacterOptions = {
  imageFilename?: string;
  speed?: number;
  stomachImpact?: number;
  points?: number;
  damage?: number;
  foodValue?: number;
  width?: number;
  height?: number;
};

export type CharacterGameClassification =
  | "Prey"
  | "Obstacle"
  | "Mate"
  | "PackPrey";
