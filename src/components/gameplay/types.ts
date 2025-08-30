import { Dispatch, SetStateAction } from "react";

export type DialogContent = {
  title: string;
  type?: "default" | "error";
  message: React.ReactElement;
  buttons?: { label: string; action: () => void }[];
};

export type TurtleStats = {
  apetite: number;
  food: number;
  oxygen: number;
  physicalCondition: number;
  xp: number;
  level: number;
};

export const defaultTurtleStats: TurtleStats = {
  apetite: 100,
  food: 100,
  oxygen: 100,
  physicalCondition: 100,
  xp: 0,
  level: 1,
};

export type GameLoopParams = {
  isGamePaused?: boolean;
  setIsGamePaused: Dispatch<SetStateAction<boolean>>;
  setDialogContent: Dispatch<SetStateAction<DialogContent>>;
  canvas: HTMLCanvasElement;
  level: number;
  setLevel: Dispatch<SetStateAction<number>>;
  turtleStats: TurtleStats;
  setTurtleStats: Dispatch<SetStateAction<TurtleStats>>;
};
