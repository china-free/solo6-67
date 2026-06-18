export interface Cell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Theme {
  name: string;
  background: string;
  wallColor: string;
  wallGlow: string;
  playerColor: string;
  playerGlow: string;
  startColor: string;
  endColor: string;
  pathColor: string;
  fogColor: string;
  accentColor: string;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameState {
  maze: Cell[][];
  mazeSize: number;
  playerPos: Position;
  startPos: Position;
  endPos: Position;
  isPlaying: boolean;
  isComplete: boolean;
  elapsedTime: number;
  bestTime: number | null;
  fogMode: boolean;
  currentTheme: string;
  showPath: boolean;
  hintPath: Position[];
}
