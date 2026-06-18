import type { Cell, Position } from '../types/game';

interface Node {
  pos: Position;
  parent: Node | null;
}

export const findShortestPath = (
  maze: Cell[][],
  start: Position,
  end: Position
): Position[] => {
  const size = maze.length;
  const queue: Node[] = [];
  const visited = new Set<string>();

  const startNode: Node = { pos: start, parent: null };
  queue.push(startNode);
  visited.add(`${start.x},${start.y}`);

  const getKey = (pos: Position) => `${pos.x},${pos.y}`;

  const getNeighbors = (node: Node): Node[] => {
    const neighbors: Node[] = [];
    const { x, y } = node.pos;
    const cell = maze[y][x];

    if (!cell.walls.top && y > 0) {
      neighbors.push({ pos: { x, y: y - 1 }, parent: node });
    }
    if (!cell.walls.right && x < size - 1) {
      neighbors.push({ pos: { x: x + 1, y }, parent: node });
    }
    if (!cell.walls.bottom && y < size - 1) {
      neighbors.push({ pos: { x, y: y + 1 }, parent: node });
    }
    if (!cell.walls.left && x > 0) {
      neighbors.push({ pos: { x: x - 1, y }, parent: node });
    }

    return neighbors;
  };

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.pos.x === end.x && current.pos.y === end.y) {
      const path: Position[] = [];
      let node: Node | null = current;
      while (node) {
        path.unshift(node.pos);
        node = node.parent;
      }
      return path;
    }

    const neighbors = getNeighbors(current);
    for (const neighbor of neighbors) {
      const key = getKey(neighbor.pos);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(neighbor);
      }
    }
  }

  return [];
};
