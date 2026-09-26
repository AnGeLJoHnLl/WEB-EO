/**
 * Minijuego: Tetris Arcade Retro
 * Matriz clásica 10x20 con colores neón, ghost piece y panel de siguiente pieza.
 */

class TetrisGame {
  constructor(canvasId, nextCanvasId) {
    this.canvas = document.getElementById(canvasId);
    this.nextCanvas = document.getElementById(nextCanvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.nextCtx = this.nextCanvas ? this.nextCanvas.getContext("2d") : null;

    this.COLS = 10;
    this.ROWS = 20;
    this.BLOCK_SIZE = 20; // 200x400

    this.grid = [];
    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.highScore = parseInt(localStorage.getItem("tetris_high_score") || "0", 10);
    this.isRunning = false;
    this.isPaused = false;
    this.dropInterval = 800; // ms
    this.lastTime = 0;
    this.dropCounter = 0;
    this.animationId = null;

    // Tetromino definitions
    this.SHAPES = {
      I: { shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], color: "#00f2fe" },
      J: { shape: [[1,0,0],[1,1,1],[0,0,0]], color: "#3a86ff" },
      L: { shape: [[0,0,1],[1,1,1],[0,0,0]], color: "#ffbe0b" },
      O: { shape: [[1,1],[1,1]], color: "#ffe600" },
      S: { shape: [[0,1,1],[1,1,0],[0,0,0]], color: "#06d6a0" },
      T: { shape: [[0,1,0],[1,1,1],[0,0,0]], color: "#9d4edd" },
      Z: { shape: [[1,1,0],[0,1,1],[0,0,0]], color: "#ff007f" }
    };
    this.SHAPE_KEYS = Object.keys(this.SHAPES);

    this.initControls();
    this.resetGrid();
    this.draw();
  }

  resetGrid() {
    this.grid = [];
    for (let r = 0; r < this.ROWS; r++) {
      this.grid.push(new Array(this.COLS).fill(0));
    }
  }

  start() {
    this.resetGrid();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropInterval = 800;
    this.nextPiece = this.randomPiece();
    this.spawnPiece();
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.dropCounter = 0;
    this.updateUI();

    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.drawGameOver();
  }

  togglePause() {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;
    if (!this.isPaused) {
      this.lastTime = performance.now();
      this.loop();
    } else {
      this.draw();
    }
  }

  randomPiece() {
    const key = this.SHAPE_KEYS[Math.floor(Math.random() * this.SHAPE_KEYS.length)];
    const def = this.SHAPES[key];
    return {
      shape: def.shape.map((row) => [...row]),
      color: def.color,
      x: 0,
      y: 0
    };
  }

