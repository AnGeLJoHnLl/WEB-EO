/**
 * Minijuego: 2048 Huarique Neon
 * Cuadrícula 4x4 con soporte táctil (swipes), deshacer y mejor puntuación.
 */

class Game2048 {
  constructor(gridContainerId) {
    this.container = document.getElementById(gridContainerId);
    if (!this.container) return;

    this.grid = [];
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem("2048_high_score") || "0", 10);
    this.previousState = null;
    this.isGameOver = false;

    this.initControls();
    this.restart();
  }

  restart() {
    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    this.score = 0;
    this.previousState = null;
    this.isGameOver = false;
    this.addRandomTile();
    this.addRandomTile();
    this.updateUI();
  }

  saveState() {
    this.previousState = {
      grid: this.grid.map((row) => [...row]),
      score: this.score
    };
  }

  undo() {
    if (!this.previousState) return;
    this.grid = this.previousState.grid;
    this.score = this.previousState.score;
    this.previousState = null;
    this.isGameOver = false;
    this.updateUI();
  }

  addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }
    if (emptyCells.length === 0) return;
    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.grid[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
  }

  slide(row) {
    let arr = row.filter((val) => val);
    let scoreGained = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        scoreGained += arr[i];
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < 4) {
      arr.push(0);
    }
    return { arr, scoreGained };
  }

  moveLeft() {
    this.saveState();
    let moved = false;
    let gained = 0;
    for (let r = 0; r < 4; r++) {
      const res = this.slide(this.grid[r]);
      if (res.arr.some((val, i) => val !== this.grid[r][i])) {
        moved = true;
      }
      this.grid[r] = res.arr;
      gained += res.scoreGained;
    }
    if (moved) this.afterMove(gained);
  }

  moveRight() {
    this.saveState();
    let moved = false;
    let gained = 0;
    for (let r = 0; r < 4; r++) {
      const reversed = [...this.grid[r]].reverse();
      const res = this.slide(reversed);
      const normal = res.arr.reverse();
      if (normal.some((val, i) => val !== this.grid[r][i])) {
        moved = true;
      }
      this.grid[r] = normal;
      gained += res.scoreGained;
    }
    if (moved) this.afterMove(gained);
  }

  moveUp() {
    this.saveState();
    let moved = false;
    let gained = 0;
    for (let c = 0; c < 4; c++) {
      const col = [this.grid[0][c], this.grid[1][c], this.grid[2][c], this.grid[3][c]];
      const res = this.slide(col);
      if (res.arr.some((val, i) => val !== this.grid[i][c])) {
        moved = true;
      }
      for (let r = 0; r < 4; r++) {
        this.grid[r][c] = res.arr[r];
      }
      gained += res.scoreGained;
    }
    if (moved) this.afterMove(gained);
  }

  moveDown() {
    this.saveState();
    let moved = false;
    let gained = 0;
    for (let c = 0; c < 4; c++) {
      const col = [this.grid[3][c], this.grid[2][c], this.grid[1][c], this.grid[0][c]];
      const res = this.slide(col);
      const normal = res.arr.reverse();
      if (normal.some((val, i) => val !== this.grid[i][c])) {
        moved = true;
      }
      for (let r = 0; r < 4; r++) {
        this.grid[r][c] = normal[r];
      }
      gained += res.scoreGained;
    }
    if (moved) this.afterMove(gained);
  }

  afterMove(scoreGained) {
    this.score += scoreGained;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("2048_high_score", this.highScore.toString());
    }
    this.addRandomTile();
    this.checkGameOver();
    this.updateUI();
  }

  checkGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === 0) return;
        if (c < 3 && this.grid[r][c] === this.grid[r][c + 1]) return;
        if (r < 3 && this.grid[r][c] === this.grid[r + 1][c]) return;
      }
    }
    this.isGameOver = true;
  }

  updateUI() {
    if (!this.container) return;
    this.container.innerHTML = "";

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.grid[r][c];
        const cell = document.createElement("div");
        cell.className = "tile-2048";
        if (val > 0) {
          cell.textContent = val;
          cell.classList.add(`tile-${val}`);
        }
        this.container.appendChild(cell);
      }
    }

    const sc = document.getElementById("2048-score");
    const hsc = document.getElementById("2048-highscore");
    if (sc) sc.textContent = this.score;
    if (hsc) hsc.textContent = this.highScore;

    const banner = document.getElementById("2048-gameover");
    if (banner) {
      banner.style.display = this.isGameOver ? "flex" : "none";
    }
  }

  initControls() {
    window.addEventListener("keydown", (e) => {
      const modal = document.getElementById("game-view-2048");
      if (!modal || modal.style.display === "none") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.moveLeft();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.moveRight();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.moveUp();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this.moveDown();
      }
    });

    // Touch Swipe Detection
    let touchStartX = 0;
    let touchStartY = 0;
    if (this.container) {
      this.container.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
        },
        { passive: true }
      );

      this.container.addEventListener(
        "touchend",
        (e) => {
          const touchEndX = e.changedTouches[0].screenX;
          const touchEndY = e.changedTouches[0].screenY;
          const dx = touchEndX - touchStartX;
          const dy = touchEndY - touchStartY;

          if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30) this.moveRight();
            else if (dx < -30) this.moveLeft();
          } else {
            if (dy > 30) this.moveDown();
            else if (dy < -30) this.moveUp();
          }
        },
        { passive: true }
      );
    }
  }
}
