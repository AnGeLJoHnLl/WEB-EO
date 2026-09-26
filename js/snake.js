/**
 * Minijuego: Snake Neon Arcade (Culebrita)
 * Controles de teclado y táctiles en pantalla para móviles.
 */

class SnakeGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.gridSize = 20;
    this.tileCount = 20; // 400x400

    this.snake = [];
    this.dx = 1;
    this.dy = 0;
    this.food = { x: 15, y: 15, type: "normal" };
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem("snake_high_score") || "0", 10);
    this.isRunning = false;
    this.isPaused = false;
    this.gameLoop = null;
    this.speed = 110; // ms per tick

    this.initControls();
    this.reset();
  }

  reset() {
    this.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    this.dx = 1;
    this.dy = 0;
    this.score = 0;
    this.spawnFood();
    this.updateScoreUI();
    this.draw();
  }

  start() {
    if (this.isRunning) return;
    this.reset();
    this.isRunning = true;
    this.isPaused = false;
    if (this.gameLoop) clearInterval(this.gameLoop);
    this.gameLoop = setInterval(() => this.tick(), this.speed);
  }

  stop() {
    this.isRunning = false;
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    this.drawGameOver();
  }

  togglePause() {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;
  }

  spawnFood() {
    const isSpecial = Math.random() < 0.25;
    this.food = {
      x: Math.floor(Math.random() * this.tileCount),
      y: Math.floor(Math.random() * this.tileCount),
      type: isSpecial ? "bonus" : "normal"
    };

    // Asegurar que no aparezca sobre la serpiente
    for (let segment of this.snake) {
      if (segment.x === this.food.x && segment.y === this.food.y) {
        this.spawnFood();
        break;
      }
    }
  }

  tick() {
    if (this.isPaused) return;

    // Calcular nueva cabeza
    const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

    // Colisión con paredes (torus / envolvente)
    if (head.x < 0) head.x = this.tileCount - 1;
    if (head.x >= this.tileCount) head.x = 0;
    if (head.y < 0) head.y = this.tileCount - 1;
    if (head.y >= this.tileCount) head.y = 0;

    // Colisión consigo misma
    for (let segment of this.snake) {
      if (segment.x === head.x && segment.y === head.y) {
        this.stop();
        return;
      }
    }

    this.snake.unshift(head);

    // Comer comida
    if (head.x === this.food.x && head.y === this.food.y) {
      const points = this.food.type === "bonus" ? 30 : 10;
      this.score += points;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem("snake_high_score", this.highScore.toString());
      }
      this.updateScoreUI();
      this.spawnFood();

      // Ligero aumento de velocidad
      if (this.speed > 60 && this.score % 50 === 0) {
        this.speed -= 5;
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.tick(), this.speed);
      }
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  draw() {
    // Fondo de la cuadrícula
    this.ctx.fillStyle = "#0c0d18";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Líneas sutiles de cuadrícula
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    this.ctx.lineWidth = 1;
    for (let i = 0; i < this.canvas.width; i += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
      this.ctx.stroke();
    }

    // Dibujar Comida
    const fx = this.food.x * this.gridSize;
    const fy = this.food.y * this.gridSize;
    this.ctx.save();
    if (this.food.type === "bonus") {
      this.ctx.fillStyle = "#ffd166";
      this.ctx.shadowColor = "#ffd166";
      this.ctx.shadowBlur = 15;
    } else {
      this.ctx.fillStyle = "#ff007f";
      this.ctx.shadowColor = "#ff007f";
      this.ctx.shadowBlur = 10;
    }
    this.ctx.beginPath();
    this.ctx.arc(
      fx + this.gridSize / 2,
      fy + this.gridSize / 2,
      this.gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    this.ctx.restore();

    // Dibujar Serpiente
    this.snake.forEach((seg, index) => {
      const sx = seg.x * this.gridSize;
      const sy = seg.y * this.gridSize;

      this.ctx.save();
      if (index === 0) {
        // Cabeza
        this.ctx.fillStyle = "#00f2fe";
        this.ctx.shadowColor = "#00f2fe";
        this.ctx.shadowBlur = 14;
        this.ctx.fillRect(sx + 1, sy + 1, this.gridSize - 2, this.gridSize - 2);

        // Ojos
        this.ctx.fillStyle = "#090a10";
        this.ctx.fillRect(sx + 4, sy + 4, 3, 3);
        this.ctx.fillRect(sx + 13, sy + 4, 3, 3);
      } else {
        // Cuerpo con degradado de color
        const ratio = index / this.snake.length;
        this.ctx.fillStyle = index % 2 === 0 ? "#05d554" : "#00f2fe";
        this.ctx.shadowColor = "#05d554";
        this.ctx.shadowBlur = 5;
        this.ctx.fillRect(sx + 2, sy + 2, this.gridSize - 4, this.gridSize - 4);
      }
      this.ctx.restore();
    });

    if (this.isPaused) {
      this.drawPauseOverlay();
    }
  }

  drawPauseOverlay() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#00f2fe";
    this.ctx.font = "bold 24px 'Orbitron', monospace, sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText("JUEGO PAUSADO", this.canvas.width / 2, this.canvas.height / 2);
  }

  drawGameOver() {
    this.ctx.fillStyle = "rgba(10, 10, 20, 0.85)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#ff007f";
    this.ctx.font = "bold 26px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText("¡JUEGO TERMINADO!", this.canvas.width / 2, this.canvas.height / 2 - 20);

    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "16px sans-serif";
    this.ctx.fillText(
      `Puntaje final: ${this.score}`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 15
    );
    this.ctx.fillText(
      "Presiona Iniciar o Espacio para reintentar",
      this.canvas.width / 2,
      this.canvas.height / 2 + 45
    );
  }

  updateScoreUI() {
    const sc = document.getElementById("snake-score");
    const hsc = document.getElementById("snake-highscore");
    if (sc) sc.textContent = this.score;
    if (hsc) hsc.textContent = this.highScore;
  }

  changeDirection(dir) {
    if (!this.isRunning) return;
    if (dir === "up" && this.dy === 0) {
      this.dx = 0;
      this.dy = -1;
    } else if (dir === "down" && this.dy === 0) {
      this.dx = 0;
      this.dy = 1;
    } else if (dir === "left" && this.dx === 0) {
      this.dx = -1;
      this.dy = 0;
    } else if (dir === "right" && this.dx === 0) {
      this.dx = 1;
      this.dy = 0;
    }
  }

  initControls() {
    window.addEventListener("keydown", (e) => {
      // Solo actuar si el contenedor del juego está visible
      const modal = document.getElementById("game-view-snake");
      if (!modal || modal.style.display === "none") return;

      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        this.changeDirection("up");
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        this.changeDirection("down");
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        this.changeDirection("left");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        this.changeDirection("right");
      } else if (e.key === " ") {
        e.preventDefault();
        if (!this.isRunning) this.start();
        else this.togglePause();
      }
    });
  }
}
