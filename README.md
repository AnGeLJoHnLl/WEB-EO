# 🇵🇪 Perú Lounge & Arcade

Una sala de entretenimiento web interactiva que reúne las **principales radios peruanas en vivo** junto con una **sala de minijuegos retro y arcade**, diseñada para funcionar tanto en computadoras como en dispositivos móviles (Android / iOS).

---

## 🌟 Características Principales

### 📻 1. Radios Peruanas en Vivo (Streams Oficiales HTTPS)
- **18+ Emisoras oficiales** con sonido digital directo en alta fidelidad:
  - **Radio Moda (97.3 FM)** – Reggaetón & Urbano
  - **RPP Noticias (89.7 FM / 730 AM)** – Noticias y Actualidad
  - **Studio 92 (92.5 FM)** – Pop, Urbano & Electro
  - **Radio Panamericana (101.1 FM)** – Salsa dura y Timba
  - **Radio Onda Cero (98.1 FM)** – Urbano, Trap & Reggaetón
  - **Radio Oxígeno (102.1 FM)** – Clásicos del Rock & Pop 80s y 90s
  - **Radio Ritmo Romántica (93.1 FM)** – Baladas románticas
  - **Radio Nueva Q (107.1 FM)** – Cumbia peruana
  - **Radiomar Plus (106.3 FM)** – Salsa y timba
  - **Radio Karibeña (94.9 FM)** – Los grandes éxitos de la cumbia
  - **Radio La Kalle (96.1 FM)** – Salsa de los 80s/90s y música criolla
  - **Radio La Inolvidable (93.7 FM)** – Música del recuerdo
  - **Radio Felicidad (88.9 FM)** – Boleros de oro y recuerdos
  - **Radio Doble Nueve (99.1 FM)** – Rock alternativo e Indie
  - **Radio Planeta (107.7 FM)** – Pop internacional en inglés
  - **Radio Mágica (88.3 FM)** – Oldies 60s, 70s y 80s
  - **Radio Exitosa (95.5 FM)** – Noticias y debate
  - **Radio Cumbia Mix** – Pura cumbia 24 horas
- **Reproductor persistente:** La radio **nunca se corta** mientras navegas por los minijuegos o cambias de pestaña.
- **Ecualizador animado** en tiempo real.
- **Control de volumen y silenciador.**
- **Buscador en vivo y filtros de género** (Urbano, Cumbia, Salsa, Rock, Baladas, Noticias, Recuerdos).
- **Sistema de Favoritos** persistente con `localStorage`.
- **Temporizador de apagado (Sleep Timer)** para ir a dormir escuchando tu radio favorita (15m, 30m, 60m).
- **Integración con MediaSession API:** Controla la música desde el teclado multimedia, la pantalla de bloqueo o las notificaciones del móvil.

---

### 🕹️ 2. Sala de Juegos Arcade
Todos los juegos se ejecutan directamente en el navegador sin instalar nada, con controles adaptados para teclado de PC y mandos táctiles en pantalla para celulares:

1. **🐍 Culebrita Neon (Snake Arcade):** Gráficos neón, frutas con multiplicadores, aceleración progresiva y tabla de récord.
2. **🧱 Tetris Retro:** Matriz 10x20 clásica, indicador de pieza siguiente, sombra de caída fantasma (ghost piece), niveles y filas récord.
3. **🔢 2048 Huarique:** Desliza fichas con flechas o deslizando con el dedo (swipes táctiles), opción de deshacer movimiento (Undo) y puntuación récord.
4. **🇵🇪 Trivia Peruana de Oro:** Banco de preguntas sobre gastronomía, historia incaica, cultura, música y jergas cotidianas, con temporizador de 15 segundos y racha de aciertos.
5. **🎴 Memoria Criolla:** Encuentra las parejas de cartas con íconos de la cultura peruana (Ceviche, Lomo Saltado, Machu Picchu, Torito de Pucará, Cajón Peruano, etc.).

---

## 🚀 Cómo publicar en GitHub y tener tu enlace público (GitHub Pages)

Para que cualquier persona pueda entrar con un solo clic a tu web desde su teléfono o computadora:

### Paso 1: Crea un nuevo repositorio en GitHub
1. Entra a [https://github.com/new](https://github.com/new).
2. Asigna un nombre al repositorio (por ejemplo: `sala-entretenimiento`).
3. Elige la opción **Public** (Público).
4. No marques la opción de inicializar con README (ya tienes este archivo).
5. Haz clic en **Create repository**.

### Paso 2: Sube los archivos con Git
Abre la consola / terminal en la carpeta de este proyecto (`C:\Users\alexa\.gemini\antigravity\scratch\sala-entretenimiento`) y escribe:

```bash
git remote add origin https://github.com/TU_USUARIO/sala-entretenimiento.git
git branch -M main
git push -u origin main
```

*(Reemplaza `TU_USUARIO` por tu nombre de usuario de GitHub).*

### Paso 3: Activa GitHub Pages
1. En tu repositorio en GitHub, ve a **Settings** (Configuración) en la parte superior.
2. En el menú de la izquierda, haz clic en **Pages**.
3. En la sección **Build and deployment > Branch**, selecciona:
   - Rama: `main`
   - Carpeta: `/ (root)`
4. Haz clic en **Save**.
5. ¡Listo! En 1 a 2 minutos verás un mensaje con tu enlace público:
   
   👉 **`https://TU_USUARIO.github.io/sala-entretenimiento/`**

Cualquiera que abra ese enlace entrará directamente a la sala de entretenimiento.

---

## 🛠️ Tecnologías Utilizadas
- **HTML5:** Semántico y accesible.
- **CSS3:** Glassmorphism, animaciones fluidas, paleta Cyber-Lounge neón y diseño 100% responsivo para móviles y PC.
- **JavaScript Moderno (ES6+):** Sin dependencias pesadas, carga instantánea en milisegundos.
- **HTML5 Audio API & Web MediaSession API:** Reproducción ininterrumpida en segundo plano.
