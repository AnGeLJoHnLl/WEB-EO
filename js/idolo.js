/**
 * EL ÍDOLO: MODO CARRERA DE FUTBOLISTA (NATIVO & OFFLINE)
 * Incluye:
 * - Camiseta 3D animada con colores, patrones y dorsales del club actual
 * - Vitrina de Trofeos iluminada con pedestales 3D, reflejos y conteo interactivo
 * - Eventos de carrera, transferencias, Balón de Oro, Copa del Mundo y Retiro
 */

// Base de datos de Clubes con configuración de Camisetas
const IDOLO_CLUBS = {
  peru_ascenso: [
    { name: "Santos FC (Nazca)", league: "Liga 2 Perú", tier: 1, country: "🇵🇪", primary: "#1b4332", secondary: "#ffd166", pattern: "solid", numColor: "#ffffff" },
    { name: "Deportivo Coopsol", league: "Liga 2 Perú", tier: 1, country: "🇵🇪", primary: "#ffbe0b", secondary: "#111111", pattern: "solid", numColor: "#111111" },
    { name: "Comerciantes FC (Iquitos)", league: "Liga 2 Perú", tier: 1, country: "🇵🇪", primary: "#0077b6", secondary: "#ffffff", pattern: "stripes_vertical", numColor: "#ffffff" },
    { name: "Juan Aurich", league: "Liga 2 Perú", tier: 1, country: "🇵🇪", primary: "#c1121f", secondary: "#ffffff", pattern: "solid", numColor: "#ffffff" }
  ],
  peru_primera: [
    { name: "Alianza Lima", league: "Liga 1 Perú", tier: 2, country: "🇵🇪", primary: "#001b44", secondary: "#ffffff", pattern: "stripes_vertical", numColor: "#ffffff" },
    { name: "Universitario de Deportes", league: "Liga 1 Perú", tier: 2, country: "🇵🇪", primary: "#fff8dc", secondary: "#7b1113", pattern: "solid", numColor: "#7b1113" },
    { name: "Sporting Cristal", league: "Liga 1 Perú", tier: 2, country: "🇵🇪", primary: "#38bdf8", secondary: "#ffffff", pattern: "solid", numColor: "#ffffff" },
    { name: "FBC Melgar (Arequipa)", league: "Liga 1 Perú", tier: 2, country: "🇵🇪", primary: "#ba181b", secondary: "#111111", pattern: "halves", numColor: "#ffffff" },
    { name: "Cienciano (Cusco)", league: "Liga 1 Perú", tier: 2, country: "🇵🇪", primary: "#d90429", secondary: "#ffffff", pattern: "solid", numColor: "#ffffff" },
    { name: "Sport Boys (Callao)", league: "Liga 1 Perú", tier: 2, country: "🇵🇪", primary: "#ff70a6", secondary: "#111111", pattern: "solid", numColor: "#111111" },
    { name: "Cusco FC", league: "Liga 1 Perú", tier: 2, country: "🇵🇪", primary: "#d4af37", secondary: "#111111", pattern: "stripes_horizontal", numColor: "#ffffff" }
  ],
  sudamerica: [
    { name: "Boca Juniors", league: "Liga Profesional Arg", tier: 3, country: "🇦🇷", primary: "#002f6c", secondary: "#ffc72c", pattern: "chest_band", numColor: "#ffc72c" },
    { name: "River Plate", league: "Liga Profesional Arg", tier: 3, country: "🇦🇷", primary: "#ffffff", secondary: "#e63946", pattern: "diagonal_sash", numColor: "#111111" },
    { name: "Flamengo", league: "Brasileirão", tier: 3, country: "🇧🇷", primary: "#c1121f", secondary: "#111111", pattern: "stripes_horizontal", numColor: "#ffffff" },
    { name: "Palmeiras", league: "Brasileirão", tier: 3, country: "🇧🇷", primary: "#006437", secondary: "#ffffff", pattern: "solid", numColor: "#ffffff" },
    { name: "São Paulo", league: "Brasileirão", tier: 3, country: "🇧🇷", primary: "#ffffff", secondary: "#ba181b", pattern: "chest_band", numColor: "#111111" },
    { name: "Racing Club", league: "Liga Profesional Arg", tier: 3, country: "🇦🇷", primary: "#60a5fa", secondary: "#ffffff", pattern: "stripes_vertical", numColor: "#001f54" }
  ],
  europa_media: [
    { name: "Feyenoord", league: "Eredivisie", tier: 4, country: "🇳🇱", primary: "#c1121f", secondary: "#ffffff", pattern: "halves", numColor: "#111111" },
    { name: "Benfica", league: "Primeira Liga", tier: 4, country: "🇵🇹", primary: "#dc2626", secondary: "#ffffff", pattern: "solid", numColor: "#ffffff" },
    { name: "Porto", league: "Primeira Liga", tier: 4, country: "🇵🇹", primary: "#1e3a8a", secondary: "#ffffff", pattern: "stripes_vertical", numColor: "#ffffff" },
    { name: "Celta de Vigo", league: "LaLiga", tier: 4, country: "🇪🇸", primary: "#93c5fd", secondary: "#ffffff", pattern: "solid", numColor: "#1e3a8a" },
    { name: "Fiorentina", league: "Serie A", tier: 4, country: "🇮🇹", primary: "#6b21a8", secondary: "#ffffff", pattern: "solid", numColor: "#ffffff" },
    { name: "Real Betis", league: "LaLiga", tier: 4, country: "🇪🇸", primary: "#16a34a", secondary: "#ffffff", pattern: "stripes_vertical", numColor: "#ffffff" },
    { name: "Brighton", league: "Premier League", tier: 4, country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", primary: "#0284c7", secondary: "#ffffff", pattern: "stripes_vertical", numColor: "#ffffff" }
  ],
  europa_elite: [
    { name: "Real Madrid", league: "LaLiga", tier: 5, country: "🇪🇸", primary: "#ffffff", secondary: "#d4af37", pattern: "solid", numColor: "#d4af37" },
    { name: "FC Barcelona", league: "LaLiga", tier: 5, country: "🇪🇸", primary: "#004d98", secondary: "#a50044", pattern: "stripes_vertical", numColor: "#ffd700" },
    { name: "Manchester City", league: "Premier League", tier: 5, country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", primary: "#6ba4b8", secondary: "#ffffff", pattern: "solid", numColor: "#ffffff" },
    { name: "Liverpool FC", league: "Premier League", tier: 5, country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", primary: "#b91c1c", secondary: "#ffffff", pattern: "solid", numColor: "#ffffff" },
    { name: "Bayern Múnich", league: "Bundesliga", tier: 5, country: "🇩🇪", primary: "#dc2626", secondary: "#ffffff", pattern: "solid", numColor: "#ffffff" },
    { name: "Paris Saint-Germain", league: "Ligue 1", tier: 5, country: "🇫🇷", primary: "#002654", secondary: "#ed2939", pattern: "center_stripe", numColor: "#ffffff" },
    { name: "Inter de Milán", league: "Serie A", tier: 5, country: "🇮🇹", primary: "#0038a8", secondary: "#111111", pattern: "stripes_vertical", numColor: "#ffd700" },
    { name: "Arsenal FC", league: "Premier League", tier: 5, country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", primary: "#dc2626", secondary: "#ffffff", pattern: "raglan", numColor: "#ffffff" }
  ],
  exoticas: [
    { name: "Al-Hilal", league: "Saudi Pro League", tier: 4, country: "🇸🇦", primary: "#003399", secondary: "#ffffff", pattern: "solid", numColor: "#ffffff" },
    { name: "Al-Nassr", league: "Saudi Pro League", tier: 4, country: "🇸🇦", primary: "#facc15", secondary: "#1e40af", pattern: "solid", numColor: "#1e40af" },
    { name: "Inter Miami", league: "MLS", tier: 3, country: "🇺🇸", primary: "#f472b6", secondary: "#111111", pattern: "solid", numColor: "#111111" },
    { name: "LA Galaxy", league: "MLS", tier: 3, country: "🇺🇸", primary: "#ffffff", secondary: "#00245d", pattern: "diagonal_sash", numColor: "#ffd166" }
  ]
};

// Generador de Dorsal según Posición
function getPlayerNumber(position) {
  switch (position) {
    case "DC": return 9;
    case "MCO": return 10;
    case "EXT": return 7;
    case "MC": return 8;
    case "DFC": return 4;
    default: return 10;
  }
}

// Extracción del Apellido para la Camiseta
function getPlayerSurname(fullName) {
  if (!fullName) return "CRACK";
  const cleaned = fullName.replace(/['"].*?['"]/g, "").trim();
  const parts = cleaned.split(" ");
  return (parts[parts.length - 1] || cleaned || "ÍDOLO").toUpperCase();
}

// Generador SVG de la Camiseta con Animación y Colores Dinámicos
function renderJerseySVG(club, playerName, pos) {
  const pCol = club.primary || "#001b44";
  const sCol = club.secondary || "#ffffff";
  const numCol = club.numColor || "#ffffff";
  const pattern = club.pattern || "solid";
  const number = getPlayerNumber(pos);
  const surname = getPlayerSurname(playerName);
  const randId = "j_" + Math.random().toString(36).substr(2, 6);

  let patternDef = "";
  let bodyFill = pCol;

  if (pattern === "stripes_vertical") {
    patternDef = `
      <pattern id="${randId}_vstripes" width="24" height="20" patternUnits="userSpaceOnUse">
        <rect width="12" height="20" fill="${pCol}"/>
        <rect x="12" width="12" height="20" fill="${sCol}"/>
      </pattern>
    `;
    bodyFill = `url(#${randId}_vstripes)`;
  } else if (pattern === "stripes_horizontal") {
    patternDef = `
      <pattern id="${randId}_hstripes" width="20" height="24" patternUnits="userSpaceOnUse">
        <rect width="20" height="12" fill="${pCol}"/>
        <rect y="12" width="20" height="12" fill="${sCol}"/>
      </pattern>
    `;
    bodyFill = `url(#${randId}_hstripes)`;
  }

  let extraShapes = "";
  if (pattern === "halves") {
    extraShapes = `<path d="M 80 40 L 80 165 L 116 165 L 116 50 L 128 68 L 145 55 L 125 30 L 105 38 Z" fill="${sCol}"/>`;
  } else if (pattern === "chest_band") {
    extraShapes = `<rect x="44" y="80" width="72" height="30" fill="${sCol}"/>`;
  } else if (pattern === "diagonal_sash") {
    extraShapes = `<polygon points="44,52 64,52 116,138 116,162 96,162 44,76" fill="${sCol}"/>`;
  } else if (pattern === "center_stripe") {
    extraShapes = `<rect x="68" y="42" width="24" height="123" fill="${sCol}"/>`;
  } else if (pattern === "raglan") {
    extraShapes = `
      <polygon points="35,30 15,55 32,68 44,50" fill="${sCol}"/>
      <polygon points="125,30 145,55 128,68 116,50" fill="${sCol}"/>
    `;
  }

  return `
    <div class="jersey-3d-wrapper">
      <svg class="jersey-svg" viewBox="0 0 160 180" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${patternDef}
          <linearGradient id="${randId}_shading" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.32"/>
            <stop offset="45%" stop-color="#ffffff" stop-opacity="0.04"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.48"/>
          </linearGradient>
          <filter id="${randId}_shadow" x="-15%" y="-15%" width="135%" height="135%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.6)"/>
          </filter>
        </defs>

        <g filter="url(#${randId}_shadow)">
          <!-- Base de la Camiseta con Mangas -->
          <path d="M 35 30 L 15 55 L 32 68 L 44 50 L 44 165 L 116 165 L 116 50 L 128 68 L 145 55 L 125 30 L 105 38 C 95 48 65 48 55 38 Z" 
                fill="${bodyFill}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>

          <!-- Detalles de Patrón (Franjas, Mitades o Banda) -->
          ${extraShapes}

          <!-- Sombreado de Textura 3D -->
          <path d="M 35 30 L 15 55 L 32 68 L 44 50 L 44 165 L 116 165 L 116 50 L 128 68 L 145 55 L 125 30 L 105 38 C 95 48 65 48 55 38 Z" 
                fill="url(#${randId}_shading)"/>

          <!-- Ribetes en Mangas -->
          <polygon points="15,55 32,68 30,71 13,58" fill="${sCol}"/>
          <polygon points="145,55 128,68 130,71 147,58" fill="${sCol}"/>

          <!-- Cuello -->
          <path d="M 55 38 C 65 48 95 48 105 38 C 97 43 63 43 55 38 Z" fill="${sCol}"/>
          <path d="M 55 38 Q 80 54 105 38 Q 80 46 55 38 Z" fill="#07080f"/>

          <!-- Escudo del Club en el Pecho -->
          <g transform="translate(93, 56)">
            <path d="M 0 0 L 15 0 L 15 11 C 15 17 7.5 21 7.5 21 C 7.5 21 0 17 0 11 Z" fill="${sCol}" stroke="#ffffff" stroke-width="0.8"/>
            <circle cx="7.5" cy="8.5" r="4.5" fill="${pCol}"/>
            <text x="7.5" y="10" font-size="4.5" font-weight="900" fill="${numCol}" text-anchor="middle">★</text>
          </g>

          <!-- Logo Deportivo de Marca -->
          <path d="M 52 64 Q 57 68 63 62 Q 59 65 54 63 Z" fill="${sCol}" opacity="0.9"/>

          <!-- Apellido del Jugador -->
          <text x="80" y="78" font-family="'Orbitron', -apple-system, sans-serif" font-size="9" font-weight="900" 
                letter-spacing="1.2" fill="${numCol}" text-anchor="middle" stroke="#000" stroke-width="0.6">
            ${surname}
          </text>

          <!-- Número Dorsal -->
          <text x="80" y="126" font-family="'Impact', 'Arial Black', sans-serif" font-size="42" font-weight="900" 
                fill="${numCol}" text-anchor="middle" stroke="#000" stroke-width="1.8">
            ${number}
          </text>
        </g>
      </svg>
      <div class="jersey-reflection"></div>
      <div class="jersey-label">${club.name} • #${number}</div>
    </div>
  `;
}

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
            p.leagueTitles = (p.leagueTitles || 0) + 1;
            p.trophies.push({ id: "t_" + Date.now(), name: `Campeón ${p.club.league}`, year: p.age, club: p.club.name, type: "liga", icon: "🏆" });
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
          p.club = { name: "Al-Hilal", league: "Saudi Pro League", tier: 4, country: "🇸🇦", primary: "#003399", secondary: "#ffffff", pattern: "solid", numColor: "#ffffff" };
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
  }
];

class IdoloGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = null;
    this.newTrophyUnlocked = null;
    this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem("idolo_career_state");
    if (saved) {
      try {
        this.state = JSON.parse(saved);
        if (!this.state.trophies) this.state.trophies = [];
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
      leagueTitles: 0,
      continentalTitles: 0,
      worldCups: 0,
      ballonDors: 0,
      goldenBoots: 0,
      trophies: [],
      caps: 0,
      isRetired: false,
      currentEvent: null
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
          <span style="font-size: 52px; animation: bounce 2s infinite;">⚽</span>
          <h2>El Ídolo: Modo Carrera</h2>
          <p>Comienza a los 16 años en el fútbol sudamericano, viste la camiseta de tus sueños, llena tu vitrina de trofeos y conviértete en leyenda.</p>
        </div>

        <form id="idolo-setup-form" class="idolo-form">
          <div class="idolo-field">
            <label>Nombre de tu Futbolista / Apodo:</label>
            <input type="text" id="idolo-input-name" placeholder="Ej: Piero Quispe" value="Piero Quispe" required>
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
                <option value="DC" selected>⚽ Delantero Centro (#9 Goleador)</option>
                <option value="MCO">🎯 Mediapunta (#10 Creativo)</option>
                <option value="EXT">⚡ Extremo Veloz (#7 Bandas)</option>
                <option value="MC">🧠 Mediocampista (#8 Pulmón)</option>
                <option value="DFC">🛡️ Defensor Central (#4 Hierro)</option>
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

    let ovrColor = "#22e748";
    if (p.ovr >= 85) ovrColor = "#ffd166";
    else if (p.ovr >= 75) ovrColor = "#00f2fe";

    // Alerta de nuevo trofeo ganado
    let trophyCelebrationHTML = "";
    if (this.newTrophyUnlocked) {
      trophyCelebrationHTML = `
        <div class="trophy-unlocked-banner">
          <div class="trophy-unlock-icon">${this.newTrophyUnlocked.icon}</div>
          <div class="trophy-unlock-text">
            <h4>¡NUEVO TROFEO EN TU VITRINA!</h4>
            <p><strong>${this.newTrophyUnlocked.name}</strong> con ${this.newTrophyUnlocked.club} (${p.age} años)</p>
          </div>
          <button class="trophy-close-pill" onclick="window.idoloGame.dismissTrophyAlert()">✕</button>
        </div>
      `;
    }

    this.container.innerHTML = `
      ${trophyCelebrationHTML}

      <div class="idolo-dashboard-grid">
        
        <!-- Tarjeta de Jugador Principal con Camiseta 3D Animada -->
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

          <!-- ANIMACIÓN 3D DE LA CAMISETA DEL EQUIPO ACTUAL -->
          <div class="jersey-card-container">
            ${renderJerseySVG(p.club, p.name, p.position)}
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

          <!-- Cifras Principales -->
          <div class="player-stats-counter">
            <div class="stat-box"><span>Goles</span><strong>${p.goals}</strong></div>
            <div class="stat-box"><span>Asistencias</span><strong>${p.assists}</strong></div>
            <div class="stat-box"><span>Partidos</span><strong>${p.matches}</strong></div>
            <div class="stat-box"><span>Selección</span><strong>🇵🇪 ${p.caps}</strong></div>
            <div class="stat-box"><span>Títulos</span><strong style="color:var(--neon-yellow);">🏆 ${p.titles}</strong></div>
            <div class="stat-box"><span>Fortuna</span><strong style="color:#22e748;">$${p.money.toLocaleString()}</strong></div>
          </div>
        </div>

        <!-- Panel de Acciones / Decisiones -->
        <div class="idolo-card-box action-hub">
          ${this.state.currentEvent ? this.renderCurrentEventHTML() : this.renderSeasonActionsHTML()}
        </div>

      </div>

      <!-- VITRINA DE TROFEOS 3D INTERACTIVA -->
      <div class="idolo-card-box trophy-cabinet-box">
        <div class="cabinet-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:24px;">🏆</span>
            <h3>Vitrina de Trofeos Oficial</h3>
          </div>
          <span class="cabinet-count-badge">${p.titles} Trofeos Ganados</span>
        </div>

        ${this.renderTrophyCabinetHTML()}
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

    const btnSimulate = document.getElementById("idolo-btn-advance");
    if (btnSimulate) btnSimulate.addEventListener("click", () => this.advanceSeason());

    const btnTrainHard = document.getElementById("idolo-train-hard");
    if (btnTrainHard) btnTrainHard.addEventListener("click", () => this.trainPlayer("hard"));

    const btnTrainRest = document.getElementById("idolo-train-rest");
    if (btnTrainRest) btnTrainRest.addEventListener("click", () => this.trainPlayer("rest"));

    const optButtons = document.querySelectorAll("[data-event-opt]");
    optButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const optIdx = parseInt(btn.dataset.eventOpt, 10);
        this.resolveEventOption(optIdx);
      });
    });
  }

  // Generador de la Vitrina de Trofeos en Estantes de Cristal
  renderTrophyCabinetHTML() {
    const p = this.state;
    const lTitles = p.leagueTitles || 0;
    const cTitles = p.continentalTitles || 0;
    const wCups = p.worldCups || 0;
    const bDors = p.ballonDors || 0;
    const gBoots = p.goldenBoots || 0;

    return `
      <div class="cabinet-showcase">
        <div class="cabinet-shelf">
          
          <!-- Pedestal 1: Ligas Nacionales -->
          <div class="trophy-pedestal ${lTitles > 0 ? 'unlocked gold-glow' : 'locked'}" title="Torneos de Liga">
            <div class="trophy-spotlight"></div>
            <div class="trophy-3d-model">🏆</div>
            <div class="pedestal-base">
              <span class="trophy-title">Ligas</span>
              <span class="trophy-badge-qty">x${lTitles}</span>
            </div>
            <div class="pedestal-reflection"></div>
          </div>

          <!-- Pedestal 2: Copas Continentales (Libertadores / Champions) -->
          <div class="trophy-pedestal ${cTitles > 0 ? 'unlocked silver-glow' : 'locked'}" title="Copa Continental (Champions / Libertadores)">
            <div class="trophy-spotlight"></div>
            <div class="trophy-3d-model">⭐</div>
            <div class="pedestal-base">
              <span class="trophy-title">Continental</span>
              <span class="trophy-badge-qty">x${cTitles}</span>
            </div>
            <div class="pedestal-reflection"></div>
          </div>

          <!-- Pedestal 3: Copa del Mundo FIFA -->
          <div class="trophy-pedestal ${wCups > 0 ? 'unlocked worldcup-glow' : 'locked'}" title="Copa del Mundo FIFA">
            <div class="trophy-spotlight"></div>
            <div class="trophy-3d-model">🌍</div>
            <div class="pedestal-base">
              <span class="trophy-title">Mundial</span>
              <span class="trophy-badge-qty">x${wCups}</span>
            </div>
            <div class="pedestal-reflection"></div>
          </div>

          <!-- Pedestal 4: Balón de Oro -->
          <div class="trophy-pedestal ${bDors > 0 ? 'unlocked ballondor-glow' : 'locked'}" title="Balón de Oro (Mejor Jugador del Mundo)">
            <div class="trophy-spotlight"></div>
            <div class="trophy-3d-model">🌕</div>
            <div class="pedestal-base">
              <span class="trophy-title">Balón de Oro</span>
              <span class="trophy-badge-qty">x${bDors}</span>
            </div>
            <div class="pedestal-reflection"></div>
          </div>

          <!-- Pedestal 5: Bota de Oro -->
          <div class="trophy-pedestal ${gBoots > 0 ? 'unlocked boot-glow' : 'locked'}" title="Bota de Oro (Máximo Goleador)">
            <div class="trophy-spotlight"></div>
            <div class="trophy-3d-model">👟</div>
            <div class="pedestal-base">
              <span class="trophy-title">Bota de Oro</span>
              <span class="trophy-badge-qty">x${gBoots}</span>
            </div>
            <div class="pedestal-reflection"></div>
          </div>

        </div>

        ${p.trophies && p.trophies.length > 0 ? `
          <div class="trophies-chips-row">
            ${p.trophies.map(t => `
              <span class="trophy-chip" title="${t.name} (${t.year} años en ${t.club})">
                ${t.icon} ${t.name} <small>(${t.club})</small>
              </span>
            `).join("")}
          </div>
        ` : `
          <p class="cabinet-empty-note">Aún no has levantado trofeos. ¡Entrena duro, gana partidos y llena tu vitrina de gloria!</p>
        `}
      </div>
    `;
  }

  dismissTrophyAlert() {
    this.newTrophyUnlocked = null;
    this.render();
  }

  renderSeasonActionsHTML() {
    return `
      <div class="season-ready-box">
        <h3>Temporada Año ${this.state.age}</h3>
        <p>Preparado para defender los colores de <strong>${this.state.club.name}</strong>.</p>
        
        <div class="decision-cards-row">
          <button id="idolo-train-hard" class="choice-card">
            <span class="icon">💪</span>
            <strong>Entrenamiento de Élite</strong>
            <small>+2 Media OVR, -12% Energía</small>
          </button>
          <button id="idolo-train-rest" class="choice-card">
            <span class="icon">🛌</span>
            <strong>Fisioterapia & Descanso</strong>
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

    this.state.careerHistory.push(`${this.state.age} años: ${outcome}`);
    this.state.currentEvent = null;

    this.state.energy = Math.max(0, Math.min(100, this.state.energy));
    this.state.fame = Math.max(0, Math.min(100, this.state.fame));
    this.state.discipline = Math.max(0, Math.min(100, this.state.discipline));

    this.saveState();
    this.render();
  }

  advanceSeason() {
    const p = this.state;
    this.newTrophyUnlocked = null;

    // Posible evento narrativo (65% de probabilidad)
    if (!p.currentEvent && Math.random() < 0.65) {
      const randomEvent = IDOLO_EVENTS[Math.floor(Math.random() * IDOLO_EVENTS.length)];
      p.currentEvent = randomEvent;
      this.render();
      return;
    }

    const matchesPlayed = Math.floor(26 + (p.energy / 100) * 14);
    p.matches += matchesPlayed;

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

    // Bota de oro por temporada goleadora monstruosa (30+ goles)
    if (seasonGoals >= 30) {
      p.goldenBoots = (p.goldenBoots || 0) + 1;
      p.titles += 1;
      const botaTrophy = { id: "t_boot_" + Date.now(), name: "Bota de Oro Máximo Goleador", year: p.age, club: p.club.name, type: "golden_boot", icon: "👟" };
      p.trophies.push(botaTrophy);
      p.fame = Math.min(100, p.fame + 15);
      p.money += 150000;
      this.newTrophyUnlocked = botaTrophy;
      p.careerHistory.push(`👟 ¡BOTA DE ORO! Anotaste ${seasonGoals} goles en la temporada.`);
    }

    const salary = Math.round(p.ovr * 1500 * (p.club.tier || 1) * (1 + p.fame / 100));
    p.money += salary;

    // Campeón de Liga
    const winTitle = Math.random() < 0.28 + (p.ovr / 250);
    if (winTitle) {
      p.titles += 1;
      p.leagueTitles = (p.leagueTitles || 0) + 1;
      const ligaTrophy = { id: "t_" + Date.now(), name: `Campeón ${p.club.league}`, year: p.age, club: p.club.name, type: "liga", icon: "🏆" };
      p.trophies.push(ligaTrophy);
      p.fame = Math.min(100, p.fame + 10);
      p.money += 45000;
      this.newTrophyUnlocked = ligaTrophy;
      p.careerHistory.push(`🏆 ¡CAMPEÓN de ${p.club.league} con ${p.club.name}!`);
    }

    // Torneo Continental (Copa Libertadores o Champions League)
    if (p.club.tier >= 3 && Math.random() < 0.22 + (p.ovr / 300)) {
      p.titles += 1;
      p.continentalTitles = (p.continentalTitles || 0) + 1;
      const contName = (p.club.tier >= 4) ? "UEFA Champions League" : "Copa Libertadores";
      const contTrophy = { id: "t_cont_" + Date.now(), name: contName, year: p.age, club: p.club.name, type: "continental", icon: "⭐" };
      p.trophies.push(contTrophy);
      p.fame = Math.min(100, p.fame + 20);
      p.money += 200000;
      this.newTrophyUnlocked = contTrophy;
      p.careerHistory.push(`⭐ ¡GLORIA ETERNA! Conquistaste la ${contName} con ${p.club.name}.`);
    }

    // Copa del Mundo FIFA (cada 4 años: 18, 22, 26, 30, 34 años)
    if ([18, 22, 26, 30, 34].includes(p.age) && p.ovr >= 70) {
      p.caps += 6;
      if (Math.random() < 0.20 + (p.ovr / 300)) {
        p.worldCups = (p.worldCups || 0) + 1;
        p.titles += 1;
        p.fame = 100;
        p.money += 600000;
        const wcTrophy = { id: "t_wc_" + Date.now(), name: "Copa del Mundo FIFA", year: p.age, club: p.nationality, type: "mundial", icon: "🌍" };
        p.trophies.push(wcTrophy);
        this.newTrophyUnlocked = wcTrophy;
        p.careerHistory.push(`🌍 ¡CAMPEÓN DEL MUNDO! Alzaste la Copa del Mundo con ${p.nationality}. Héroe de la patria.`);
      }
    }

    // Balón de oro
    if (p.ovr >= 87 && (p.club.tier || 1) >= 4 && Math.random() < 0.38) {
      p.ballonDors = (p.ballonDors || 0) + 1;
      p.fame = 100;
      const bdoTrophy = { id: "t_bdo_" + Date.now(), name: "Balón de Oro", year: p.age, club: p.club.name, type: "ballon_dor", icon: "🌕" };
      p.trophies.push(bdoTrophy);
      this.newTrophyUnlocked = bdoTrophy;
      p.careerHistory.push(`🌕 ¡GANASTE EL BALÓN DE ORO! Coronado el mejor futbolista del planeta.`);
    }

    // Evolución de media según edad
    if (p.age < 27) {
      p.ovr = Math.min(98, p.ovr + Math.floor(1 + Math.random() * 3));
    } else if (p.age >= 32) {
      p.ovr = Math.max(55, p.ovr - Math.floor(1 + Math.random() * 2));
      p.energy = Math.max(10, p.energy - 8);
    }

    this.checkForTransfers();
    p.age++;

    if (p.age >= 37) {
      p.isRetired = true;
      p.careerHistory.push(`🎖️ Se retira del fútbol profesional a los ${p.age - 1} años de edad.`);
    }

    this.saveState();
    this.render();
  }

  checkForTransfers() {
    const p = this.state;
    if (p.ovr >= 82 && p.club.tier < 5) {
      const elite = IDOLO_CLUBS.europa_elite[Math.floor(Math.random() * IDOLO_CLUBS.europa_elite.length)];
      p.club = elite;
      p.money += 350000;
      p.fame = Math.min(100, p.fame + 20);
      p.careerHistory.push(`🚀 ¡Fichaje Galáctico! Traspasado a ${elite.name} (${elite.country}).`);
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

        <!-- Última Camiseta Usada -->
        <div style="max-width:180px; margin: 0 auto 20px;">
          ${renderJerseySVG(p.club, p.name, p.position)}
        </div>

        <!-- Vitrina Completa de Trofeos -->
        <div class="trophy-cabinet-box" style="margin-bottom: 24px;">
          <h4 style="color:var(--neon-yellow); margin-bottom:12px;">🏆 Vitrina Definitiva de Palmarés (${p.titles} Trofeos)</h4>
          ${this.renderTrophyCabinetHTML()}
        </div>

        <div class="idolo-summary-card">
          <h4>Resumen de Carrera: ${p.name}</h4>
          <div class="summary-stats-grid">
            <div><span>Partidos:</span> <strong>${p.matches}</strong></div>
            <div><span>Goles:</span> <strong>${p.goals}</strong></div>
            <div><span>Asistencias:</span> <strong>${p.assists}</strong></div>
            <div><span>Títulos Ganados:</span> <strong>🏆 ${p.titles}</strong></div>
            <div><span>Mundiales Ganados:</span> <strong>🌍 ${p.worldCups || 0}</strong></div>
            <div><span>Balones de Oro:</span> <strong>🌕 ${p.ballonDors || 0}</strong></div>
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
