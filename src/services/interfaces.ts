import type GameData from "../restoreGame/GameData";

export interface Settings {
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
  lastGame?: GameData;
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
}

export interface UpdateProfilePictureResponse {
  profilePicUrl?: string;
  message?: string;
}
