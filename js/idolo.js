/**
 * EL ÍDOLO: MODO CARRERA DE FUTBOLISTA
 * Juego nativo 100% offline sin dependencias externas.
 * Toma de decisiones, eventos aleatorios, transferencias, títulos, selecciones y retiro.
 */

// Base de datos de Clubes por Categoría y País
const IDOLO_CLUBS = {
  peru_ascenso: [
    { name: "Santos FC (Nazca)", league: "Liga 2 Perú", tier: 1, country: "🇵🇪" },
    { name: "Deportivo Coopsol", league: "Liga 2 Perú", tier: 1, country: "🇵🇪" },
    { name: "Comerciantes FC (Iquitos)", league: "Liga 2 Perú", tier: 1, country: "🇵🇪" },
    { name: "Juan Aurich", league: "Liga 2 Perú", tier: 1, country: "🇵🇪" }
  ],
  peru_primera: [
    { name: "Alianza Lima", league: "Liga 1 Perú", tier: 2, country: "🇵🇪" },
    { name: "Universitario de Deportes", league: "Liga 1 Perú", tier: 2, country: "🇵🇪" },
    { name: "Sporting Cristal", league: "Liga 1 Perú", tier: 2, country: "🇵🇪" },
    { name: "FBC Melgar (Arequipa)", league: "Liga 1 Perú", tier: 2, country: "🇵🇪" },
    { name: "Cienciano (Cusco)", league: "Liga 1 Perú", tier: 2, country: "🇵🇪" },
    { name: "Sport Boys (Callao)", league: "Liga 1 Perú", tier: 2, country: "🇵🇪" },
    { name: "Cusco FC", league: "Liga 1 Perú", tier: 2, country: "🇵🇪" }
  ],
  sudamerica: [
    { name: "Boca Juniors", league: "Liga Profesional Arg", tier: 3, country: "🇦🇷" },
    { name: "River Plate", league: "Liga Profesional Arg", tier: 3, country: "🇦🇷" },
    { name: "Flamengo", league: "Brasileirão", tier: 3, country: "🇧🇷" },
    { name: "Palmeiras", league: "Brasileirão", tier: 3, country: "🇧🇷" },
    { name: "São Paulo", league: "Brasileirão", tier: 3, country: "🇧🇷" },
    { name: "Racing Club", league: "Liga Profesional Arg", tier: 3, country: "🇦🇷" }
  ],
  europa_media: [
    { name: "Feyenoord", league: "Eredivisie", tier: 4, country: "🇳🇱" },
    { name: "Benfica", league: "Primeira Liga", tier: 4, country: "🇵🇹" },
    { name: "Porto", league: "Primeira Liga", tier: 4, country: "🇵🇹" },
    { name: "Celta de Vigo", league: "LaLiga", tier: 4, country: "🇪🇸" },
    { name: "Fiorentina", league: "Serie A", tier: 4, country: "🇮🇹" },
    { name: "Real Betis", league: "LaLiga", tier: 4, country: "🇪🇸" },
    { name: "Brighton", league: "Premier League", tier: 4, country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }
  ],
  europa_elite: [
    { name: "Real Madrid", league: "LaLiga", tier: 5, country: "🇪🇸" },
    { name: "FC Barcelona", league: "LaLiga", tier: 5, country: "🇪🇸" },
    { name: "Manchester City", league: "Premier League", tier: 5, country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { name: "Liverpool FC", league: "Premier League", tier: 5, country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { name: "Bayern Múnich", league: "Bundesliga", tier: 5, country: "🇩🇪" },
    { name: "Paris Saint-Germain", league: "Ligue 1", tier: 5, country: "🇫🇷" },
    { name: "Inter de Milán", league: "Serie A", tier: 5, country: "🇮🇹" },
    { name: "Arsenal FC", league: "Premier League", tier: 5, country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }
  ],
  exoticas: [
    { name: "Al-Hilal", league: "Saudi Pro League", tier: 4, country: "🇸🇦" },
    { name: "Al-Nassr", league: "Saudi Pro League", tier: 4, country: "🇸🇦" },
    { name: "Inter Miami", league: "MLS", tier: 3, country: "🇺🇸" },
    { name: "LA Galaxy", league: "MLS", tier: 3, country: "🇺🇸" }
  ]
};

// Eventos narrativos interactivos y ramificados
const IDOLO_EVENTS = [
  {
    id: "penal_clasico",
    title: "Minuto 90: El Penal del Clásico",
    desc: "El árbitro pita penal a tu favor en el último minuto del clásico. El estadio es una caldera rugiendo.",
    options: [
      {
        text: "Fusilar fuerte al medio con furia",
        effect: (p) => {
          if (Math.random() < 0.8) {
            p.goals += 1;
            p.fame += 8;
            p.ovr += 1;
            return "¡GOLAZO! El arquero se tiró a un costado y rompiste la red. La hinchada corea tu nombre hasta el amanecer.";
          } else {
            p.fame -= 6;
            return "¡La mandaste a la tribuna! La prensa te critica ferozmente y los memes inundan las redes.";
          }
        }
      },
      {
        text: "Picársela con descaro (A lo Panenka)",
        effect: (p) => {
          if (p.ovr >= 65 && Math.random() < 0.65) {
            p.goals += 1;
            p.fame += 18;
            p.money += 15000;
            return "¡UNA LOCURA DE GOL! Se la picaste con una frialdad legendaria. Los diarios titulan: 'Ha nacido un genio'.";
          } else {
            p.fame -= 15;
            p.discipline -= 10;
            return "El arquero no se movió y la agarró con el pecho. El DT te manda al banco por canchero.";
          }
        }
      },
      {
        text: "Dejárselo al capitán del equipo",
        effect: (p) => {
          p.discipline += 10;
          p.energy += 5;
          return "Demostraste humildad y juego en equipo. El capitán anotó y en el vestuario te agradecieron el gesto.";
        }
      }
    ]
  },
  {
    id: "fiesta_previa",
    title: "Noche de Juerga antes del Partido",
    desc: "Un grupo de referentes y amigos te invitan a una fiesta privada en una quinta la noche previa a un partido clave.",
    options: [
      {
        text: "Quedarte concentrado en el hotel descansando",
        effect: (p) => {
          p.energy += 15;
          p.discipline += 12;
          p.ovr += 1;
          return "Priorizaste tu carrera. Al día siguiente volaste en la cancha y el cuerpo técnico felicitó tu profesionalismo.";
        }
      },
      {
        text: "Ir 'un ratito nomás' hasta medianoche",
        effect: (p) => {
          p.fame += 5;
          p.energy -= 15;
          if (Math.random() < 0.45) {
            p.discipline -= 15;
            p.fame -= 8;
            return "¡Ampay! Las cámaras de un programa de espectáculos te grabaron saliendo a las 4 AM. Multa económica y suplencia.";
          } else {
            return "La pasaste bomba y nadie se enteró, aunque en el entrenamiento sentiste las piernas de plomo.";
          }
        }
      }
    ]
  },
  {
    id: "lesion_decision",
    title: "Dolor en los Meniscos",
    desc: "Sientes un pinchazo agudo en la rodilla. El médico te advierte que si juegas la final te puedes romper los ligamentos.",
    options: [
      {
        text: "Infiltrarte con inyecciones y jugar la final a muerte",
        effect: (p) => {
          if (Math.random() < 0.5) {
            p.titles += 1;
            p.fame += 20;
            p.energy -= 25;
            return "¡ÉPICO! Jugaste rengueando, diste una asistencia milagrosa y salieron CAMPEONES. La hinchada te declara ídolo inmortal.";
          } else {
            p.ovr -= 3;
            p.energy -= 40;
            return "Tragedia. A los 20 minutos se te trabó la rodilla. Cirugía de urgencia y 8 meses fuera de las canchas.";
          }
        }
      },
      {
        text: "Cuidar tu cuerpo y operarte de inmediato",
        effect: (p) => {
          p.energy += 10;
          p.discipline += 8;
          return "Decisión madura. Te perdiste la final, pero tu rodilla sanó al 100% y aseguraste 10 años más de carrera.";
        }
      }
    ]
  },
  {
    id: "llamado_seleccion",
    title: "¡Convocado a la Selección Nacional!",
    desc: "Llega la carta oficial: el DT nacional te convoca para las Eliminatorias rumbo al Mundial.",
    options: [
      {
        text: "Dejar la vida en cada pelota por tu país",
        effect: (p) => {
          p.caps += 4;
          p.fame += 15;
          p.ovr += 2;
          p.money += 25000;
          return "¡Debut soñado con la Blanquirroja! Rompiste defensas rivales y te ganaste la camiseta titular en la Selección.";
        }
      },
      {
        text: "Pedir no viajar para concentrarte en tu club",
        effect: (p) => {
          p.fame -= 10;
          p.discipline -= 5;
          p.energy += 10;
          return "La prensa nacional y el país entero te tildan de 'pecho frío' por no querer ponerte la camiseta de la patria.";
        }
      }
    ]
  },
  {
    id: "oferta_arabia",
    title: "Propuesta Millonaria de Medio Oriente",
    desc: "Un jeque árabe llega con un maletín repleto de petrodólares: te ofrecen un contrato de US$ 5,000,000 al año.",
    options: [
      {
        text: "Firmar de inmediato (Asegurar a toda la familia)",
        effect: (p) => {
          p.money += 5000000;
          p.club = { name: "Al-Hilal", league: "Saudi Pro League", tier: 4, country: "🇸🇦" };
          p.fame += 5;
          p.discipline -= 5;
          return "¡Billetera llena! Vives en un palacio en Riyadh y tus bisnietos tienen la vida resuelta, aunque sales del radar europeo.";
        }
      },
      {
        text: "Rechazar por gloria deportiva (Seguir soñando con Europa)",
        effect: (p) => {
          p.ovr += 2;
          p.discipline += 10;
          return "Rechazaste el dinero fácil. La prensa elogia tu hambre de gloria y los ojeadores de la Champions League te tienen en la mira.";
        }
      }
    ]
  },
  {
    id: "reclamo_sueldo",
    title: "El Club atrasa 3 meses de sueldo",
    desc: "La dirigencia del club no paga los salarios al plantel desde hace 90 días por crisis económica.",
    options: [
      {
        text: "Liderar una huelga del plantel y exigir los pagos",
        effect: (p) => {
          p.discipline -= 5;
          p.fame += 10;
          p.money += 30000;
          return "Tuviste agallas. La directiva cedió ante la presión y tus compañeros te eligen nuevo líder indiscutido.";
        }
      },
      {
        text: "Rescindir contrato e irte libre a otro equipo",
        effect: (p) => {
          p.ovr += 1;
          return "Hiciste valer tus derechos laborales. Quedaste como agente libre listo para firmar un contrato mejor.";
        }
      },
      {
        text: "Jugar gratis por amor a la camiseta",
        effect: (p) => {
          p.fame += 20;
          p.money -= 10000;
          return "Un gesto épico de lealtad. La tribuna te hace una bandera gigante: 'En las buenas y en las malas'.";
        }
      }
    ]
  },
  {
    id: "marca_zapatillas",
    title: "Patrocinio de Marca Deportiva Mundial",
    desc: "Nike y Adidas se disputan tus pies para convertirte en su rostro principal en Sudamérica.",
    options: [
      {
        text: "Firmar con botines personalizados y publicidad en TV",
        effect: (p) => {
          p.money += 200000;
          p.fame += 15;
          return "Tus propios botines personalizados ya están en todas las tiendas. Eres un ícono publicitario.";
        }
      }
    ]
  }
];

class IdoloGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = null;
    this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem("idolo_career_state");
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        this.state = null;
      }
    }
  }

  saveState() {
    if (this.state) {
      localStorage.setItem("idolo_career_state", JSON.stringify(this.state));
    } else {
      localStorage.removeItem("idolo_career_state");
    }
  }

  initNewCareer(name, nationality, position, startingClubName) {
    let startingClub = null;
    const allClubs = [
      ...IDOLO_CLUBS.peru_ascenso,
      ...IDOLO_CLUBS.peru_primera,
      ...IDOLO_CLUBS.sudamerica
    ];
    startingClub = allClubs.find((c) => c.name === startingClubName) || IDOLO_CLUBS.peru_primera[0];

    // Stats iniciales
    let baseOvr = 56;
    if (position === "DC") baseOvr = 58;

    this.state = {
      name: name.trim() || "Pablito 'El Rayo'",
      nationality: nationality || "🇵🇪 Perú",
      position: position || "DC",
      age: 16,
      ovr: baseOvr,
      energy: 95,
      fame: 10,
      discipline: 75,
      money: 5000,
      club: startingClub,
      careerHistory: [`16 años: Fichaje por la cantera de ${startingClub.name}`],
      goals: 0,
      assists: 0,
      matches: 0,
      titles: 0,
      caps: 0,
      worldCups: 0,
      ballonDors: 0,
      isRetired: false,
      currentEvent: null,
      seasonLog: []
    };

    this.saveState();
    this.render();
  }

  resetGame() {
    if (confirm("¿Estás seguro de reiniciar tu carrera? Empezarás desde los 16 años.")) {
      this.state = null;
      localStorage.removeItem("idolo_career_state");
      this.render();
    }
  }

  render() {
    if (!this.container) return;

    if (!this.state) {
      this.renderSetupScreen();
    } else if (this.state.isRetired) {
      this.renderRetirementScreen();
    } else {
      this.renderDashboard();
    }
  }

  renderSetupScreen() {
    this.container.innerHTML = `
      <div class="idolo-card-box setup-box">
        <div class="idolo-hero-header">
          <span style="font-size: 48px;">⚽</span>
          <h2>El Ídolo: Modo Carrera</h2>
          <p>Comienza a los 16 años en el fútbol sudamericano, toma decisiones clave, gana títulos y decide si te conviertes en estatua o leyenda mundial.</p>
        </div>

        <form id="idolo-setup-form" class="idolo-form">
          <div class="idolo-field">
            <label>Nombre de tu Futbolista / Apodo:</label>
            <input type="text" id="idolo-input-name" placeholder="Ej: Piero 'El Mágico' Quispe" value="Piero Quispe" required>
          </div>

          <div class="idolo-row-2">
            <div class="idolo-field">
              <label>Nacionalidad:</label>
              <select id="idolo-input-country">
                <option value="🇵🇪 Perú" selected>🇵🇪 Perú</option>
                <option value="🇦🇷 Argentina">🇦🇷 Argentina</option>
                <option value="🇧🇷 Brasil">🇧🇷 Brasil</option>
                <option value="🇨🇴 Colombia">🇨🇴 Colombia</option>
                <option value="🇺🇾 Uruguay">🇺🇾 Uruguay</option>
                <option value="🇲🇽 México">🇲🇽 México</option>
                <option value="🇪🇸 España">🇪🇸 España</option>
              </select>
            </div>

            <div class="idolo-field">
              <label>Posición en la cancha:</label>
              <select id="idolo-input-pos">
                <option value="DC" selected>⚽ Delantero Centro (Goleador)</option>
                <option value="MCO">🎯 Mediapunta / '10' Creativo</option>
                <option value="EXT">⚡ Extremo Veloz por las bandas</option>
                <option value="MC">🧠 Mediocampista de Contención</option>
                <option value="DFC">🛡️ Defensor Central de Hierro</option>
              </select>
            </div>
          </div>

          <div class="idolo-field">
            <label>Club donde debutas a los 16 años:</label>
            <select id="idolo-input-club">
              <optgroup label="🇵🇪 Liga 1 & Canteras de Perú">
                <option value="Alianza Lima">Alianza Lima</option>
                <option value="Universitario de Deportes" selected>Universitario de Deportes</option>
                <option value="Sporting Cristal">Sporting Cristal</option>
                <option value="FBC Melgar (Arequipa)">FBC Melgar (Arequipa)</option>
                <option value="Cienciano (Cusco)">Cienciano (Cusco)</option>
                <option value="Sport Boys (Callao)">Sport Boys (Callao)</option>
              </optgroup>
              <optgroup label="🇵🇪 Ascenso Peruano">
                <option value="Santos FC (Nazca)">Santos FC (Nazca)</option>
                <option value="Juan Aurich">Juan Aurich (Chiclayo)</option>
                <option value="Comerciantes FC (Iquitos)">Comerciantes FC (Iquitos)</option>
              </optgroup>
              <optgroup label="🇦🇷 Grandes de Argentina">
                <option value="Boca Juniors">Boca Juniors</option>
                <option value="River Plate">River Plate</option>
                <option value="Racing Club">Racing Club</option>
              </optgroup>
              <optgroup label="🇧🇷 Potencias de Brasil">
                <option value="Flamengo">Flamengo</option>
                <option value="Palmeiras">Palmeiras</option>
                <option value="Santos">Santos FC</option>
              </optgroup>
            </select>
          </div>

          <button type="submit" class="arcade-btn idolo-start-btn">
            ¡Comenzar Mi Carrera Futbolística! 🚀
          </button>
        </form>
      </div>
    `;

    document.getElementById("idolo-setup-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("idolo-input-name").value;
      const country = document.getElementById("idolo-input-country").value;
      const pos = document.getElementById("idolo-input-pos").value;
      const club = document.getElementById("idolo-input-club").value;
      this.initNewCareer(name, country, pos, club);
    });
  }

  renderDashboard() {
    const p = this.state;

    // Colores según Media OVR
    let ovrColor = "#22e748";
    if (p.ovr >= 85) ovrColor = "#ffd166";
    else if (p.ovr >= 75) ovrColor = "#00f2fe";

    this.container.innerHTML = `
      <div class="idolo-dashboard-grid">
        
        <!-- Tarjeta de Jugador Principal -->
        <div class="idolo-card-box player-card-hud">
          <div class="player-hud-top">
            <div class="player-ovr-badge" style="border-color:${ovrColor}; color:${ovrColor}">
              <span class="ovr-num">${p.ovr}</span>
              <span class="ovr-lbl">MEDIA</span>
            </div>
            <div class="player-identity">
              <h3>${p.name}</h3>
              <p>${p.nationality} • <span class="tag-pos">${p.position}</span> • <strong>${p.age} años</strong></p>
              <p class="tag-club">🛡️ ${p.club.name} <em>(${p.club.league})</em></p>
            </div>
            <button id="idolo-btn-reset" class="btn-micro" title="Reiniciar carrera">🔄</button>
          </div>

          <!-- Barras de Atributos -->
          <div class="player-meters-grid">
            <div class="meter-item">
              <div class="meter-head"><span>⚡ Energía/Físico</span> <strong>${p.energy}%</strong></div>
              <div class="meter-bar"><div class="meter-fill energy" style="width:${p.energy}%"></div></div>
            </div>
            <div class="meter-item">
              <div class="meter-head"><span>🌟 Fama / Hinchas</span> <strong>${p.fame}%</strong></div>
              <div class="meter-bar"><div class="meter-fill fame" style="width:${p.fame}%"></div></div>
            </div>
            <div class="meter-item">
              <div class="meter-head"><span>🧠 Profesionalismo</span> <strong>${p.discipline}%</strong></div>
              <div class="meter-bar"><div class="meter-fill disc" style="width:${p.discipline}%"></div></div>
            </div>
          </div>

          <!-- Palmarés y Cifras -->
          <div class="player-stats-counter">
            <div class="stat-box"><span>Goles</span><strong>${p.goals}</strong></div>
            <div class="stat-box"><span>Asistencias</span><strong>${p.assists}</strong></div>
            <div class="stat-box"><span>Partidos</span><strong>${p.matches}</strong></div>
            <div class="stat-box"><span>Títulos</span><strong>🏆 ${p.titles}</strong></div>
            <div class="stat-box"><span>Selección</span><strong>🇵🇪 ${p.caps}</strong></div>
            <div class="stat-box"><span>Fortuna</span><strong style="color:#22e748;">$${p.money.toLocaleString()}</strong></div>
          </div>

          ${p.ballonDors > 0 ? `<div class="achievement-pill">⭐ ${p.ballonDors} Balón de Oro ganado</div>` : ""}
          ${p.worldCups > 0 ? `<div class="achievement-pill gold">🏆 Campeón del Mundo con la Selección</div>` : ""}
        </div>

        <!-- Panel de Decisiones y Temporada -->
        <div class="idolo-card-box action-hub">
          ${this.state.currentEvent ? this.renderCurrentEventHTML() : this.renderSeasonActionsHTML()}
        </div>

      </div>

      <!-- Historial de Carrera Reciente -->
      <div class="idolo-card-box history-box">
        <h4>📜 Trayectoria & Titulares de Prensa</h4>
        <div class="history-list">
          ${p.careerHistory.slice(-4).reverse().map((h) => `<div class="history-item">• ${h}</div>`).join("")}
        </div>
      </div>
    `;

    // Event Listeners
    const btnReset = document.getElementById("idolo-btn-reset");
    if (btnReset) btnReset.addEventListener("click", () => this.resetGame());

    // Botón simular temporada
    const btnSimulate = document.getElementById("idolo-btn-advance");
    if (btnSimulate) btnSimulate.addEventListener("click", () => this.advanceSeason());

    // Botones de entrenamiento
    const btnTrainHard = document.getElementById("idolo-train-hard");
    if (btnTrainHard) btnTrainHard.addEventListener("click", () => this.trainPlayer("hard"));

    const btnTrainRest = document.getElementById("idolo-train-rest");
    if (btnTrainRest) btnTrainRest.addEventListener("click", () => this.trainPlayer("rest"));

    // Opciones de Evento
    const optButtons = document.querySelectorAll("[data-event-opt]");
    optButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const optIdx = parseInt(btn.dataset.eventOpt, 10);
        this.resolveEventOption(optIdx);
      });
    });
  }

  renderSeasonActionsHTML() {
    return `
      <div class="season-ready-box">
        <h3>Temporada Año ${this.state.age}</h3>
        <p>Estás listo para disputar la temporada con <strong>${this.state.club.name}</strong>.</p>
        
        <div class="decision-cards-row">
          <button id="idolo-train-hard" class="choice-card">
            <span class="icon">💪</span>
            <strong>Entrenamiento Fuerte</strong>
            <small>+2 Media OVR, -12% Energía</small>
          </button>
          <button id="idolo-train-rest" class="choice-card">
            <span class="icon">🛌</span>
            <strong>Descanso & Fisioterapia</strong>
            <small>+25% Energía, previene lesiones</small>
          </button>
        </div>

        <button id="idolo-btn-advance" class="arcade-btn play-season-btn">
          ▶ ¡Jugar y Simular Temporada! ⚽
        </button>
      </div>
    `;
  }

  renderCurrentEventHTML() {
    const ev = this.state.currentEvent;
    return `
      <div class="event-active-box">
        <span class="badge-alert">🚨 DECISIÓN CRUCIAL</span>
        <h3 class="event-title">${ev.title}</h3>
        <p class="event-desc">${ev.desc}</p>

        <div class="event-options-list">
          ${ev.options
            .map(
              (opt, idx) => `
            <button class="event-opt-button" data-event-opt="${idx}">
              <span>${opt.text}</span>
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  trainPlayer(type) {
    if (type === "hard") {
      if (this.state.energy < 20) {
        alert("¡Estás exhausto! Si entrenas al límite te vas a lesionar. Descansa un poco.");
        return;
      }
      this.state.ovr += 1;
      this.state.energy = Math.max(5, this.state.energy - 12);
      this.state.discipline += 3;
    } else {
      this.state.energy = Math.min(100, this.state.energy + 25);
    }
    this.saveState();
    this.render();
  }

  resolveEventOption(index) {
    const ev = this.state.currentEvent;
    if (!ev || !ev.options[index]) return;

    const opt = ev.options[index];
    const outcome = opt.effect(this.state);

    // Guardar en trayectoria
    this.state.careerHistory.push(`${this.state.age} años: ${outcome}`);
    this.state.currentEvent = null;

    // Normalizar estadísticas
    this.state.energy = Math.max(0, Math.min(100, this.state.energy));
    this.state.fame = Math.max(0, Math.min(100, this.state.fame));
    this.state.discipline = Math.max(0, Math.min(100, this.state.discipline));

    this.saveState();
    this.render();
  }

  advanceSeason() {
    const p = this.state;

    // Generar evento aleatorio en el 70% de las temporadas si no hay evento pendiente
    if (!p.currentEvent && Math.random() < 0.65) {
      const randomEvent = IDOLO_EVENTS[Math.floor(Math.random() * IDOLO_EVENTS.length)];
      p.currentEvent = randomEvent;
      this.render();
      return;
    }

    // Simular estadísticas de la temporada
    const matchesPlayed = Math.floor(25 + (p.energy / 100) * 15);
    p.matches += matchesPlayed;

    // Cálculo de goles según posición y OVR
    let seasonGoals = 0;
    let seasonAssists = 0;

    if (p.position === "DC") {
      seasonGoals = Math.floor((p.ovr / 10) * (1.2 + Math.random() * 1.5));
      seasonAssists = Math.floor(Math.random() * 8);
    } else if (p.position === "MCO" || p.position === "EXT") {
      seasonGoals = Math.floor((p.ovr / 15) * (1 + Math.random() * 1.2));
      seasonAssists = Math.floor((p.ovr / 10) * (1.1 + Math.random() * 1.3));
    } else {
      seasonGoals = Math.floor(Math.random() * 5);
      seasonAssists = Math.floor(Math.random() * 8);
    }

    p.goals += seasonGoals;
    p.assists += seasonAssists;

    // Ingresos salariales de temporada
    const salary = Math.round(p.ovr * 1500 * (p.club.tier || 1) * (1 + p.fame / 100));
    p.money += salary;

    // Campeón de liga o copas (probabilidad según OVR del jugador y Tier del club)
    const winTitle = Math.random() < 0.28 + (p.ovr / 250);
    if (winTitle) {
      p.titles += 1;
      p.fame = Math.min(100, p.fame + 10);
      p.money += 40000;
      p.careerHistory.push(`🏆 ¡CAMPEÓN de ${p.club.league} con ${p.club.name}!`);
    }

    // Copa del Mundo cada 4 años (a los 18, 22, 26, 30, 34 años)
    if ([18, 22, 26, 30, 34].includes(p.age) && p.ovr >= 70) {
      p.caps += 6;
      if (Math.random() < 0.18 + (p.ovr / 300)) {
        p.worldCups += 1;
        p.titles += 1;
        p.fame = 100;
        p.money += 500000;
        p.careerHistory.push(`🌟 ¡CAMPEÓN DEL MUNDO! Alzaste la Copa del Mundo con ${p.nationality}. Héroe de la patria.`);
      }
    }

    // Balón de oro para jugadores de élite (OVR >= 88 en club Tier >= 4)
    if (p.ovr >= 88 && (p.club.tier || 1) >= 4 && Math.random() < 0.4) {
      p.ballonDors += 1;
      p.fame = 100;
      p.careerHistory.push(`⭐ ¡GANASTE EL BALÓN DE ORO! Coronado el mejor futbolista del planeta Tierra.`);
    }

    // Evolución de media según edad
    if (p.age < 27) {
      p.ovr = Math.min(98, p.ovr + Math.floor(1 + Math.random() * 3));
    } else if (p.age >= 32) {
      p.ovr = Math.max(55, p.ovr - Math.floor(1 + Math.random() * 2));
      p.energy = Math.max(10, p.energy - 8);
    }

    // Posibles ofertas de fichaje si el jugador subió de nivel
    this.checkForTransfers();

    // Aumento de año
    p.age++;

    // Verificar retiro a los 36+ o si energía cae a 0
    if (p.age >= 37) {
      p.isRetired = true;
      p.careerHistory.push(`🎖️ Se retira del fútbol profesional a los ${p.age - 1} años de edad.`);
    }

    this.saveState();
    this.render();
  }

  checkForTransfers() {
    const p = this.state;
    // Si tiene alto OVR y está en club chico, le llegan ofertas gigantes
    if (p.ovr >= 82 && p.club.tier < 5) {
      const elite = IDOLO_CLUBS.europa_elite[Math.floor(Math.random() * IDOLO_CLUBS.europa_elite.length)];
      p.club = elite;
      p.money += 300000;
      p.fame = Math.min(100, p.fame + 20);
      p.careerHistory.push(`🚀 ¡Fichaje bomba! Traspasado a ${elite.name} (${elite.country}) por cifra récord.`);
    } else if (p.ovr >= 72 && p.club.tier < 4) {
      const mid = IDOLO_CLUBS.europa_media[Math.floor(Math.random() * IDOLO_CLUBS.europa_media.length)];
      p.club = mid;
      p.careerHistory.push(`✈️ Salto a Europa: Nuevo fichaje de ${mid.name} (${mid.country}).`);
    } else if (p.ovr >= 64 && p.club.tier < 3) {
      const sa = IDOLO_CLUBS.sudamerica[Math.floor(Math.random() * IDOLO_CLUBS.sudamerica.length)];
      p.club = sa;
      p.careerHistory.push(`📈 Transferencia internacional: Fichaste por ${sa.name} (${sa.country}).`);
    }
  }

  renderRetirementScreen() {
    const p = this.state;

    // Determinar legado
    let rankTitle = "Obrero del Fútbol";
    let rankDesc = "Una carrera respetable y trabajadora en el fútbol profesional.";
    let statueBadge = "🥉 Estatua de Bronce";

    if (p.ballonDors > 0 || p.worldCups > 0 || (p.ovr >= 88 && p.titles >= 10)) {
      rankTitle = "🗿 DIOS DEL FÚTBOL & LEYENDA MUNDIAL";
      rankDesc = "Tu nombre está al lado de Pelé, Maradona y Messi. Tienes estatuas de oro macizo y estadios con tu nombre.";
      statueBadge = "🏆 ESTATUA DE ORO HISTÓRICA";
    } else if (p.titles >= 5 && p.goals >= 150) {
      rankTitle = "👑 Ídolo Absoluto del Club";
      rankDesc = "Los hinchas te llevan tatuado en el pecho y las generaciones cantan tus hazañas en la tribuna.";
      statueBadge = "🥈 Estatua de Plata";
    } else if (p.money >= 10000000) {
      rankTitle = "💰 El Magnate del Deporte";
      rankDesc = "Priorizaste las grandes ligas millonarias y hoy disfrutas de yates, mansiones y aviones privados.";
      statueBadge = "💎 Busto de Diamante";
    } else if (p.discipline < 40) {
      rankTitle = "⚡ Crack Bohemio de la Noche";
      rankDesc = "Tenías magia pura en los botines, pero las noches, la farándula y las juergas truncaron tu gloria total.";
      statueBadge = "🍸 Placa en la Taberna de la Esquina";
    }

    this.container.innerHTML = `
      <div class="idolo-card-box retirement-box">
        <div class="statue-glow">🗿</div>
        <h2 style="color:var(--neon-yellow); margin-bottom:4px;">${statueBadge}</h2>
        <h3 style="font-size:1.6rem; color:#fff;">${rankTitle}</h3>
        <p style="color:var(--text-muted); max-width:550px; margin: 0 auto 20px;">${rankDesc}</p>

        <div class="idolo-summary-card">
          <h4>Resumen de Carrera: ${p.name}</h4>
          <div class="summary-stats-grid">
            <div><span>Partidos:</span> <strong>${p.matches}</strong></div>
            <div><span>Goles:</span> <strong>${p.goals}</strong></div>
            <div><span>Asistencias:</span> <strong>${p.assists}</strong></div>
            <div><span>Títulos:</span> <strong>${p.titles}</strong></div>
            <div><span>Selección:</span> <strong>${p.caps} partidos</strong></div>
            <div><span>Fortuna Final:</span> <strong style="color:#22e748;">$${p.money.toLocaleString()}</strong></div>
          </div>
        </div>

        <button id="idolo-restart-career-btn" class="arcade-btn" style="margin-top:24px; padding:14px 28px; font-size:1.05rem;">
          🔄 Empezar una Nueva Carrera con Otro Futbolista
        </button>
      </div>
    `;

    document.getElementById("idolo-restart-career-btn").addEventListener("click", () => {
      this.state = null;
      localStorage.removeItem("idolo_career_state");
      this.render();
    });
  }
}
