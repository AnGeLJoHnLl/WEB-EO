/**
 * Motor de Audio y Reproductor Persistente
 * Soporta MediaSession API, persistencia en localStorage, sleep timer y visualizador.
 */

class RadioPlayer {
  constructor(stations) {
    this.stations = stations;
    this.currentStation = null;
    this.audio = new Audio();
    this.audio.preload = "none";
    this.isPlaying = false;
    this.isLoading = false;
    this.volume = parseFloat(localStorage.getItem("radio_volume") || "0.8");
    this.audio.volume = this.volume;
    this.favorites = JSON.parse(localStorage.getItem("radio_favorites") || "[]");
    this.sleepTimer = null;
    this.sleepTimeLeft = 0;
    this.sleepInterval = null;

    // DOM Elements
    this.bottomBar = document.getElementById("bottom-player");
    this.btnPlay = document.getElementById("player-play-btn");
    this.btnPrev = document.getElementById("player-prev-btn");
    this.btnNext = document.getElementById("player-next-btn");
    this.stationNameEl = document.getElementById("player-station-name");
    this.stationDialEl = document.getElementById("player-station-dial");
    this.stationBadgeEl = document.getElementById("player-station-badge");
    this.volumeSlider = document.getElementById("player-volume-slider");
    this.btnMute = document.getElementById("player-mute-btn");
    this.btnFavorite = document.getElementById("player-fav-btn");
    this.equalizer = document.getElementById("player-equalizer");
    this.statusPill = document.getElementById("player-status-pill");
    this.timerBtn = document.getElementById("player-timer-btn");

    this.initAudioEvents();
    this.initUIEvents();
    this.updateVolumeUI();

    // Cargar última radio escuchada si existe
    const lastStationId = localStorage.getItem("last_station_id");
    if (lastStationId) {
      const found = this.stations.find((s) => s.id === lastStationId);
      if (found) this.setStation(found, false);
    } else if (this.stations.length > 0) {
      this.setStation(this.stations[0], false);
    }
  }

  initAudioEvents() {
    this.audio.addEventListener("waiting", () => {
      this.isLoading = true;
      this.updateStatus("Sintonizando...", "buffering");
    });

    this.audio.addEventListener("playing", () => {
      this.isLoading = false;
      this.isPlaying = true;
      this.updateStatus("EN VIVO", "live");
      this.updatePlayStateUI();
      this.updateMediaSession();
      this.startEqualizer();
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.updateStatus("PAUSADO", "paused");
      this.updatePlayStateUI();
      this.stopEqualizer();
    });

    this.audio.addEventListener("error", (e) => {
      console.warn("Audio error encountered:", e);
      this.isLoading = false;
      this.isPlaying = false;
      this.updateStatus("Error de señal (reintentando...)", "error");
      this.updatePlayStateUI();
      this.stopEqualizer();
      // Intento de reconexión automática en 4s
      setTimeout(() => {
        if (!this.isPlaying && this.currentStation) {
          this.audio.load();
        }
      }, 4000);
    });
  }

