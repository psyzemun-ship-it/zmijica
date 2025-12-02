export const GRID_SIZE = 20;
export const CELL_SIZE = 32; // canvas 640 = 20*32
export const INITIAL_SPEED = 6; // moves per second
export const SPEED_INCREMENT = 0.3;
export const MAX_SPEED = 14;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const KEYBOARD_MAP = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
};

