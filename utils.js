export function randomCell(gridSize) {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  };
}

export function cellsMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function withinBounds(cell, gridSize) {
  return cell.x >= 0 && cell.x < gridSize && cell.y >= 0 && cell.y < gridSize;
}

