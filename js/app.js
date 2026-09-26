/**
 * Coordinador Principal de la Aplicación: Perú Lounge & Arcade
 */

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar Reproductor de Radio
  window.radioPlayer = new RadioPlayer(RADIOS_DATA);

  // Inicializar Minijuegos
  window.snakeGame = new SnakeGame("snake-canvas");
  window.tetrisGame = new TetrisGame("tetris-canvas", "tetris-next-canvas");
  window.game2048 = new Game2048("grid-2048");
  window.triviaGame = new TriviaGame();
  window.memoryGame = new MemoryGame("memory-grid");

  // Estado de Filtros de Radio
  let currentGenreFilter = "all";
  let searchQuery = "";

  // Renderizar Estaciones
  const stationsGrid = document.getElementById("stations-grid");
  const searchInput = document.getElementById("radio-search-input");
  const filterPills = document.querySelectorAll(".filter-pill");

  function renderStations() {
    if (!stationsGrid) return;
    stationsGrid.innerHTML = "";

    const filtered = RADIOS_DATA.filter((st) => {
      const matchesGenre =
        currentGenreFilter === "all" || st.genre === currentGenreFilter;
      const matchesSearch =
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.dial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.genreLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.slogan.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });

    if (filtered.length === 0) {
      stationsGrid.innerHTML = `
        <div class="empty-state">
          <p>🔍 No se encontraron emisoras con "${searchQuery}".</p>
        </div>
      `;
      return;
    }

    filtered.forEach((station) => {
      const isCurrent =
        window.radioPlayer.currentStation &&
        window.radioPlayer.currentStation.id === station.id;
      const isFav = window.radioPlayer.isFavorite(station.id);

      const card = document.createElement("div");
      card.className = `station-card ${isCurrent ? "active" : ""}`;
      card.dataset.id = station.id;

      card.innerHTML = `
        <div class="station-card-top">
          <div class="station-avatar" style="background: ${station.gradient}">
            <span>${station.emoji}</span>
          </div>
          <button class="station-fav-btn ${isFav ? "active" : ""}" title="Favorito">
            ${isFav ? "★" : "☆"}
          </button>
        </div>
        <div class="station-info">
          <div class="station-name-row">
            <h3 class="station-title">${station.name}</h3>
            <span class="station-badge">${station.dial}</span>
          </div>
          <p class="station-genre">${station.genreLabel}</p>
          <p class="station-slogan">"${station.slogan}"</p>
        </div>
        <div class="station-action">
          <button class="play-station-btn">
            ${
              isCurrent && window.radioPlayer.isPlaying
                ? `<span>⏸ Pausar</span>`
                : `<span>▶ Sintonizar</span>`
            }
          </button>
          ${
            isCurrent && window.radioPlayer.isPlaying
              ? `<div class="card-wave"><span class="bar"></span><span class="bar"></span><span class="bar"></span></div>`
              : ""
          }
        </div>
      `;

      // Evento de reproducción
      card.querySelector(".play-station-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        if (isCurrent && window.radioPlayer.isPlaying) {
          window.radioPlayer.pause();
        } else {
          window.radioPlayer.setStation(station, true);
        }
      });

      card.addEventListener("click", () => {
        window.radioPlayer.setStation(station, true);
      });

      // Evento de favorito
      card.querySelector(".station-fav-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        window.radioPlayer.toggleFavorite(station.id);
      });

      stationsGrid.appendChild(card);
    });
  }

  // Render inicial
  renderStations();

  // Búsqueda en vivo
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderStations();
    });
  }

  // Filtros de género
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentGenreFilter = pill.dataset.genre;
      renderStations();
    });
  });

  // Re-render al cambiar estación o favoritos
  window.addEventListener("stationchanged", () => renderStations());
  window.addEventListener("favoriteschanged", () => {
    renderStations();
    renderFavorites();
  });

  // Render pestaña favoritos
  function renderFavorites() {
    const favGrid = document.getElementById("favorites-grid");
    if (!favGrid) return;
    favGrid.innerHTML = "";

    const favIds = window.radioPlayer.favorites;
    const favStations = RADIOS_DATA.filter((s) => favIds.includes(s.id));

    if (favStations.length === 0) {
      favGrid.innerHTML = `
        <div class="empty-state">
          <p>⭐ Aún no tienes emisoras favoritas guardadas.</p>
          <p class="sub">Haz clic en la estrella de cualquier radio para guardarla aquí.</p>
        </div>
      `;
      return;
    }

    favStations.forEach((station) => {
      const item = document.createElement("div");
      item.className = "station-card";
      item.innerHTML = `
        <div class="station-card-top">
          <div class="station-avatar" style="background: ${station.gradient}">
            <span>${station.emoji}</span>
          </div>
          <button class="station-fav-btn active" title="Quitar de favoritos">★</button>
        </div>
        <div class="station-info">
          <div class="station-name-row">
            <h3 class="station-title">${station.name}</h3>
            <span class="station-badge">${station.dial}</span>
          </div>
          <p class="station-genre">${station.genreLabel}</p>
        </div>
        <div class="station-action">
          <button class="play-station-btn">▶ Sintonizar</button>
        </div>
      `;

      item.querySelector(".play-station-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        window.radioPlayer.setStation(station, true);
      });

      item.querySelector(".station-fav-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        window.radioPlayer.toggleFavorite(station.id);
      });

      favGrid.appendChild(item);
    });
  }

  // Navegación entre secciones (Tabs principales)
  const navTabs = document.querySelectorAll(".nav-tab-btn");
  const tabSections = document.querySelectorAll(".tab-content-section");

  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.target;
      navTabs.forEach((t) => t.classList.remove("active"));
      tabSections.forEach((s) => (s.style.display = "none"));

      tab.classList.add("active");
      const activeSection = document.getElementById(target);
      if (activeSection) {
        activeSection.style.display = "block";
      }

      if (target === "section-favorites") {
        renderFavorites();
      }
    });
  });

  // Selector de Juegos Arcade (Abrir y Cerrar vista de juego)
  const gameCards = document.querySelectorAll(".game-launcher-card");
  const gameViews = document.querySelectorAll(".game-active-modal");
  const closeGameBtns = document.querySelectorAll(".close-game-btn");

  gameCards.forEach((card) => {
    card.addEventListener("click", () => {
      const gameId = card.dataset.game;
      // Ocultar modal previo
      gameViews.forEach((v) => (v.style.display = "none"));

      const targetModal = document.getElementById(`game-view-${gameId}`);
      if (targetModal) {
        targetModal.style.display = "flex";
        // Inicializar/Comenzar juego específico
        if (gameId === "snake") window.snakeGame.start();
        if (gameId === "tetris") window.tetrisGame.start();
        if (gameId === "2048") window.game2048.restart();
        if (gameId === "trivia") window.triviaGame.start();
        if (gameId === "memory") window.memoryGame.restart();
      }
    });
  });

  closeGameBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".game-active-modal");
      if (modal) {
        modal.style.display = "none";
        // Detener loops de juegos para ahorrar CPU
        if (window.snakeGame.isRunning) window.snakeGame.stop();
        if (window.tetrisGame.isRunning) window.tetrisGame.stop();
      }
    });
  });

  // Botones de control en pantalla para Snake (Móviles)
  const snakePad = document.querySelectorAll("[data-snake-dir]");
  snakePad.forEach((btn) => {
    btn.addEventListener("click", () => {
      window.snakeGame.changeDirection(btn.dataset.snakeDir);
    });
  });

  const btnSnakeRestart = document.getElementById("snake-restart-btn");
  if (btnSnakeRestart) {
    btnSnakeRestart.addEventListener("click", () => window.snakeGame.start());
  }

  // Botones de control para Tetris (Móviles)
  const tetrisLeft = document.getElementById("tetris-btn-left");
  const tetrisRight = document.getElementById("tetris-btn-right");
  const tetrisDown = document.getElementById("tetris-btn-down");
  const tetrisRotate = document.getElementById("tetris-btn-rotate");
  const tetrisDrop = document.getElementById("tetris-btn-drop");
  const tetrisRestart = document.getElementById("tetris-restart-btn");

  if (tetrisLeft) tetrisLeft.addEventListener("click", () => window.tetrisGame.moveLeft());
  if (tetrisRight) tetrisRight.addEventListener("click", () => window.tetrisGame.moveRight());
  if (tetrisDown) tetrisDown.addEventListener("click", () => window.tetrisGame.drop());
  if (tetrisRotate) tetrisRotate.addEventListener("click", () => window.tetrisGame.rotateCurrent());
  if (tetrisDrop) tetrisDrop.addEventListener("click", () => window.tetrisGame.hardDrop());
  if (tetrisRestart) tetrisRestart.addEventListener("click", () => window.tetrisGame.start());

  // Controles 2048
  const btn2048Restart = document.getElementById("2048-restart-btn");
  const btn2048Undo = document.getElementById("2048-undo-btn");
  if (btn2048Restart) btn2048Restart.addEventListener("click", () => window.game2048.restart());
  if (btn2048Undo) btn2048Undo.addEventListener("click", () => window.game2048.undo());

  // Controles Memoria
  const btnMemoryRestart = document.getElementById("memory-restart-btn");
  const btnMemoryWinRestart = document.getElementById("memory-win-restart-btn");
  if (btnMemoryRestart) btnMemoryRestart.addEventListener("click", () => window.memoryGame.restart());
  if (btnMemoryWinRestart) {
    btnMemoryWinRestart.addEventListener("click", () => {
      document.getElementById("memory-win-msg").style.display = "none";
      window.memoryGame.restart();
    });
  }
});
