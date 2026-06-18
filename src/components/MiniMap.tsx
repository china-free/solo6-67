import { useEffect, useRef } from 'react';
import type { Cell, Position, Theme } from '../types/game';
import { renderMiniMap } from '../utils/renderer';

interface MiniMapProps {
  maze: Cell[][];
  playerPos: Position;
  startPos: Position;
  endPos: Position;
  theme: Theme;
  animationTime: number;
}

export const MiniMap = ({ maze, playerPos, startPos, endPos, theme, animationTime }: MiniMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || maze.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(150, maze.length * 5);
    canvas.width = size;
    canvas.height = size;

    renderMiniMap(ctx, maze, playerPos, startPos, endPos, theme, animationTime);
  }, [maze, playerPos, startPos, endPos, theme, animationTime]);

  if (maze.length === 0) return null;

  return (
    <div
      className="rounded-lg p-3 backdrop-blur-sm"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        border: `1px solid ${theme.wallColor}40`,
        boxShadow: `0 0 20px ${theme.wallGlow}20`,
      }}
    >
      <div className="text-xs text-gray-400 mb-2 text-center">小地图</div>
      <canvas ref={canvasRef} className="block mx-auto rounded" />
    </div>
  );
};
