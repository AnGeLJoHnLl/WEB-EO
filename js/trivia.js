/**
 * Minijuego: Trivia Peruana de Oro
 * Preguntas sobre cultura, gastronomía, música, historia y jergas.
 */

const TRIVIA_QUESTIONS = [
  {
    question: "¿Cuál es el plato bandera del Perú reconocido mundialmente a base de pescado marinado en limón?",
    options: ["Ceviche", "Lomo Saltado", "Causa Limeña", "Ají de Gallina"],
    correct: 0,
    hint: "El 28 de junio se celebra su Día Nacional."
  },
  {
    question: "¿En qué región o departamento del Perú se encuentra la majestuosa ciudadela de Machu Picchu?",
    options: ["Arequipa", "Cusco", "Puno", "Ayacucho"],
    correct: 1,
    hint: "La antigua capital del Imperio Incaico."
  },
  {
    question: "¿Qué instrumento musical afroperuano de percusión fue declarado Patrimonio Cultural de la Nación?",
    options: ["Quena", "Charango", "Cajón Peruano", "Zampoña"],
    correct: 2,
    hint: "Se toca sentado sobre él."
  },
  {
    question: "En la jerga peruana cotidiana, ¿qué significa la palabra 'pata' o 'causa'?",
    options: ["Un zapato", "Un buen amigo", "Un plato de papa", "Una deuda"],
    correct: 1,
    hint: "¡Habla, causa!"
  },
  {
    question: "¿Cuál es el río más largo y caudaloso del planeta que nace en los Andes del Perú?",
    options: ["Río Rímac", "Río Amazonas", "Río Ucayali", "Río Marañón"],
    correct: 1,
    hint: "Fluye hacia el Atlántico a través de la selva."
  },
  {
    question: "¿Quién es la legendaria cantautora de 'La Flor de la Canela' y 'Fina Estampa'?",
    options: ["Eva Ayllón", "Lucha Reyes", "Chabuca Granda", "Susana Baca"],
    correct: 2,
    hint: "Su nombre real fue María Isabel Granda Larco."
  },
  {
    question: "¿Qué gaseosa dorada con sabor a hierba luisa es considerada 'la bebida del sabor nacional'?",
    options: ["Kola Real", "Inca Kola", "Concordia", "Guaraná"],
    correct: 1,
    hint: "Se suele acompañar con chifa o ceviche."
  },
  {
    question: "¿Cuál es el lago navegable más alto del mundo compartido entre Perú y Bolivia?",
    options: ["Lago Junín", "Lago Titicaca", "Laguna de Huacachina", "Laguna Parón"],
    correct: 1,
    hint: "Ubicado a más de 3,800 metros sobre el nivel del mar en Puno."
  },
  {
    question: "¿Qué dulce tradicional limeño se consume masivamente en octubre durante el 'Mes Morado'?",
    options: ["Suspiro a la Limeña", "Picarones", "Turrón de Doña Pepa", "Arroz Zambito"],
    correct: 2,
    hint: "Tiene miel de frutas y grageas de colores encima."
  },
  {
    question: "En el argot criollo, si alguien te dice que 'está aguja', ¿qué significa?",
    options: ["Que es costurero", "Que no tiene dinero", "Que tiene prisa", "Que está enfermo"],
    correct: 1,
    hint: "Bolsillos vacíos hasta fin de mes."
  },
  {
    question: "¿En qué año proclamó Don José de San Martín la independencia del Perú en la Plaza Mayor de Lima?",
    options: ["1810", "1821", "1824", "1879"],
    correct: 1,
    hint: "'El Perú es desde este momento libre e independiente...'"
  },
  {
    question: "¿Qué famosa ciudadela de barro preinca, la más grande de América, construyó la cultura Chimú?",
    options: ["Chan Chan", "Pachacámac", "Caral", "Kuélap"],
    correct: 0,
    hint: "Ubicada en el valle de Moche, cerca de Trujillo."
  },
  {
    question: "¿Cómo se llama la famosa montaña de los siete colores en la cordillera del Vilcanota?",
    options: ["Huascarán", "Alpamayo", "Vinicunca", "Misti"],
    correct: 2,
    hint: "Sus tonos se deben a la oxidación de minerales."
  },
  {
    question: "¿Qué cantante emblemático de la cumbia chicha peruana interpretaba 'Soy provinciano'?",
    options: ["Chacalón", "Centella", "Tony Rosado", "Deyvis Orosco"],
    correct: 0,
    hint: "Decían: 'Cuando Chacalón canta, los cerros bajan'."
  },
  {
    question: "¿Qué tubérculo originario de los Andes peruanos cuenta con más de 3,000 variedades nativas?",
    options: ["Yuca", "Camote", "Papa", "Olluco"],
    correct: 2,
    hint: "Domesticada hace miles de años en el altiplano andino."
  }
];

