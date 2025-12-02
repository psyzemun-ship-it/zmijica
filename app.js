(() => {
  const GRID = 20;
  const INITIAL_SPEED = 6; // moves per second
  const SPEED_STEP = 0.3;
  const MAX_SPEED = 14;

  const VECTORS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  const KEYBOARD_MAP = {
    ArrowUp: "up",
    KeyW: "up",
    ArrowDown: "down",
    KeyS: "down",
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right",
  };

  const randomCell = () => ({
    x: Math.floor(Math.random() * GRID),
    y: Math.floor(Math.random() * GRID),
  });

  const cellsEqual = (a, b) => a.x === b.x && a.y === b.y;

  const createSnake = () => {
    const center = Math.floor(GRID / 2);
    return [
      { x: center, y: center },
      { x: center - 1, y: center },
    ];
  };

  const drawBoard = (ctx, size) => {
    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID; i += 1) {
      const offset = (i / GRID) * size;
      ctx.beginPath();
      ctx.moveTo(offset, 0);
      ctx.lineTo(offset, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, offset);
      ctx.lineTo(size, offset);
      ctx.stroke();
    }
  };

  const drawSnake = (ctx, snake, cell) => {
    ctx.fillStyle = "#fefefe";
    ctx.strokeStyle = "rgba(10, 10, 15, 0.6)";
    ctx.lineWidth = cell * 0.12;
    snake.forEach((segment, index) => {
      const x = segment.x * cell;
      const y = segment.y * cell;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x + cell * 0.15, y + cell * 0.15, cell * 0.7, cell * 0.7, index === 0 ? cell * 0.35 : cell * 0.25);
      } else {
        ctx.rect(x + cell * 0.15, y + cell * 0.15, cell * 0.7, cell * 0.7);
      }
      ctx.fill();
      ctx.stroke();
    });
  };

  const drawFood = (ctx, food, cell) => {
    ctx.fillStyle = "#f97316";
    ctx.shadowColor = "#f97316aa";
    ctx.shadowBlur = cell * 0.35;
    ctx.beginPath();
    ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const bootstrap = () => {
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const resizeCanvas = () => {
      const wrapper = canvas.parentElement;
      const size = Math.min(wrapper.clientWidth || 640, 640);
      const ratio = window.devicePixelRatio || 1;
      canvas.width = size * ratio;
      canvas.height = size * ratio;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resizeCanvas();

    const scoreEl = document.getElementById("score-value");
    const bestEl = document.getElementById("best-value");
    const speedEl = document.getElementById("speed-value");
    const overlay = document.getElementById("overlay");
    const overlayTitle = document.getElementById("overlay-title");
    const overlayText = document.getElementById("overlay-text");
    const restartBtn = document.getElementById("restart-btn");
    const controlButtons = document.querySelectorAll(".control-btn");

    let snake = createSnake();
    let direction = "right";
    let nextDirection = "right";
    let food = randomCell();
    let score = 0;
    let best = Number(localStorage.getItem("zmijica:best") || 0);
    let speed = INITIAL_SPEED;
    let running = false;
    let rafId = null;
    let lastTick = 0;

    const hideOverlay = () => {
      overlay.hidden = true;
    };

    const showOverlay = (title, text) => {
      overlayTitle.textContent = title;
      overlayText.textContent = text;
      overlay.hidden = false;
    };

    const updateHUD = () => {
      scoreEl.textContent = score;
      bestEl.textContent = best;
      speedEl.textContent = `${speed.toFixed(1)}x`;
    };

    const placeFood = () => {
      let cell = randomCell();
      while (snake.some((segment) => cellsEqual(segment, cell))) {
        cell = randomCell();
      }
      food = cell;
    };

    const render = () => {
      const size = canvas.width / (window.devicePixelRatio || 1);
      const cell = size / GRID;
      drawBoard(ctx, size);
      drawFood(ctx, food, cell);
      drawSnake(ctx, snake, cell);
    };

    window.addEventListener("resize", () => {
      resizeCanvas();
      render();
    });

    const resetGame = (showIntro = true) => {
      snake = createSnake();
      direction = "right";
      nextDirection = "right";
      score = 0;
      speed = INITIAL_SPEED;
      running = false;
      lastTick = 0;
      placeFood();
      updateHUD();
      render();
      if (showIntro) {
        showOverlay("Spremno!", "Pritisni smer da krene.");
      } else {
        hideOverlay();
      }
    };

    const changeDirection = (next) => {
      if (!VECTORS[next]) return;
      const currVec = VECTORS[direction];
      const nextVec = VECTORS[next];
      if (currVec.x + nextVec.x === 0 && currVec.y + nextVec.y === 0) {
        return;
      }
      nextDirection = next;
      if (!running) {
        startGame();
      }
    };

    const step = () => {
      direction = nextDirection;
      const vector = VECTORS[direction];
      const head = snake[0];
      const newHead = { x: head.x + vector.x, y: head.y + vector.y };

      const outOfBounds =
        newHead.x < 0 || newHead.x >= GRID || newHead.y < 0 || newHead.y >= GRID;
      const hitsSelf = snake.some((segment) => cellsEqual(segment, newHead));
      if (outOfBounds || hitsSelf) {
        endGame();
        return;
      }

      snake.unshift(newHead);
      if (cellsEqual(newHead, food)) {
        score += 10;
        speed = Math.min(speed + SPEED_STEP, MAX_SPEED);
        placeFood();
        updateHUD();
      } else {
        snake.pop();
      }
    };

    const loop = (timestamp) => {
      if (!running) return;
      const delta = (timestamp - lastTick) / 1000;
      const threshold = 1 / speed;
      if (delta >= threshold) {
        lastTick = timestamp;
        step();
        render();
      }
      rafId = requestAnimationFrame(loop);
    };

    const startGame = () => {
      if (running) return;
      running = true;
      hideOverlay();
      lastTick = performance.now();
      rafId = requestAnimationFrame(loop);
    };

    const endGame = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (score > best) {
        best = score;
        localStorage.setItem("zmijica:best", String(best));
      }
      updateHUD();
      showOverlay("Kraj igre", "Klikni Nova igra ili pritisni Enter.");
    };

    document.addEventListener("keydown", (event) => {
      if (event.code === "Enter") {
        event.preventDefault();
        resetGame(false);
        startGame();
        return;
      }
      const next = KEYBOARD_MAP[event.code];
      if (next) {
        event.preventDefault();
        changeDirection(next);
      }
    });

    controlButtons.forEach((btn) =>
      btn.addEventListener("click", () => {
        const dir = btn.dataset.direction;
        changeDirection(dir);
      }),
    );

    restartBtn.addEventListener("click", () => {
      resetGame(false);
      startGame();
    });

    resetGame();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();

