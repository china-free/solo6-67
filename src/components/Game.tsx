import { useEffect, useRef, useCallback, useState } from 'react';
import type { Cell, Position, Theme, Direction } from '../types/game';
import { renderMaze } from '../utils/renderer';
import { useKeyboard } from '../hooks/useKeyboard';
import { canMove, getNextPosition } from '../utils/mazeGenerator';
import { MiniMap } from './MiniMap';

interface GameProps {
  maze: Cell[][];
  playerPos: Position;
  startPos: Position;
  endPos: Position;
  theme: Theme;
  fogMode: boolean;
  hintPath: Position[];
  showPath: boolean;
  isComplete: boolean;
  animationTime: number;
  onMove: (direction: Direction) => void;
}

export const Game = ({
  maze,
  playerPos,
  startPos,
  endPos,
  theme,
  fogMode,
  hintPath,
  showPath,
  isComplete,
  animationTime,
  onMove,
}: GameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(25);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  useKeyboard({ onMove, enabled: true });

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const maxSize = Math.min(containerWidth, containerHeight) - 40;
      const size = maze.length;
      const newCellSize = Math.floor(maxSize / size);
      setCellSize(newCellSize);
      setCanvasSize({ width: size * newCellSize, height: size * newCellSize });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [maze.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || maze.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    renderMaze({
      ctx,
      maze,
      playerPos,
      startPos,
      endPos,
      cellSize,
      theme,
      fogMode,
      hintPath,
      showPath,
      animationTime,
      isComplete,
    });
  }, [maze, playerPos, startPos, endPos, cellSize, theme, fogMode, hintPath, showPath, animationTime, isComplete, canvasSize]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStartRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const threshold = cellSize * 0.5;

    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      isDraggingRef.current = true;
      let direction: Direction | null = null;

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? 'right' : 'left';
      } else {
        direction = dy > 0 ? 'down' : 'up';
      }

      if (direction && canMove(maze, playerPos, direction)) {
        onMove(direction);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      }
    }
  }, [maze, playerPos, cellSize, onMove]);

  const handleMouseUp = useCallback(() => {
    dragStartRef.current = null;
    isDraggingRef.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    isDraggingRef.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragStartRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    const threshold = cellSize * 0.5;

    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      isDraggingRef.current = true;
      let direction: Direction | null = null;

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? 'right' : 'left';
      } else {
        direction = dy > 0 ? 'down' : 'up';
      }

      if (direction && canMove(maze, playerPos, direction)) {
        onMove(direction);
        dragStartRef.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  }, [maze, playerPos, cellSize, onMove]);

  const handleTouchEnd = useCallback(() => {
    dragStartRef.current = null;
    isDraggingRef.current = false;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isDraggingRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetCellX = Math.floor(clickX / cellSize);
    const targetCellY = Math.floor(clickY / cellSize);

    const dx = targetCellX - playerPos.x;
    const dy = targetCellY - playerPos.y;

    if (Math.abs(dx) + Math.abs(dy) === 1) {
      let direction: Direction | null = null;
      if (dx === 1) direction = 'right';
      else if (dx === -1) direction = 'left';
      else if (dy === 1) direction = 'down';
      else if (dy === -1) direction = 'up';

      if (direction && canMove(maze, playerPos, direction)) {
        onMove(direction);
      }
    }
  }, [maze, playerPos, cellSize, onMove]);

  if (maze.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-lg animate-pulse">加载中...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-4 right-4 z-10">
        <MiniMap
          maze={maze}
          playerPos={playerPos}
          startPos={startPos}
          endPos={endPos}
          theme={theme}
          animationTime={animationTime}
        />
      </div>

      <div
        className="relative p-5 rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${theme.accentColor}10, transparent)`,
          border: `1px solid ${theme.wallColor}30`,
          boxShadow: `0 0 60px ${theme.wallGlow}20, inset 0 0 60px ${theme.background}50`,
        }}
      >
        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-20"
          style={{
            background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${theme.background}40 2px, ${theme.background}40 4px)`,
          }}
        />

        <canvas
          ref={canvasRef}
          className="block rounded-lg cursor-pointer select-none"
          style={{ touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 md:hidden">
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button
            onTouchStart={() => onMove('up')}
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl active:scale-95 transition-transform"
            style={{ background: `${theme.accentColor}30`, color: theme.accentColor }}
          >
            ↑
          </button>
          <div />
          <button
            onTouchStart={() => onMove('left')}
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl active:scale-95 transition-transform"
            style={{ background: `${theme.accentColor}30`, color: theme.accentColor }}
          >
            ←
          </button>
          <div />
          <button
            onTouchStart={() => onMove('right')}
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl active:scale-95 transition-transform"
            style={{ background: `${theme.accentColor}30`, color: theme.accentColor }}
          >
            →
          </button>
          <div />
          <button
            onTouchStart={() => onMove('down')}
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl active:scale-95 transition-transform"
            style={{ background: `${theme.accentColor}30`, color: theme.accentColor }}
          >
            ↓
          </button>
          <div />
        </div>
      </div>
    </div>
  );
};
