import type { GameProgressStore } from "../inMemoryStores/LastGameStore";

interface Settings {
  controlPosition: "Left" | "Right";
}

export interface HighScore {
  points: number;
  level: number;
  playerName: string;
  playerProfilePicUrl: string;
  outcome: string;
}

export interface Player {
  id?: number;
  external_id?: string;
  platform?: string;
  name: string;
  email: string;
  created_at?: string;
  profile_pic_url?: string;
  date_of_birth?: string;
  last_login_at?: string;
  settings?: Settings;
  last_game_saved_on?: number;
}

export interface LoginResponse {
  message: string;
  player: Player;
  isNewPlayer: boolean;
  lastGame?: GameProgressStore;
  personalBest?: { points: number; level: number; player_won: string } | null;
}

export interface SaveScorePayload {
  points: number;
  level: number;
  hasWon: boolean;
}

export interface UpdatePlayerPayload {
  name: string;
  date_of_birth: string;
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
