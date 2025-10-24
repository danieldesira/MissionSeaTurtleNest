import GameData from "../restoreGame/GameData";
import {
  HighScore,
  LoginResponse,
  SaveScorePayload,
  Settings,
  UpdatePlayerPayload,
  UpdateProfilePictureResponse,
} from "./interfaces";
import FetchRequest from "./FetchRequest";

export const login = async (credential: string) =>
  (await FetchRequest.post("api/login", {
    token: credential,
    service: "google",
  })) as LoginResponse;

export const saveGame = async (data: {
  lastGame: GameData;
  timestamp: number;
}) => await FetchRequest.put("api/game", data);

export const saveScore = async ({ points, level, hasWon }: SaveScorePayload) =>
  await FetchRequest.post("api/points", {
    points,
    level,
    hasWon,
  });

export const fetchHighScores = async () =>
  await FetchRequest.get<HighScore[]>("api/high-scores");

export const deleteLastGame = async () => await FetchRequest.delete("api/game");

export const updateSettings = async (settings: Settings) =>
  await FetchRequest.put("api/settings", settings);

export const updateProfile = async (profile: UpdatePlayerPayload) =>
  await FetchRequest.put("api/player", profile);

export const requestLogout = async () => await FetchRequest.post("api/logout");

export const uploadProfilePicture = async (file: File) =>
  await FetchRequest.uploadFile<UpdateProfilePictureResponse>(
    "api/profile-pic",
    file
  );