class TriviaGame {
  constructor() {
    this.questions = [...TRIVIA_QUESTIONS];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.timer = 15;
    this.timerInterval = null;
    this.answered = false;

    this.container = document.getElementById("game-view-trivia");
    this.qTextEl = document.getElementById("trivia-question");
    this.optionsContainer = document.getElementById("trivia-options");
    this.timerEl = document.getElementById("trivia-timer");
    this.scoreEl = document.getElementById("trivia-score");
    this.streakEl = document.getElementById("trivia-streak");
    this.progressEl = document.getElementById("trivia-progress");
    this.feedbackEl = document.getElementById("trivia-feedback");
    this.nextBtn = document.getElementById("trivia-next-btn");

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.nextQuestion());
    }
  }

  start() {
    // Mezclar preguntas aleatoriamente
    this.questions = [...TRIVIA_QUESTIONS].sort(() => 0.5 - Math.random());
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.answered = false;
    this.showQuestion();
  }

  showQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.showEndSummary();
      return;
    }

    this.answered = false;
    const q = this.questions[this.currentIndex];

    if (this.qTextEl) this.qTextEl.textContent = q.question;
    if (this.progressEl) {
      this.progressEl.textContent = `Pregunta ${this.currentIndex + 1} de ${this.questions.length}`;
    }
    if (this.scoreEl) this.scoreEl.textContent = this.score;
    if (this.streakEl) this.streakEl.textContent = `🔥 Racha: ${this.streak}`;
    if (this.feedbackEl) {
      this.feedbackEl.textContent = "";
      this.feedbackEl.className = "trivia-feedback";
    }
    if (this.nextBtn) this.nextBtn.style.display = "none";

    // Opciones
    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = "";
      q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "trivia-opt-btn";
        btn.textContent = opt;
        btn.addEventListener("click", () => this.selectOption(idx));
        this.optionsContainer.appendChild(btn);
      });
    }

    // Iniciar temporizador (15s)
    this.resetTimer();
  }

  resetTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timer = 15;
    this.updateTimerUI();

    this.timerInterval = setInterval(() => {
      this.timer--;
      this.updateTimerUI();
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.timeOut();
      }
    }, 1000);
  }

  updateTimerUI() {
    if (this.timerEl) {
      this.timerEl.textContent = `⏱️ ${this.timer}s`;
      if (this.timer <= 5) {
        this.timerEl.classList.add("danger");
      } else {
        this.timerEl.classList.remove("danger");
      }
    }
  }

  selectOption(index) {
    if (this.answered) return;
    this.answered = true;
    clearInterval(this.timerInterval);

    const q = this.questions[this.currentIndex];
    const buttons = this.optionsContainer.querySelectorAll(".trivia-opt-btn");

    if (index === q.correct) {
      buttons[index].classList.add("correct");
      this.streak++;
      const points = 100 + this.streak * 20 + this.timer * 5;
      this.score += points;
      this.feedbackEl.textContent = `¡Excelente! +${points} pts (${q.hint})`;
      this.feedbackEl.className = "trivia-feedback success";
    } else {
      buttons[index].classList.add("wrong");
      buttons[q.correct].classList.add("correct");
      this.streak = 0;
      this.feedbackEl.textContent = `¡Casi! La respuesta correcta era: ${q.options[q.correct]}`;
      this.feedbackEl.className = "trivia-feedback error";
    }

    if (this.scoreEl) this.scoreEl.textContent = this.score;
    if (this.streakEl) this.streakEl.textContent = `🔥 Racha: ${this.streak}`;
    if (this.nextBtn) this.nextBtn.style.display = "inline-block";
  }

  timeOut() {
    if (this.answered) return;
    this.answered = true;
    const q = this.questions[this.currentIndex];
    const buttons = this.optionsContainer.querySelectorAll(".trivia-opt-btn");
    buttons[q.correct].classList.add("correct");
    this.streak = 0;
    this.feedbackEl.textContent = `¡Tiempo agotado! Respuesta: ${q.options[q.correct]}`;
    this.feedbackEl.className = "trivia-feedback error";
    if (this.streakEl) this.streakEl.textContent = `🔥 Racha: 0`;
    if (this.nextBtn) this.nextBtn.style.display = "inline-block";
  }

  nextQuestion() {
    this.currentIndex++;
    this.showQuestion();
  }

  showEndSummary() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.qTextEl) this.qTextEl.textContent = "¡Juego Completado!";
    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = `
        <div class="trivia-summary-box">
          <h3>🏆 Puntuación Final: <span style="color:var(--neon-cyan)">${this.score} pts</span></h3>
          <p>¡Eres un verdadero conocedor de la cultura y la fiesta peruana!</p>
          <button class="arcade-btn" onclick="window.triviaGame.start()">Jugar Otra Ronda</button>
        </div>
      `;
    }
    if (this.feedbackEl) this.feedbackEl.textContent = "";
    if (this.nextBtn) this.nextBtn.style.display = "none";
  }
}