  initUIEvents() {
    if (this.btnPlay) {
      this.btnPlay.addEventListener("click", () => this.togglePlay());
    }

    if (this.btnPrev) {
      this.btnPrev.addEventListener("click", () => this.playPrevious());
    }

    if (this.btnNext) {
      this.btnNext.addEventListener("click", () => this.playNext());
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        this.setVolume(val);
      });
    }

    if (this.btnMute) {
      this.btnMute.addEventListener("click", () => {
        if (this.audio.volume > 0) {
          this.previousVol = this.audio.volume;
          this.setVolume(0);
        } else {
          this.setVolume(this.previousVol || 0.8);
        }
      });
    }

    if (this.btnFavorite) {
      this.btnFavorite.addEventListener("click", () => {
        if (this.currentStation) {
          this.toggleFavorite(this.currentStation.id);
        }
      });
    }

    if (this.timerBtn) {
      this.timerBtn.addEventListener("click", () => this.cycleSleepTimer());
    }
  }

  setStation(station, autoPlay = true) {
    if (!station) return;
    this.currentStation = station;
    localStorage.setItem("last_station_id", station.id);

    if (this.stationNameEl) this.stationNameEl.textContent = station.name;
    if (this.stationDialEl) this.stationDialEl.textContent = `${station.dial} • ${station.genreLabel}`;
    if (this.stationBadgeEl) {
      this.stationBadgeEl.textContent = station.emoji;
      this.stationBadgeEl.style.background = station.gradient;
    }

    this.updateFavButton();

    this.audio.src = station.streamUrl;
    this.audio.load();

    if (autoPlay) {
      this.play();
    } else {
      this.updateStatus("LISTO", "paused");
    }

    // Notificar al evento global para actualizar tarjetas activas
    window.dispatchEvent(
      new CustomEvent("stationchanged", { detail: { stationId: station.id } })
    );
  }

  play() {
    if (!this.currentStation) return;
    this.isLoading = true;
    this.updateStatus("Conectando...", "buffering");

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.updatePlayStateUI();
        })
        .catch((err) => {
          console.log("Autoplay prevent / Stream issue:", err);
          this.isPlaying = false;
          this.updatePlayStateUI();
          this.updateStatus("Haz clic para escuchar", "paused");
        });
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayStateUI();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  playNext() {
    if (!this.currentStation) return;
    const idx = this.stations.findIndex((s) => s.id === this.currentStation.id);
    const nextIdx = (idx + 1) % this.stations.length;
    this.setStation(this.stations[nextIdx], true);
  }

  playPrevious() {
    if (!this.currentStation) return;
    const idx = this.stations.findIndex((s) => s.id === this.currentStation.id);
    const prevIdx = (idx - 1 + this.stations.length) % this.stations.length;
    this.setStation(this.stations[prevIdx], true);
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audio.volume = this.volume;
    localStorage.setItem("radio_volume", this.volume.toString());
    this.updateVolumeUI();
  }

  updateVolumeUI() {
    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume;
      this.volumeSlider.style.background = `linear-gradient(to right, var(--neon-cyan) 0%, var(--neon-cyan) ${this.volume * 100}%, rgba(255,255,255,0.15) ${this.volume * 100}%, rgba(255,255,255,0.15) 100%)`;
    }
    if (this.btnMute) {
      if (this.volume === 0) {
        this.btnMute.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
      } else if (this.volume < 0.5) {
        this.btnMute.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
      } else {
        this.btnMute.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
      }
    }
  }

  updatePlayStateUI() {
    if (!this.btnPlay) return;
    if (this.isPlaying) {
      this.btnPlay.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
      this.btnPlay.setAttribute("title", "Pausar");
      this.btnPlay.classList.add("playing");
    } else {
      this.btnPlay.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>`;
      this.btnPlay.setAttribute("title", "Reproducir");
      this.btnPlay.classList.remove("playing");
    }
  }

  updateStatus(text, type) {
    if (!this.statusPill) return;
    this.statusPill.textContent = text;
    this.statusPill.className = "status-pill " + type;
  }

  toggleFavorite(stationId) {
    const idx = this.favorites.indexOf(stationId);
    if (idx > -1) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(stationId);
    }
    localStorage.setItem("radio_favorites", JSON.stringify(this.favorites));
    this.updateFavButton();
    window.dispatchEvent(
      new CustomEvent("favoriteschanged", { detail: { favorites: this.favorites } })
    );
  }

  isFavorite(stationId) {
    return this.favorites.includes(stationId);
  }

  updateFavButton() {
    if (!this.btnFavorite || !this.currentStation) return;
    const isFav = this.isFavorite(this.currentStation.id);
    if (isFav) {
      this.btnFavorite.classList.add("active");
      this.btnFavorite.innerHTML = `★`;
      this.btnFavorite.setAttribute("title", "Quitar de favoritos");
    } else {
      this.btnFavorite.classList.remove("active");
      this.btnFavorite.innerHTML = `☆`;
      this.btnFavorite.setAttribute("title", "Agregar a favoritos");
    }
  }

  startEqualizer() {
    if (this.equalizer) {
      this.equalizer.classList.add("active");
    }
  }

  stopEqualizer() {
    if (this.equalizer) {
      this.equalizer.classList.remove("active");
    }
  }

  updateMediaSession() {
    if ("mediaSession" in navigator && this.currentStation) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.currentStation.name,
        artist: this.currentStation.dial + " • " + this.currentStation.genreLabel,
        album: "Perú Lounge & Radios",
        artwork: [
          {
            src: "https://raw.githubusercontent.com/feathericons/feather/master/icons/radio.svg",
            sizes: "96x96",
            type: "image/svg+xml"
          }
        ]
      });

      navigator.mediaSession.setActionHandler("play", () => this.play());
      navigator.mediaSession.setActionHandler("pause", () => this.pause());
      navigator.mediaSession.setActionHandler("previoustrack", () => this.playPrevious());
      navigator.mediaSession.setActionHandler("nexttrack", () => this.playNext());
    }
  }

  cycleSleepTimer() {
    const times = [0, 15, 30, 60]; // minutos
    const currentMins = Math.round(this.sleepTimeLeft / 60);
    let nextIdx = 0;
    if (currentMins === 0) nextIdx = 1;
    else if (currentMins <= 15) nextIdx = 2;
    else if (currentMins <= 30) nextIdx = 3;
    else nextIdx = 0;

    const nextMins = times[nextIdx];
    this.setSleepTimer(nextMins);
  }

  setSleepTimer(minutes) {
    if (this.sleepInterval) {
      clearInterval(this.sleepInterval);
      this.sleepInterval = null;
    }

    if (minutes === 0) {
      this.sleepTimeLeft = 0;
      if (this.timerBtn) {
        this.timerBtn.innerHTML = `⏱️ Apagado`;
        this.timerBtn.classList.remove("active");
      }
      return;
    }

    this.sleepTimeLeft = minutes * 60;
    if (this.timerBtn) {
      this.timerBtn.classList.add("active");
      this.timerBtn.innerHTML = `⏱️ ${minutes}m`;
    }

    this.sleepInterval = setInterval(() => {
      this.sleepTimeLeft--;
      if (this.sleepTimeLeft <= 0) {
        clearInterval(this.sleepInterval);
        this.pause();
        this.setSleepTimer(0);
      } else {
        const m = Math.ceil(this.sleepTimeLeft / 60);
        if (this.timerBtn) this.timerBtn.innerHTML = `⏱️ ${m}m`;
      }
    }, 1000);
  }
}