  spawnPiece() {
    this.currentPiece = this.nextPiece;
    this.currentPiece.x = Math.floor((this.COLS - this.currentPiece.shape[0].length) / 2);
    this.currentPiece.y = 0;
    this.nextPiece = this.randomPiece();

    if (this.collide(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
      this.stop();
    }

    this.drawNextPiece();
  }

  collide(x, y, shape) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const newX = x + c;
        const newY = y + r;

        if (newX < 0 || newX >= this.COLS || newY >= this.ROWS) {
          return true;
        }
        if (newY >= 0 && this.grid[newY][newX]) {
          return true;
        }
      }
    }
    return false;
  }

  rotate(matrix) {
    const N = matrix.length;
    const result = [];
    for (let i = 0; i < matrix[0].length; i++) {
      result.push([]);
      for (let j = N - 1; j >= 0; j--) {
        result[i].push(matrix[j][i]);
      }
    }
    return result;
  }

  rotateCurrent() {
    if (!this.isRunning || this.isPaused) return;
    const rotated = this.rotate(this.currentPiece.shape);
    let offset = 0;
    while (this.collide(this.currentPiece.x + offset, this.currentPiece.y, rotated)) {
      offset = offset > 0 ? -(offset + 1) : -offset + 1;
      if (Math.abs(offset) > rotated[0].length) {
        return; // No cabe
      }
    }
    this.currentPiece.x += offset;
    this.currentPiece.shape = rotated;
    this.draw();
  }

  moveLeft() {
    if (!this.isRunning || this.isPaused) return;
    if (!this.collide(this.currentPiece.x - 1, this.currentPiece.y, this.currentPiece.shape)) {
      this.currentPiece.x--;
      this.draw();
    }
  }

  moveRight() {
    if (!this.isRunning || this.isPaused) return;
    if (!this.collide(this.currentPiece.x + 1, this.currentPiece.y, this.currentPiece.shape)) {
      this.currentPiece.x++;
      this.draw();
    }
  }

  drop() {
    if (!this.isRunning || this.isPaused) return;
    if (!this.collide(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
      this.currentPiece.y++;
      this.score += 1;
      this.updateUI();
    } else {
      this.lockPiece();
    }
    this.dropCounter = 0;
    this.draw();
  }

  hardDrop() {
    if (!this.isRunning || this.isPaused) return;
    let added = 0;
    while (!this.collide(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
      this.currentPiece.y++;
      added += 2;
    }
    this.score += added;
    this.lockPiece();
    this.draw();
  }

  lockPiece() {
    const shape = this.currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const py = this.currentPiece.y + r;
          const px = this.currentPiece.x + c;
          if (py >= 0) {
            this.grid[py][px] = this.currentPiece.color;
          }
        }
      }
    }

    this.clearLines();
    this.spawnPiece();
  }

  clearLines() {
    let linesCleared = 0;
    for (let r = this.ROWS - 1; r >= 0; r--) {
      if (this.grid[r].every((cell) => cell !== 0)) {
        this.grid.splice(r, 1);
        this.grid.unshift(new Array(this.COLS).fill(0));
        linesCleared++;
        r++; // revisar misma fila desplazada
      }
    }

    if (linesCleared > 0) {
      const lineScores = [0, 100, 300, 500, 800];
      this.score += (lineScores[linesCleared] || 1000) * this.level;
      this.lines += linesCleared;
      this.level = Math.floor(this.lines / 10) + 1;
      this.dropInterval = Math.max(100, 800 - (this.level - 1) * 70);

      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem("tetris_high_score", this.highScore.toString());
      }
      this.updateUI();
    }
  }

  loop(now = 0) {
    if (!this.isRunning) return;
    if (this.isPaused) return;

    const deltaTime = now - this.lastTime;
    this.lastTime = now;
    this.dropCounter += deltaTime;

    if (this.dropCounter > this.dropInterval) {
      this.drop();
    }

    this.draw();
    this.animationId = requestAnimationFrame((t) => this.loop(t));
  }

  draw() {
    this.ctx.fillStyle = "#090a10";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Cuadrícula sutil
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        this.ctx.strokeRect(c * this.BLOCK_SIZE, r * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
      }
    }

    // Piezas fijadas
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (this.grid[r][c]) {
          this.drawBlock(this.ctx, c, r, this.grid[r][c]);
        }
      }
    }

    // Pieza actual y fantasma
    if (this.currentPiece) {
      // Fantasma (ghost piece)
      let ghostY = this.currentPiece.y;
      while (!this.collide(this.currentPiece.x, ghostY + 1, this.currentPiece.shape)) {
        ghostY++;
      }
      this.drawPiece(this.ctx, this.currentPiece.shape, this.currentPiece.x, ghostY, "rgba(255,255,255,0.18)");

      // Pieza real
      this.drawPiece(this.ctx, this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y, this.currentPiece.color);
    }

    if (this.isPaused) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "#00f2fe";
      this.ctx.font = "bold 20px monospace";
      this.ctx.textAlign = "center";
      this.ctx.fillText("PAUSADO", this.canvas.width / 2, this.canvas.height / 2);
    }
  }

  drawBlock(ctx, x, y, color) {
    const px = x * this.BLOCK_SIZE;
    const py = y * this.BLOCK_SIZE;
    ctx.fillStyle = color;
    ctx.fillRect(px + 1, py + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillRect(px + 2, py + 2, this.BLOCK_SIZE - 4, 3);
  }

  drawPiece(ctx, shape, offsetX, offsetY, color) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          if (color.startsWith("rgba")) {
            ctx.strokeStyle = color;
            ctx.strokeRect((offsetX + c) * this.BLOCK_SIZE + 1, (offsetY + r) * this.BLOCK_SIZE + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
          } else {
            this.drawBlock(ctx, offsetX + c, offsetY + r, color);
          }
        }
      }
    }
  }

  drawNextPiece() {
    if (!this.nextCtx || !this.nextPiece) return;
    this.nextCtx.fillStyle = "#0c0d18";
    this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

    const shape = this.nextPiece.shape;
    const size = 16;
    const offX = (this.nextCanvas.width - shape[0].length * size) / 2;
    const offY = (this.nextCanvas.height - shape.length * size) / 2;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          this.nextCtx.fillStyle = this.nextPiece.color;
          this.nextCtx.fillRect(offX + c * size, offY + r * size, size - 2, size - 2);
        }
      }
    }
  }

  drawGameOver() {
    this.ctx.fillStyle = "rgba(10, 10, 20, 0.85)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#ff007f";
    this.ctx.font = "bold 22px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText("FIN DE JUEGO", this.canvas.width / 2, this.canvas.height / 2 - 20);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "14px sans-serif";
    this.ctx.fillText(`Puntos: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
    this.ctx.fillText(`Líneas: ${this.lines}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
  }

  updateUI() {
    const sc = document.getElementById("tetris-score");
    const ln = document.getElementById("tetris-lines");
    const lv = document.getElementById("tetris-level");
    const hsc = document.getElementById("tetris-highscore");

    if (sc) sc.textContent = this.score;
    if (ln) ln.textContent = this.lines;
    if (lv) lv.textContent = this.level;
    if (hsc) hsc.textContent = this.highScore;
  }

  initControls() {
    window.addEventListener("keydown", (e) => {
      const modal = document.getElementById("game-view-tetris");
      if (!modal || modal.style.display === "none") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.moveLeft();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.moveRight();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this.drop();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.rotateCurrent();
      } else if (e.key === " ") {
        e.preventDefault();
        this.hardDrop();
      } else if (e.key === "p" || e.key === "P") {
        this.togglePause();
      }
    });
  }
}
