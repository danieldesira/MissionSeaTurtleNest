import type { GameProgressStore } from "../inMemoryStores/LastGameStore";

interface Settings {
  controlPosition: "Left" | "Right";
  audioVolume: number;
}

export interface HighScore {
  points: number;
  level: number;
  playerName: string;
  playerProfilePicUrl: string;
  outcome: string;
  playerIdentifier: string;
  duration: number;
}

export interface Player {
  id?: number;
  externalId?: string;
  ssoProvider?: string;
  name: string;
  email: string;
  createdAt?: string;
  profilePicUrl?: string;
  dateOfBirth?: string;
  lastLoginAt?: string;
  settings?: Settings;
  lastGame?: GameProgressStore;
  lastGameSavedOn?: number;
}

export interface LoginResponse {
  message: string;
  player: Player;
  isNewPlayer: boolean;
  personalBest?: {
    points: number;
    level: number;
    outcome: "Win" | "Loss" | "";
    duration: number;
  } | null;
}

export interface SaveScorePayload {
  points: number;
  level: number;
  duration: number;
}

export interface UpdatePlayerPayload {
  name: string;
  dateOfBirth: string;
  settings: Settings;
}

export interface UpdateProfilePictureResponse {
  profilePicUrl?: string;
  message?: string;
}

export interface SaveGamePayload {
  lastGame: GameProgressStore;
  timestamp: number;
}

export interface SsoToken {
  provider: "google" | "microsoft" | "facebook";
  credential: string;
}
