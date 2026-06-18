import type { Cell, Position, Direction } from '../types/game';

export const createCell = (x: number, y: number): Cell => ({
  x,
  y,
  walls: {
    top: true,
    right: true,
    bottom: true,
    left: true,
  },
  visited: false,
});

export const generateMaze = (size: number): Cell[][] => {
  const maze: Cell[][] = [];

  for (let y = 0; y < size; y++) {
    maze[y] = [];
    for (let x = 0; x < size; x++) {
      maze[y][x] = createCell(x, y);
    }
  }

  const stack: Cell[] = [];
  const startCell = maze[0][0];
  startCell.visited = true;
  stack.push(startCell);

  const getUnvisitedNeighbors = (cell: Cell): Cell[] => {
    const neighbors: Cell[] = [];
    const { x, y } = cell;

    if (y > 0 && !maze[y - 1][x].visited) neighbors.push(maze[y - 1][x]);
    if (x < size - 1 && !maze[y][x + 1].visited) neighbors.push(maze[y][x + 1]);
    if (y < size - 1 && !maze[y + 1][x].visited) neighbors.push(maze[y + 1][x]);
    if (x > 0 && !maze[y][x - 1].visited) neighbors.push(maze[y][x - 1]);

    return neighbors;
  };

  const removeWall = (current: Cell, next: Cell) => {
    const dx = next.x - current.x;
    const dy = next.y - current.y;

    if (dx === 1) {
      current.walls.right = false;
      next.walls.left = false;
    } else if (dx === -1) {
      current.walls.left = false;
      next.walls.right = false;
    } else if (dy === 1) {
      current.walls.bottom = false;
      next.walls.top = false;
    } else if (dy === -1) {
      current.walls.top = false;
      next.walls.bottom = false;
    }
  };

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current);

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      next.visited = true;
      removeWall(current, next);
      stack.push(next);
    } else {
      stack.pop();
    }
  }

  return maze;
};

export const canMove = (
  maze: Cell[][],
  pos: Position,
  direction: Direction
): boolean => {
  const { x, y } = pos;
  const size = maze.length;

  if (x < 0 || x >= size || y < 0 || y >= size) return false;

  const cell = maze[y][x];

  switch (direction) {
    case 'up':
      return y > 0 && !cell.walls.top;
    case 'down':
      return y < size - 1 && !cell.walls.bottom;
    case 'left':
      return x > 0 && !cell.walls.left;
    case 'right':
      return x < size - 1 && !cell.walls.right;
    default:
      return false;
  }
};

export const getNextPosition = (pos: Position, direction: Direction): Position => {
  switch (direction) {
    case 'up':
      return { x: pos.x, y: pos.y - 1 };
    case 'down':
      return { x: pos.x, y: pos.y + 1 };
    case 'left':
      return { x: pos.x - 1, y: pos.y };
    case 'right':
      return { x: pos.x + 1, y: pos.y };
    default:
      return pos;
  }
};
