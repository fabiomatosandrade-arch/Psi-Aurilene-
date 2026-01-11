
export enum Mood {
  VERY_BAD = 1,
  BAD = 2,
  NEUTRAL = 3,
  GOOD = 4,
  EXCELLENT = 5
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  birthDate: string;
  password?: string;
}

export interface DailyEntry {
  id: string;
  userId: string;
  date: string;
  notes: string;
  mood: Mood;
  timestamp: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
