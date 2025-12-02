import { GRID_SIZE } from "./constants.js";
import { randomCell } from "./utils.js";

export class Food {
  constructor() {
    this.position = randomCell(GRID_SIZE);
  }

  respawn(occupiedCells) {
    let newCell = randomCell(GRID_SIZE);
    const occupiedKey = new Set(occupiedCells.map((cell) => `${cell.x},${cell.y}`));
    let attempts = 0;
    while (occupiedKey.has(`${newCell.x},${newCell.y}`) && attempts < 100) {
      newCell = randomCell(GRID_SIZE);
      attempts += 1;
    }
    this.position = newCell;
  }
}

