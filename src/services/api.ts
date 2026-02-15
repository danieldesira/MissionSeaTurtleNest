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
  await FetchRequest.post<LoginResponse>({
    url: "api/login",
    payload: ssoToken,
  });

export const saveGame = async (payload: SaveGamePayload) =>
  await FetchRequest.put({ url: "api/game", payload });

export const saveScore = async (payload: SaveScorePayload) =>
  await FetchRequest.post({
    url: "api/points",
    payload,
  });

export const fetchHighScores = async () =>
  await FetchRequest.get<HighScore[]>({ url: "api/high-scores" });

export const updateProfile = async (payload: UpdatePlayerPayload) =>
  await FetchRequest.put({ url: "api/player", payload });

export const requestLogout = async () =>
  await FetchRequest.post({ url: "api/logout" });

export const uploadProfilePicture = async (file: File) =>
  await FetchRequest.uploadFile<UpdateProfilePictureResponse>({
    url: "api/profile-pic",
    payload: file,
  });
