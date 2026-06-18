import { useState, useEffect, useCallback, useRef } from 'react';
import type { Cell, Position, Direction } from '../types/game';
import { generateMaze, canMove, getNextPosition } from '../utils/mazeGenerator';
import { findShortestPath } from '../utils/pathFinder';
import { getBestTime, setBestTime } from '../utils/storage';

interface UseGameStateReturn {
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
  setMazeSize: (size: number) => void;
  setFogMode: (enabled: boolean) => void;
  setCurrentTheme: (theme: string) => void;
  toggleHint: () => void;
  movePlayer: (direction: Direction) => void;
  resetGame: () => void;
  animationTime: number;
}

export const useGameState = (initialSize: number = 15): UseGameStateReturn => {
  const [mazeSize, setMazeSizeState] = useState(initialSize);
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState<Position>({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bestTime, setBestTimeState] = useState<number | null>(null);
  const [fogMode, setFogMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('赛博朋克');
  const [showPath, setShowPath] = useState(false);
  const [hintPath, setHintPath] = useState<Position[]>([]);
  const [animationTime, setAnimationTime] = useState(0);

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const timerIntervalRef = useRef<number>(0);

  const initializeGame = useCallback((size: number) => {
    const newMaze = generateMaze(size);
    const start = { x: 0, y: 0 };
    const end = { x: size - 1, y: size - 1 };

    setMaze(newMaze);
    setStartPos(start);
    setEndPos(end);
    setPlayerPos(start);
    setIsComplete(false);
    setIsPlaying(true);
    setElapsedTime(0);
    setShowPath(false);
    setHintPath([]);
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    initializeGame(mazeSize);
    setBestTimeState(getBestTime(mazeSize));
  }, []);

  useEffect(() => {
    const animate = () => {
      setAnimationTime((prev) => prev + 16);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPlaying && !isComplete) {
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedTime((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    }

    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, isComplete]);

  const movePlayer = useCallback((direction: Direction) => {
    if (isComplete || !isPlaying) return;

    if (canMove(maze, playerPos, direction)) {
      const newPos = getNextPosition(playerPos, direction);
      setPlayerPos(newPos);

      if (newPos.x === endPos.x && newPos.y === endPos.y) {
        setIsComplete(true);
        setIsPlaying(false);
        const finalTime = (Date.now() - startTimeRef.current) / 1000;
        setElapsedTime(finalTime);
        setBestTime(mazeSize, finalTime);
        setBestTimeState(getBestTime(mazeSize));
      }
    }
  }, [maze, playerPos, endPos, isComplete, isPlaying, mazeSize]);

  const setMazeSize = useCallback((size: number) => {
    setMazeSizeState(size);
    setBestTimeState(getBestTime(size));
    initializeGame(size);
  }, [initializeGame]);

  const toggleHint = useCallback(() => {
    if (!showPath && maze.length > 0) {
      const path = findShortestPath(maze, playerPos, endPos);
      setHintPath(path);
    } else if (showPath) {
      setHintPath([]);
    }
    setShowPath((prev) => !prev);
  }, [showPath, maze, playerPos, endPos]);

  const resetGame = useCallback(() => {
    setBestTimeState(getBestTime(mazeSize));
    initializeGame(mazeSize);
  }, [mazeSize, initializeGame]);

  return {
    maze,
    mazeSize,
    playerPos,
    startPos,
    endPos,
    isPlaying,
    isComplete,
    elapsedTime,
    bestTime,
    fogMode,
    currentTheme,
    showPath,
    hintPath,
    setMazeSize,
    setFogMode,
    setCurrentTheme,
    toggleHint,
    movePlayer,
    resetGame,
    animationTime,
  };
};
