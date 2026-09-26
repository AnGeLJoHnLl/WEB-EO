/**
 * Minijuego: Memoria Criolla
 * 16 cartas con símbolos peruanos (8 pares).
 */

const MEMORY_CARDS = [
  { id: "ceviche", name: "Ceviche", emoji: "🐟", color: "#00f2fe" },
  { id: "lomo", name: "Lomo Saltado", emoji: "🥩", color: "#e63946" },
  { id: "machu", name: "Machu Picchu", emoji: "⛰️", color: "#2a9d8f" },
  { id: "torito", name: "Torito de Pucará", emoji: "🐂", color: "#f4a261" },
  { id: "cajon", name: "Cajón Peruano", emoji: "🥁", color: "#e76f51" },
  { id: "llama", name: "Llama Andina", emoji: "🦙", color: "#e9c46a" },
  { id: "chicha", name: "Chicha Morada", emoji: "🌽", color: "#9d4edd" },
  { id: "pisco", name: "Pisco Sour", emoji: "🍸", color: "#80ed99" }
];

class MemoryGame {
  constructor(gridId) {
    this.gridEl = document.getElementById(gridId);
    this.movesEl = document.getElementById("memory-moves");
    this.pairsEl = document.getElementById("memory-pairs");
    this.timerEl = document.getElementById("memory-timer");

    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.isLocked = false;

    this.restart();
  }

  restart() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timer = 0;
    this.moves = 0;
    this.matchedPairs = 0;
    this.flippedCards = [];
    this.isLocked = false;

    if (this.movesEl) this.movesEl.textContent = this.moves;
    if (this.pairsEl) this.pairsEl.textContent = `0 / 8`;
    if (this.timerEl) this.timerEl.textContent = `0s`;

    // Duplicar y barajar
    const deck = [...MEMORY_CARDS, ...MEMORY_CARDS].sort(() => 0.5 - Math.random());
    this.renderDeck(deck);

    this.timerInterval = setInterval(() => {
      this.timer++;
      if (this.timerEl) this.timerEl.textContent = `${this.timer}s`;
    }, 1000);
  }

  renderDeck(deck) {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = "";

    deck.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.dataset.id = item.id;
      card.dataset.index = index;

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <span class="card-mark">🇵🇪</span>
          </div>
          <div class="card-back" style="border-color: ${item.color}">
            <span class="card-emoji">${item.emoji}</span>
            <span class="card-name">${item.name}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => this.flipCard(card, item));
      this.gridEl.appendChild(card);
    });
  }

  flipCard(cardEl, item) {
    if (this.isLocked) return;
    if (cardEl.classList.contains("flipped") || cardEl.classList.contains("matched")) return;

    cardEl.classList.add("flipped");
    this.flippedCards.push({ cardEl, item });

    if (this.flippedCards.length === 2) {
      this.moves++;
      if (this.movesEl) this.movesEl.textContent = this.moves;
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    const [c1, c2] = this.flippedCards;

    if (c1.item.id === c2.item.id) {
      setTimeout(() => {
        c1.cardEl.classList.add("matched");
        c2.cardEl.classList.add("matched");
        this.matchedPairs++;
        if (this.pairsEl) this.pairsEl.textContent = `${this.matchedPairs} / 8`;
        this.flippedCards = [];
        this.isLocked = false;

        if (this.matchedPairs === 8) {
          this.gameWin();
        }
      }, 400);
    } else {
      setTimeout(() => {
        c1.cardEl.classList.remove("flipped");
        c2.cardEl.classList.remove("flipped");
        this.flippedCards = [];
        this.isLocked = false;
      }, 900);
    }
  }

  gameWin() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const winMsg = document.getElementById("memory-win-msg");
    if (winMsg) {
      winMsg.style.display = "flex";
      const stats = document.getElementById("memory-win-stats");
      if (stats) {
        stats.textContent = `¡Completaste todos los pares en ${this.moves} movimientos y ${this.timer} segundos! 🎉`;
      }
    }
  }
}
