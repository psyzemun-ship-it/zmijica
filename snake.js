import { DIRECTIONS, GRID_SIZE } from "./constants.js";
import { cellsMatch, withinBounds } from "./utils.js";

export class Snake {
  constructor() {
    const center = Math.floor(GRID_SIZE / 2);
    this.segments = [
      { x: center, y: center },
      { x: center - 1, y: center },
    ];
    this.direction = "right";
    this.nextDirection = "right";
    this.growSegments = 0;
    this.alive = true;
    this.steps = 0;
  }

  setDirection(direction) {
    if (!DIRECTIONS[direction]) return;
    const currentVector = DIRECTIONS[this.direction];
    const nextVector = DIRECTIONS[direction];
    // prevent direct reversal
    if (currentVector.x + nextVector.x === 0 && currentVector.y + nextVector.y === 0) {
      return;
    }
    this.nextDirection = direction;
  }

  update() {
    if (!this.alive) return;
    this.direction = this.nextDirection;
    const vector = DIRECTIONS[this.direction];
    const head = this.segments[0];
    const newHead = { x: head.x + vector.x, y: head.y + vector.y };

    if (!withinBounds(newHead, GRID_SIZE) || this.intersects(newHead)) {
      this.alive = false;
      return;
    }

    this.segments.unshift(newHead);
    if (this.growSegments > 0) {
      this.growSegments -= 1;
    } else {
      this.segments.pop();
    }
    this.steps += 1;
  }

  grow(amount = 1) {
    this.growSegments += amount;
  }

  intersects(cell) {
    return this.segments.some((segment) => cellsMatch(segment, cell));
  }

  reset() {
    const center = Math.floor(GRID_SIZE / 2);
    this.segments = [
      { x: center, y: center },
      { x: center - 1, y: center },
    ];
    this.direction = "right";
    this.nextDirection = "right";
    this.growSegments = 0;
    this.alive = true;
    this.steps = 0;
  }
}

