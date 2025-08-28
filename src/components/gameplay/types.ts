import { Dispatch, SetStateAction } from "react";

export type DialogContent = {
  title: string;
  type: "default" | "error";
  message: string;
};

export type GameLoopParams = {
  isGamePaused?: boolean;
  setIsGamePaused: Dispatch<SetStateAction<boolean>>;
  setDialogContent: Dispatch<SetStateAction<DialogContent>>;
};
