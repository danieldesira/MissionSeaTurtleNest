import {
  type SaveGamePayload,
  type HighScore,
  type LoginResponse,
  type SaveScorePayload,
  type UpdatePlayerPayload,
  type UpdateProfilePictureResponse,
  SsoToken,
} from "./interfaces";
import FetchRequest from "./FetchRequest";

export const login = async (ssoToken: SsoToken) =>
  await FetchRequest.post<LoginResponse>("api/login", ssoToken);

export const saveGame = async (data: SaveGamePayload) =>
  await FetchRequest.put("api/game", data);

export const saveScore = async ({ points, level, hasWon }: SaveScorePayload) =>
  await FetchRequest.post("api/points", {
    points,
    level,
    hasWon,
  });

export const fetchHighScores = async () =>
  await FetchRequest.get<HighScore[]>("api/high-scores");

export const updateProfile = async (profile: UpdatePlayerPayload) =>
  await FetchRequest.put("api/player", profile);

export const requestLogout = async () => await FetchRequest.post("api/logout");

export const uploadProfilePicture = async (file: File) =>
  await FetchRequest.uploadFile<UpdateProfilePictureResponse>(
    "api/profile-pic",
    file
  );
