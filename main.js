import { Game } from "./game.js";
import { InputManager } from "./inputManager.js";

const canvas = document.getElementById("game-canvas");
const scoreEl = document.getElementById("score-value");
const bestEl = document.getElementById("best-value");
const speedEl = document.getElementById("speed-value");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const restartBtn = document.getElementById("restart-btn");
const controlButtons = document.querySelectorAll(".control-btn");

const game = new Game({
  canvas,
  scoreEl,
  bestEl,
  speedEl,
  overlay,
  overlayTitle,
  overlayText,
});

const input = new InputManager();
input.bindButtons(controlButtons);
input.onDirectionChange((direction) => game.handleDirection(direction));

const kickstart = () => {
  game.reset();
  // Simulate početni smer da bi petlja odmah krenula
  game.handleDirection("right");
};

restartBtn.addEventListener("click", () => kickstart());
document.addEventListener("keydown", (event) => {
  if (event.code === "Enter") {
    event.preventDefault();
    kickstart();
  }
});

// render initial state
game.render();

