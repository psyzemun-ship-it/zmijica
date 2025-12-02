import { INITIAL_SPEED, SPEED_INCREMENT, MAX_SPEED } from "./constants.js";
import { Snake } from "./snake.js";
import { Food } from "./food.js";
import { Renderer } from "./renderer.js";

export class Game {
  constructor({ canvas, scoreEl, bestEl, speedEl, overlay, overlayTitle, overlayText }) {
    this.snake = new Snake();
    this.food = new Food();
    this.renderer = new Renderer(canvas);
    this.score = 0;
    this.bestScore = Number(localStorage.getItem("zmijica:best") || 0);
    this.speed = INITIAL_SPEED;
    this.lastUpdate = 0;
    this.running = false;
    this.scoreEl = scoreEl;
    this.bestEl = bestEl;
    this.speedEl = speedEl;
    this.overlay = overlay;
    this.overlayTitle = overlayTitle;
    this.overlayText = overlayText;
    this.updateHUD();
    this.showOverlay("Spremno!", "Pritisni smer da počneš.");
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastUpdate = performance.now();
    requestAnimationFrame((timestamp) => this.loop(timestamp));
    this.hideOverlay();
  }

  loop(timestamp) {
    if (!this.running) return;
    const delta = (timestamp - this.lastUpdate) / 1000;
    const threshold = 1 / this.speed;
    if (delta >= threshold) {
      this.lastUpdate = timestamp;
      this.update();
      this.render();
    }
    requestAnimationFrame((time) => this.loop(time));
  }

  update() {
    if (!this.snake.alive) {
      this.endGame();
      return;
    }
    this.snake.update();
    if (!this.snake.alive) {
      this.endGame();
      return;
    }
    if (this.snake.intersects(this.food.position)) {
      this.snake.grow(2);
      this.score += 10;
      this.speed = Math.min(this.speed + SPEED_INCREMENT, MAX_SPEED);
      this.food.respawn(this.snake.segments);
      this.updateHUD();
    }
  }

  render() {
    this.renderer.clear();
    this.renderer.drawGrid();
    this.renderer.drawFood(this.food.position);
    this.renderer.drawSnake(this.snake.segments);
  }

  handleDirection(direction) {
    if (!direction) return;
    this.snake.setDirection(direction);
    if (!this.running) {
      this.start();
    }
  }

  endGame() {
    // zaštita od buga gde igra odmah javlja kraj pri samom startu
    if (this.score === 0 && this.snake && this.snake.steps === 0) {
      this.reset();
      return;
    }

    this.running = false;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem("zmijica:best", String(this.bestScore));
    }
    this.showOverlay("Kraj igre", "Klikni Nova igra ili pritisni Enter.");
    this.updateHUD();
  }

  reset() {
    this.snake.reset();
    this.food.respawn(this.snake.segments);
    this.score = 0;
    this.speed = INITIAL_SPEED;
    this.running = false;
    this.updateHUD();
    this.render();
    this.showOverlay("Spremno!", "Pritisni smer da počneš.");
  }

  updateHUD() {
    this.scoreEl.textContent = this.score;
    this.bestEl.textContent = this.bestScore;
    this.speedEl.textContent = `${this.speed.toFixed(1)}x`;
  }

  showOverlay(title, text) {
    this.overlayTitle.textContent = title;
    this.overlayText.textContent = text;
    this.overlay.hidden = false;
  }

  hideOverlay() {
    this.overlay.hidden = true;
  }
}

