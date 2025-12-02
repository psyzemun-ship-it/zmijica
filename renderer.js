import { CELL_SIZE, GRID_SIZE } from "./constants.js";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.gradient = null;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    // koristi veličinu wrappera umesto samog canvas-a (canvas često ima 0 height)
    const wrapper = this.canvas.parentElement || this.canvas;
    const baseSize = wrapper.clientWidth || 640;
    const size = baseSize; // kvadratna tabla
    const ratio = window.devicePixelRatio || 1;
    this.canvas.width = size * ratio;
    this.canvas.height = size * ratio;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.drawBackground();
  }

  drawBackground() {
    const { ctx, canvas } = this;
    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    this.gradient.addColorStop(0, "rgba(74, 222, 128, 0.2)");
    this.gradient.addColorStop(1, "rgba(74, 222, 128, 0.05)");
  }

  clear() {
    this.drawBackground();
  }

  drawGrid() {
    const { ctx } = this;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i += 1) {
      const offset = i * (this.canvas.width / GRID_SIZE);
      ctx.beginPath();
      ctx.moveTo(offset, 0);
      ctx.lineTo(offset, this.canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, offset);
      ctx.lineTo(this.canvas.width, offset);
      ctx.stroke();
    }
  }

  drawSnake(segments) {
    const { ctx, canvas } = this;
    const unit = canvas.width / GRID_SIZE;
    ctx.fillStyle = this.gradient;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    ctx.lineWidth = unit * 0.08;
    segments.forEach((segment, index) => {
      const x = segment.x * unit;
      const y = segment.y * unit;
      const radius = unit * 0.3 + (index === 0 ? unit * 0.05 : 0);
      ctx.beginPath();
      ctx.roundRect(x + unit * 0.1, y + unit * 0.1, unit * 0.8, unit * 0.8, radius);
      ctx.fill();
      ctx.stroke();
    });
  }

  drawFood(position) {
    const { ctx, canvas } = this;
    const unit = canvas.width / GRID_SIZE;
    const x = position.x * unit + unit / 2;
    const y = position.y * unit + unit / 2;
    const radius = unit * 0.35;
    ctx.beginPath();
    ctx.fillStyle = "#f97316";
    ctx.shadowColor = "#f97316aa";
    ctx.shadowBlur = 15;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

