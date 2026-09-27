/**
 * Coordinador Principal de la Aplicación: WEB.EO (Radios en Vivo & Arcade)
 */

// Stubs de seguridad por si el navegador tiene en caché llamadas a juegos eliminados
window.Game2048 = window.Game2048 || class { constructor() {} start() {} restart() {} undo() {} };
window.TriviaGame = window.TriviaGame || class { constructor() {} start() {} };
window.MemoryGame = window.MemoryGame || class { constructor() {} restart() {} };

document.addEventListener("DOMContentLoaded", () => {
  // 1. NAVEGACIÓN ENTRE SECCIONES (TABS PRINCIPALES)
  // Se inicializa primero para que la interfaz siempre responda inmediatamente
  const navTabs = document.querySelectorAll(".nav-tab-btn");
  const tabSections = document.querySelectorAll(".tab-content-section");

  function switchTab(targetId) {
    navTabs.forEach((t) => {
      if (t.dataset.target === targetId) t.classList.add("active");
      else t.classList.remove("active");
    });
    tabSections.forEach((s) => {
      if (s.id === targetId) s.style.display = "block";
      else s.style.display = "none";
    });
    if (targetId === "section-favorites") {
      renderFavorites();
    }
  }

  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.target;
      switchTab(target);
    });
  });

  // 2. INICIALIZAR REPRODUCTOR DE RADIO
  try {
    window.radioPlayer = new RadioPlayer(typeof RADIOS_DATA !== "undefined" ? RADIOS_DATA : []);
  } catch (err) {
    console.error("Error al inicializar RadioPlayer:", err);
  }

  // 3. ESTADO Y FILTROS DE RADIO
  let currentGenreFilter = "all";
  let searchQuery = "";

  const stationsGrid = document.getElementById("stations-grid");
  const searchInput = document.getElementById("radio-search-input");
  const filterPills = document.querySelectorAll(".filter-pill");

  function renderStations() {
    if (!stationsGrid) return;
    stationsGrid.innerHTML = "";

    const data = (typeof RADIOS_DATA !== "undefined") ? RADIOS_DATA : [];
    const filtered = data.filter((st) => {
      const matchesGenre =
        currentGenreFilter === "all" || st.genre === currentGenreFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (st.name && st.name.toLowerCase().includes(q)) ||
        (st.dial && st.dial.toLowerCase().includes(q)) ||
        (st.genreLabel && st.genreLabel.toLowerCase().includes(q)) ||
        (st.slogan && st.slogan.toLowerCase().includes(q));
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
        window.radioPlayer &&
        window.radioPlayer.currentStation &&
        window.radioPlayer.currentStation.id === station.id;
      const isFav = window.radioPlayer && typeof window.radioPlayer.isFavorite === "function"
        ? window.radioPlayer.isFavorite(station.id)
        : false;
      const isPlaying = window.radioPlayer && window.radioPlayer.isPlaying;

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
              isCurrent && isPlaying
                ? `<span>⏸ Pausar</span>`
                : `<span>▶ Sintonizar</span>`
            }
          </button>
          ${
            isCurrent && isPlaying
              ? `<div class="card-wave"><span class="bar"></span><span class="bar"></span><span class="bar"></span></div>`
              : ""
          }
        </div>
      `;

      card.querySelector(".play-station-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.radioPlayer) {
          if (isCurrent && isPlaying) {
            window.radioPlayer.pause();
          } else {
            window.radioPlayer.setStation(station, true);
          }
        }
      });

      card.addEventListener("click", () => {
        if (window.radioPlayer) {
          window.radioPlayer.setStation(station, true);
        }
      });

      card.querySelector(".station-fav-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.radioPlayer) {
          window.radioPlayer.toggleFavorite(station.id);
        }
      });

      stationsGrid.appendChild(card);
    });
  }

  // Render inicial de emisoras
  try {
    renderStations();
  } catch (err) {
    console.error("Error al renderizar estaciones:", err);
  }

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
      currentGenreFilter = pill.dataset.genre || "all";
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

    const favIds = (window.radioPlayer && window.radioPlayer.favorites) || [];
    const data = (typeof RADIOS_DATA !== "undefined") ? RADIOS_DATA : [];
    const favStations = data.filter((s) => favIds.includes(s.id));

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
        if (window.radioPlayer) window.radioPlayer.setStation(station, true);
      });

      item.querySelector(".station-fav-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.radioPlayer) window.radioPlayer.toggleFavorite(station.id);
      });

      favGrid.appendChild(item);
    });
  }

  // 4. INICIALIZAR MINIJUEGOS (PROTEGIDOS DE FORMA INDEPENDIENTE)
  try {
    if (typeof SnakeGame !== "undefined") {
      window.snakeGame = new SnakeGame("snake-canvas");
    }
  } catch (e) {
    console.warn("Snake init error:", e);
  }

  try {
    if (typeof TetrisGame !== "undefined") {
      window.tetrisGame = new TetrisGame("tetris-canvas", "tetris-next-canvas");
    }
  } catch (e) {
    console.warn("Tetris init error:", e);
  }

  try {
    if (typeof IdoloGame !== "undefined") {
      window.idoloGame = new IdoloGame("idolo-game-container");
    }
  } catch (e) {
    console.warn("Idolo init error:", e);
  }

  // 5. SELECTOR DE JUEGOS ARCADE (MODALES)
  const gameCards = document.querySelectorAll(".game-launcher-card");
  const gameViews = document.querySelectorAll(".game-active-modal");
  const closeGameBtns = document.querySelectorAll(".close-game-btn");

  gameCards.forEach((card) => {
    card.addEventListener("click", () => {
      const gameId = card.dataset.game;
      gameViews.forEach((v) => (v.style.display = "none"));

      const targetModal = document.getElementById(`game-view-${gameId}`);
      if (targetModal) {
        targetModal.style.display = "flex";
        if (gameId === "idolo" && window.idoloGame) window.idoloGame.render();
        if (gameId === "snake" && window.snakeGame) window.snakeGame.start();
        if (gameId === "tetris" && window.tetrisGame) window.tetrisGame.start();
      }
    });
  });

  closeGameBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".game-active-modal");
      if (modal) {
        modal.style.display = "none";
        if (window.snakeGame && window.snakeGame.isRunning) window.snakeGame.stop();
        if (window.tetrisGame && window.tetrisGame.isRunning) window.tetrisGame.stop();
      }
    });
  });

  // 6. CONTROLES VIRTUALES TÁCTILES
  const snakePad = document.querySelectorAll("[data-snake-dir]");
  snakePad.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.snakeGame) window.snakeGame.changeDirection(btn.dataset.snakeDir);
    });
  });

  const btnSnakeRestart = document.getElementById("snake-restart-btn");
  if (btnSnakeRestart) {
    btnSnakeRestart.addEventListener("click", () => {
      if (window.snakeGame) window.snakeGame.start();
    });
  }

  const tetrisLeft = document.getElementById("tetris-btn-left");
  const tetrisRight = document.getElementById("tetris-btn-right");
  const tetrisDown = document.getElementById("tetris-btn-down");
  const tetrisRotate = document.getElementById("tetris-btn-rotate");
  const tetrisDrop = document.getElementById("tetris-btn-drop");
  const tetrisRestart = document.getElementById("tetris-restart-btn");

  if (tetrisLeft) tetrisLeft.addEventListener("click", () => window.tetrisGame && window.tetrisGame.moveLeft());
  if (tetrisRight) tetrisRight.addEventListener("click", () => window.tetrisGame && window.tetrisGame.moveRight());
  if (tetrisDown) tetrisDown.addEventListener("click", () => window.tetrisGame && window.tetrisGame.drop());
  if (tetrisRotate) tetrisRotate.addEventListener("click", () => window.tetrisGame && window.tetrisGame.rotateCurrent());
  if (tetrisDrop) tetrisDrop.addEventListener("click", () => window.tetrisGame && window.tetrisGame.hardDrop());
  if (tetrisRestart) tetrisRestart.addEventListener("click", () => window.tetrisGame && window.tetrisGame.start());
});
