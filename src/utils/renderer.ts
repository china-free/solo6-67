import type { Cell, Position, Theme } from '../types/game';

interface RenderOptions {
  ctx: CanvasRenderingContext2D;
  maze: Cell[][];
  playerPos: Position;
  startPos: Position;
  endPos: Position;
  cellSize: number;
  theme: Theme;
  fogMode: boolean;
  hintPath: Position[];
  showPath: boolean;
  animationTime: number;
  isComplete: boolean;
}

export const renderMaze = (options: RenderOptions) => {
  const { ctx, maze, playerPos, startPos, endPos, cellSize, theme, fogMode, hintPath, showPath, animationTime, isComplete } = options;
  const size = maze.length;
  const canvasWidth = size * cellSize;
  const canvasHeight = size * cellSize;

  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  if (showPath && hintPath.length > 0) {
    renderHintPath(ctx, hintPath, cellSize, theme, animationTime);
  }

  renderStartEnd(ctx, startPos, endPos, cellSize, theme, animationTime);
  renderWalls(ctx, maze, cellSize, theme);
  renderPlayer(ctx, playerPos, cellSize, theme, animationTime, isComplete);

  if (fogMode) {
    renderFog(ctx, playerPos, cellSize, size, theme, animationTime);
  }
};

const renderWalls = (
  ctx: CanvasRenderingContext2D,
  maze: Cell[][],
  cellSize: number,
  theme: Theme
) => {
  ctx.strokeStyle = theme.wallColor;
  ctx.lineWidth = 2;
  ctx.shadowColor = theme.wallGlow;
  ctx.shadowBlur = 8;

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const cell = maze[y][x];
      const px = x * cellSize;
      const py = y * cellSize;

      ctx.beginPath();
      if (cell.walls.top) {
        ctx.moveTo(px, py);
        ctx.lineTo(px + cellSize, py);
      }
      if (cell.walls.right) {
        ctx.moveTo(px + cellSize, py);
        ctx.lineTo(px + cellSize, py + cellSize);
      }
      if (cell.walls.bottom) {
        ctx.moveTo(px, py + cellSize);
        ctx.lineTo(px + cellSize, py + cellSize);
      }
      if (cell.walls.left) {
        ctx.moveTo(px, py);
        ctx.lineTo(px, py + cellSize);
      }
      ctx.stroke();
    }
  }

  ctx.shadowBlur = 0;
};

const renderStartEnd = (
  ctx: CanvasRenderingContext2D,
  startPos: Position,
  endPos: Position,
  cellSize: number,
  theme: Theme,
  time: number
) => {
  const pulseScale = 1 + Math.sin(time * 0.005) * 0.1;
  const markerSize = (cellSize * 0.4) * pulseScale;

  ctx.shadowColor = theme.startColor;
  ctx.shadowBlur = 15;
  ctx.fillStyle = theme.startColor;

  const startX = startPos.x * cellSize + cellSize / 2;
  const startY = startPos.y * cellSize + cellSize / 2;
  drawStar(ctx, startX, startY, markerSize * 0.6, markerSize, 5);

  ctx.shadowColor = theme.endColor;
  ctx.fillStyle = theme.endColor;

  const endX = endPos.x * cellSize + cellSize / 2;
  const endY = endPos.y * cellSize + cellSize / 2;
  drawStar(ctx, endX, endY, markerSize * 0.6, markerSize, 5);

  ctx.shadowBlur = 0;
};

const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  points: number
) => {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
};

const renderPlayer = (
  ctx: CanvasRenderingContext2D,
  playerPos: Position,
  cellSize: number,
  theme: Theme,
  time: number,
  isComplete: boolean
) => {
  const x = playerPos.x * cellSize + cellSize / 2;
  const y = playerPos.y * cellSize + cellSize / 2;
  const radius = cellSize * 0.35;

  if (isComplete) {
    const hue = (time * 0.3) % 360;
    ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
  } else {
    ctx.shadowColor = theme.playerGlow;
    ctx.fillStyle = theme.playerColor;
  }
  ctx.shadowBlur = 20;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  const innerRadius = radius * 0.5;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(x - radius * 0.2, y - radius * 0.2, innerRadius * 0.4, 0, Math.PI * 2);
  ctx.fill();
};

