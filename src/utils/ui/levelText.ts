import { levelExists } from "../../levels/levels";

export const formatLevelAsText = (levelNo: number) =>
  levelExists(levelNo) ? `Level ${levelNo}` : "Game Complete";
