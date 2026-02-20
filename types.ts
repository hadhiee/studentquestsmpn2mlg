export enum GameState {
  START = 'START',
  DYNASTY_SELECT = 'DYNASTY_SELECT',
  DYNASTY_BRIEFING = 'DYNASTY_BRIEFING',
  LEVEL_SELECT = 'LEVEL_SELECT',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
  ADMIN = 'ADMIN',
  AUTH_CALLBACK = 'AUTH_CALLBACK'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  obtainedAtLevel: number;
}

export interface PlayerStats {
  name: string;
  email: string;
  school: string;
  score: number;
  energy: number;
  artifacts: Artifact[];
  completedLevels: number[];
  currentNodeIndex: number;
  avatarUrl?: string;
  userId?: string;
}

export interface Competitor {
  id: string;
  name: string;
  score: number;
  energy: number;
  currentNodeIndex: number;
  pathHistory: number[];
  currentActivity: string;
  lastUpdate: number;
  lastAnswerStatus?: 'correct' | 'wrong' | 'none';
  status: 'online' | 'offline' | 'playing';
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isMe: boolean;
  avatarUrl?: string;
}

export type LevelConfig = {
  id: number;
  title: string;
  description: string;
  era: string;
  location: string;
  themeColor: string;
  requiredLevelId?: number;
};

export interface MaterialContent {
  title: string;
  body: string;
  imageUrl?: string;
  audioUrl?: string;
  embedUrl?: string;
}

export interface MapNode {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'COMBAT' | 'MATERIAL';
  questionId?: string;
  materialContent?: MaterialContent;
}