const renderHintPath = (
  ctx: CanvasRenderingContext2D,
  hintPath: Position[],
  cellSize: number,
  theme: Theme,
  time: number
) => {
  for (let i = 0; i < hintPath.length; i++) {
    const pos = hintPath[i];
    const x = pos.x * cellSize + cellSize / 2;
    const y = pos.y * cellSize + cellSize / 2;

    const pulse = Math.sin(time * 0.01 + i * 0.3) * 0.3 + 0.7;
    const dotSize = (cellSize * 0.2) * pulse;

    ctx.fillStyle = theme.pathColor;
    ctx.shadowColor = theme.pathColor;
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.8;

    ctx.beginPath();
    ctx.arc(x, y, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
};

const renderFog = (
  ctx: CanvasRenderingContext2D,
  playerPos: Position,
  cellSize: number,
  size: number,
  theme: Theme,
  time: number
) => {
  const centerX = playerPos.x * cellSize + cellSize / 2;
  const centerY = playerPos.y * cellSize + cellSize / 2;
  const fogRadius = cellSize * 5;

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';

  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, fogRadius
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.6, theme.fogColor.replace('0.95', '0.7'));
  gradient.addColorStop(1, theme.fogColor);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size * cellSize, size * cellSize);

  const noiseIntensity = 0.02 + Math.sin(time * 0.003) * 0.01;
  ctx.fillStyle = `rgba(0, 0, 0, ${noiseIntensity})`;
  for (let i = 0; i < 50; i++) {
    const nx = Math.random() * size * cellSize;
    const ny = Math.random() * size * cellSize;
    const dist = Math.sqrt((nx - centerX) ** 2 + (ny - centerY) ** 2);
    if (dist > fogRadius * 0.3) {
      ctx.fillRect(nx, ny, 2, 2);
    }
  }

  ctx.restore();
};

export const renderMiniMap = (
  ctx: CanvasRenderingContext2D,
  maze: Cell[][],
  playerPos: Position,
  startPos: Position,
  endPos: Position,
  theme: Theme,
  time: number
) => {
  const size = maze.length;
  const canvasSize = Math.min(150, size * 5);
  const cellSize = canvasSize / size;

  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  ctx.strokeStyle = theme.wallColor;
  ctx.lineWidth = 1;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = maze[y][x];
      const px = x * cellSize;
      const py = y * cellSize;

      ctx.beginPath();
      if (cell.walls.top) {
        ctx.moveTo(px, py);
        ctx.lineTo(px + cellSize, py);
      }
      if (cell.walls.right) {
        ctx.moveTo(px + cellSize, py);
        ctx.lineTo(px + cellSize, py + cellSize);
      }
      if (cell.walls.bottom) {
        ctx.moveTo(px, py + cellSize);
        ctx.lineTo(px + cellSize, py + cellSize);
      }
      if (cell.walls.left) {
        ctx.moveTo(px, py);
        ctx.lineTo(px, py + cellSize);
      }
      ctx.stroke();
    }
  }

  ctx.fillStyle = theme.startColor;
  ctx.fillRect(
    startPos.x * cellSize + cellSize * 0.2,
    startPos.y * cellSize + cellSize * 0.2,
    cellSize * 0.6,
    cellSize * 0.6
  );

  ctx.fillStyle = theme.endColor;
  ctx.fillRect(
    endPos.x * cellSize + cellSize * 0.2,
    endPos.y * cellSize + cellSize * 0.2,
    cellSize * 0.6,
    cellSize * 0.6
  );

  const pulse = Math.sin(time * 0.01) * 0.2 + 0.8;
  ctx.fillStyle = theme.playerColor;
  ctx.shadowColor = theme.playerGlow;
  ctx.shadowBlur = 5;
  ctx.beginPath();
  ctx.arc(
    playerPos.x * cellSize + cellSize / 2,
    playerPos.y * cellSize + cellSize / 2,
    (cellSize * 0.4) * pulse,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.shadowBlur = 0;
};
