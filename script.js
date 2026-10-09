// ─── CONFIG ───────────────────────────────────────────────────────
// ⚡ PERSONALIZAR ESTAS VARIABLES:
const PARTY_DATE = new Date('2026-12-05T21:00:00'); // ← Cambiá la fecha
const BIRTHDAY_NAME = '[NOMBRE]'; // ← Cambiá el nombre
const DJ_EMAIL = 'dj@placeholder.com'; // ← Email del DJ
const RSVP_EMAIL = 'tomasezequielcirulli@gmail.com'; // ← Email del cumpleañero

// ─── QUIZ DATA ────────────────────────────────────────────────────
// ⚡ PERSONALIZAR LAS PREGUNTAS:
const quizData = [
  {
    q: '¿Cuál es la película favorita de [NOMBRE]?',
    opts: ['[Opción A]', '[Opción B]', '[Opción C]', '[Opción D]'],
    correct: 0
  },
  {
    q: '¿Cuál es su comida preferida?',
    opts: ['[Opción A]', '[Opción B]', '[Opción C]', '[Opción D]'],
    correct: 2
  },
  {
    q: '¿Qué haría [NOMBRE] un sábado libre?',
    opts: ['Dormir hasta las 2pm', 'Salir a correr', 'Maratón de series', 'Juntarse con amigos'],
    correct: 2
  },
  {
    q: '¿Cuál es su mayor fobia?',
    opts: ['[Opción A]', '[Opción B]', '[Opción C]', '[Opción D]'],
    correct: 1
  },
  {
    q: '¿Qué artista escucha en loop?',
    opts: ['WOS', 'Arctic Monkeys', '[Artista C]', '[Artista D]'],
    correct: 0
  },
  {
    q: '¿Cuántos años tiene de conocer a su mejor amigo?',
    opts: ['2 años', '5 años', '10 años', 'Toda la vida'],
    correct: 1
  },
];

// ─── BINGO DATA ───────────────────────────────────────────────────
// ⚡ PERSONALIZAR LOS CASILLEROS (24 ítems + 1 FREE = 25 total):
const bingoItems = [
  'Alguien llega en pijama', 'El DJ pone reggaeton', 'Foto con el disfraz más raro',
  '[NOMBRE] llora de emoción', 'Se rompe algo en la pista', 'Alguien canta Bohemian Rhapsody',
  'Pareja besándose en la pista', 'El buffet se queda sin algo', 'Alguien se saca el disfraz',
  'Selfie grupal espontánea', 'Discurso emotivo', 'Alguien llega tardísimo',
  '★ FREE ★', // posición 12 = centro
  'El cumpleañero baila solo', 'Flashmob o coreografía',
  'Se pierde un accesorio', '[NOMBRE] se ríe a carcajadas', 'Canción de los 2000s',
  'El photobooth con cola', 'Alguien se duerme en un rincón', 'Todo el mundo en la pista',
  'Brindis con discurso', '[NOMBRE] se emociona con un regalo', 'La torta aparece sorpresa',
  'La música para un segundo'
];

// ─── BACKGROUND CANVAS ────────────────────────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const STAR_COLORS = [
  '#FFFFFF',   // blanco puro — la mayoría
  '#1713cf',   // más peso al blanco
  '#FFFFFF',
  '#C8D8FF',   // blanco azulado — estrellas tipo A
  '#A8C4FF',   // azul suave — estrellas tipo B
  '#E8EEFF',   // casi blanco con toque frío
  '#B44FE8',   // violeta del colour — las raras, las que no deberían estar
];

for (let i = 0; i < 120; i++) {  // más cantidad, más campo estelar
  const isBright = Math.random() < 0.08;  // 8% son estrellas brillantes
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.04,  // casi quietas — el espacio no se mueve
    vy: (Math.random() - 0.5) * 0.04,
    size: isBright ? Math.random() * 2 + 1.5 : Math.random() * 1 + 0.3,
    alpha: isBright ? Math.random() * 0.4 + 0.5 : Math.random() * 0.5 + 0.1,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinkleOffset: Math.random() * Math.PI * 2,
    hue: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    isBright,
  });
}

let frame = 0;
function drawBg() {
  ctx.clearRect(0, 0, W, H);
  frame++;

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;

    // parpadeo suave
    const twinkle = Math.sin(frame * p.twinkleSpeed + p.twinkleOffset);
    const alpha = p.alpha + twinkle * (p.isBright ? 0.38 : 0.12);

    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);

    if (p.isBright) {
      // halo para las brillantes
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      gradient.addColorStop(0, p.hue);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // punto central
    ctx.fillStyle = p.hue;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  requestAnimationFrame(drawBg);
}
drawBg();

// ─── COUNTDOWN ────────────────────────────────────────────────────

function updateCountdown() {
  const daysElement = document.getElementById('cd-days');
  if (!daysElement) return;

  const diff = PARTY_DATE - new Date();
  if (diff <= 0) {
    daysElement.textContent = '¡YA!';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  daysElement.textContent = String(d).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ─── PERGAMINO ──────────────────────────────────────────────────────
function togglePergamino() {
  const overlay = document.getElementById('pergamino-overlay');
  if (!overlay) return;
  const isOpen = overlay.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closePergaminoOutside(e) {
  if (e.target === document.getElementById('pergamino-overlay')) {
    togglePergamino();
  }
}

// ─── RSVP ─────────────────────────────────────────────────────────
async function submitRSVP() {
  const name = document.getElementById('rsvp-name').value.trim();
  const attend = document.getElementById('rsvp-attend').value;
  if (!name || !attend) { showToast('Por favor completá nombre y asistencia 🎭'); return; }

  const costume = document.getElementById('rsvp-costume').value;
  const msg = document.getElementById('rsvp-msg').value;
  const email = document.getElementById('rsvp-email').value;
  const food = document.getElementById('rsvp-food').value;

  // Obtener número de Firebase
  let numero = '—';
  try {
    const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js');
    const { getDatabase, ref, runTransaction } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js');

    const fbConfig = {
      apiKey: "AIzaSyAitvN3B5vGyrBehrViniNSI0qZmuXFjiw",
      authDomain: "paginaweb18-658f6.firebaseapp.com",
      databaseURL: "https://paginaweb18-658f6-default-rtdb.firebaseio.com",
      projectId: "paginaweb18-658f6",
      storageBucket: "paginaweb18-658f6.firebasestorage.app",
      messagingSenderId: "348480266849",
      appId: "1:348480266849:web:301522e8bee4e6ba528020"
    };

    const fbApp = getApps().length ? getApps()[0] : initializeApp(fbConfig);
    const db = getDatabase(fbApp);

    const result = await runTransaction(ref(db, 'rsvp_counter'), current => (current || 0) + 1);
    if (result.committed) numero = result.snapshot.val();
  } catch (err) {
    console.warn('No se pudo obtener número de Firebase:', err);
    // Continúa igual, sin número
  }

  const params = {
    name,
    telefono: document.getElementById('rsvp-tel').value || 'No especificado',
    email:    email || 'No especificado',
    asiste:   attend === 'si' ? '✅ Confirma' : attend === 'no' ? '❌ No puede' : '⏳ Tal vez',
    disfraz:  costume || 'No especificó',
    comida:   food || 'Ninguna',
    mensaje:  msg || '—',
    numero:   `#${numero}`,
  };

  // Mail a vos
  emailjs.send('service_c72ygvu', 'template_vjzj65e', params)
    .catch(err => console.error('Error mail Tomas:', err));

  // Mail al invitado (solo si dejó email y confirma o tal vez)
  if (email && attend !== 'no') {
    emailjs.send('service_c72ygvu', 'template_2am7883', params)
      .catch(err => console.error('Error mail invitado:', err));
  }

  document.getElementById('rsvp-form-wrap').style.display = 'none';
  const success = document.getElementById('rsvp-success');
  success.style.display = 'block';
  document.getElementById('success-name').textContent =
    attend === 'si' ? `¡Te vemos en la fiesta, ${name}! Sos el invitado #${numero} 🎟️` : '';
  launchConfetti();
}

// ─── MUSIC ────────────────────────────────────────────────────────
let songQueue = [];
let karaokeList = [];

// Canciones de muestra + búsqueda simulada (integrar con YouTube Data API v3)
const sampleSongs = [
  { title: 'Blinding Lights', artist: 'The Weeknd', emoji: '🎵' },
  { title: 'Bad Guy', artist: 'Billie Eilish', emoji: '🎵' },
  { title: 'Shape of You', artist: 'Ed Sheeran', emoji: '🎵' },
  { title: 'Tití Me Preguntó', artist: 'Bad Bunny', emoji: '🎵' },
  { title: 'Flowers', artist: 'Miley Cyrus', emoji: '🎵' },
  { title: 'Anti-Hero', artist: 'Taylor Swift', emoji: '🎵' },
  { title: 'As It Was', artist: 'Harry Styles', emoji: '🎵' },
  { title: 'Quevedo: Bzrp Session', artist: 'Bizarrap & Quevedo', emoji: '🎵' },
  { title: 'Ojitos Lindos', artist: 'Bad Bunny & Bomba Estéreo', emoji: '🎵' },
  { title: 'Unholy', artist: 'Sam Smith', emoji: '🎵' },
];

function switchMusicTab(btn, panelId) {
  document.querySelectorAll('.music-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.music-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}

function searchSongs() {
  const q = document.getElementById('music-search-input').value.toLowerCase().trim();
  const list = document.getElementById('song-list');

  const results = q
    ? sampleSongs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q))
    : sampleSongs;

  if (results.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:2rem 0">No encontramos canciones. Probá con otro título. 🎵</p>';
    return;
  }

  list.innerHTML = results.map((s, i) => `
    <div class="song-item" id="song-${i}">
      <div class="song-thumb">${s.emoji}</div>
      <div class="song-info">
        <div class="song-title">${s.title}</div>
        <div class="song-artist">${s.artist}</div>
      </div>
      <button class="song-add-btn" onclick="addToQueue(${i}, '${s.title.replace(/'/g,"\\'")}', '${s.artist.replace(/'/g,"\\'")}', this)">+ Cola</button>
    </div>
  `).join('');
}

function addToQueue(idx, title, artist, btn) {
  const already = songQueue.find(s => s.title === title);
  if (already) { showToast('Ya está en la cola 🎵'); return; }
  songQueue.push({ title, artist });
  btn.textContent = '✓ Añadida';
  btn.classList.add('added');
  document.getElementById('queue-count').textContent = songQueue.length;
  renderQueue();
  showToast(`"${title}" agregada a la cola 🎶`);
}

function renderQueue() {
  const ql = document.getElementById('queue-list');
  if (songQueue.length === 0) {
    ql.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:2rem 0">La cola está vacía. ¡Pedí canciones! 🎵</p>';
    return;
  }
  ql.innerHTML = songQueue.map((s, i) => `
    <div class="queue-item">
      <span class="queue-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="song-info">
        <div class="song-title">${s.title}</div>
        <div class="song-artist">${s.artist}</div>
      </div>
      <button class="queue-remove" onclick="removeFromQueue(${i})" title="Quitar">✕</button>
    </div>
  `).join('');
}

function removeFromQueue(i) {
  songQueue.splice(i, 1);
  document.getElementById('queue-count').textContent = songQueue.length;
  renderQueue();
}

function exportQueueForDJ() {
  if (songQueue.length === 0) { showToast('La cola está vacía 🎵'); return; }
  const lines = songQueue.map((s, i) => `${String(i+1).padStart(2,'0')}. ${s.title} — ${s.artist}`).join('\n');
  const full = `🎧 LISTA PARA EL DJ — ${BIRTHDAY_NAME}'s 18\n${'─'.repeat(40)}\n${lines}\n${'─'.repeat(40)}\nKARAOKE:\n${karaokeList.length ? karaokeList.map((k,i)=>`${i+1}. ${k.name}: "${k.song}"`).join('\n') : 'Sin anotados aún'}\n\nGenerado desde la web del 18 de ${BIRTHDAY_NAME}`;
  document.getElementById('dj-export-content').textContent = full;
  document.getElementById('dj-modal').classList.add('open');
}

function copyDJList() {
  const text = document.getElementById('dj-export-content').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('Copiado al portapapeles ✓'));
}

function addKaraoke() {
  const name = document.getElementById('karaoke-name').value.trim();
  const song = document.getElementById('karaoke-song').value.trim();
  if (!name || !song) { showToast('Completá tu nombre y la canción 🎤'); return; }
  karaokeList.push({ name, song });
  document.getElementById('karaoke-name').value = '';
  document.getElementById('karaoke-song').value = '';
  renderKaraoke();
  showToast(`¡${name} anotado/a al karaoke! 🎤`);
}

function renderKaraoke() {
  const kl = document.getElementById('karaoke-list');
  kl.innerHTML = '<p style="font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:0.75rem">Lista de karaoke</p>' +
    karaokeList.map((k, i) => `
      <div style="display:flex;align-items:center;gap:1rem;padding:0.6rem 0.8rem;background:rgba(255,255,255,0.03);border:1px solid rgba(201,168,76,0.15);border-left:3px solid var(--gold);font-size:0.85rem;">
        <span style="color:var(--gold);font-family:'Cinzel Decorative',serif;opacity:0.5">${String(i+1).padStart(2,'0')}</span>
        <div><span style="color:var(--cream)">${k.name}</span><span style="color:var(--text-muted)"> — "${k.song}"</span></div>
      </div>
    `).join('');
}

// ─── QUIZ ─────────────────────────────────────────────────────────
let quizCurrent = 0, quizScore = 0, quizAnswered = false;

function initQuiz() {
  quizCurrent = 0; quizScore = 0;
  document.getElementById('quiz-content').style.display = 'block';
  document.getElementById('quiz-result').style.display = 'none';
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quizData[quizCurrent];
  const prog = document.getElementById('quiz-progress');
  prog.innerHTML = quizData.map((_, i) =>
    `<div class="quiz-dot ${i < quizCurrent ? 'done' : i === quizCurrent ? 'current' : ''}"></div>`
  ).join('');

  document.getElementById('quiz-question').textContent = q.q;
  quizAnswered = false;
  document.getElementById('quiz-next').style.display = 'none';

  const opts = document.getElementById('quiz-options');
  opts.innerHTML = q.opts.map((o, i) =>
    `<button class="quiz-opt" onclick="selectQuizOpt(${i}, this)">${o}</button>`
  ).join('');
}

function selectQuizOpt(i, btn) {
  if (quizAnswered) return;
  quizAnswered = true;
  const q = quizData[quizCurrent];
  document.querySelectorAll('.quiz-opt').forEach((b, idx) => {
    if (idx === q.correct) b.classList.add('correct');
    else if (b === btn && idx !== q.correct) b.classList.add('wrong');
  });
  if (i === q.correct) quizScore++;
  document.getElementById('quiz-next').style.display = 'block';
}

function nextQuestion() {
  quizCurrent++;
  if (quizCurrent >= quizData.length) showQuizResult();
  else renderQuizQuestion();
}

function showQuizResult() {
  document.getElementById('quiz-content').style.display = 'none';
  const result = document.getElementById('quiz-result');
  result.style.display = 'block';
  document.getElementById('quiz-score').textContent = `${quizScore}/${quizData.length}`;
  const pct = quizScore / quizData.length;
  const verdicts = ['Hmm... ¿seguro/a que lo/la conocés? 🤔', 'Algo sabés... pero hay mucho por aprender 😅', '¡No está mal! Bastante bien 😄', '¡Muy bien! Gran amigo/a 🎉', `¡Perfecto! Sos el/la mejor amigo/a de ${BIRTHDAY_NAME} 🏆`];
  const vi = pct === 1 ? 4 : pct >= 0.8 ? 3 : pct >= 0.6 ? 2 : pct >= 0.4 ? 1 : 0;
  document.getElementById('quiz-verdict').textContent = verdicts[vi];
  if (pct >= 0.8) launchConfetti();
}

function restartQuiz() { initQuiz(); }
if (document.getElementById('quiz-content')) initQuiz(); // solo si la sección existe en el HTML

// ─── BINGO ────────────────────────────────────────────────────────
let bingoState = Array(25).fill(false);
let currentBingo = [];

function shuffleBingo() {
  bingoState = Array(25).fill(false);
  const items = [...bingoItems.filter(b => b !== '★ FREE ★')];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  currentBingo = [...items.slice(0, 12), '★ FREE ★', ...items.slice(12, 24)];
  bingoState[12] = true;
  renderBingo();
  document.getElementById('bingo-announce').classList.remove('show');
}

function renderBingo() {
  const grid = document.getElementById('bingo-grid');
  grid.innerHTML = currentBingo.map((cell, i) => `
    <div class="bingo-cell ${i === 12 ? 'free' : ''} ${bingoState[i] ? 'marked' : ''}"
      onclick="toggleBingo(${i})">${cell}</div>
  `).join('');
}

function toggleBingo(i) {
  if (i === 12) return;
  bingoState[i] = !bingoState[i];
  renderBingo();
  checkBingo();
}

function checkBingo() {
  const lines = [
    [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],
    [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
    [0,6,12,18,24],[4,8,12,16,20]
  ];
  const won = lines.some(line => line.every(i => bingoState[i]));
  if (won) {
    document.getElementById('bingo-announce').classList.add('show');
    launchConfetti();
  }
}

if (document.getElementById('bingo-grid')) shuffleBingo(); // solo si la sección existe en el HTML

// ─── PHOTOS ───────────────────────────────────────────────────────
function handlePhotoUpload(event) {
  const files = Array.from(event.target.files);
  const grid = document.getElementById('photo-grid');
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const div = document.createElement('div');
      div.className = 'photo-item';
      div.innerHTML = `<img src="${e.target.result}" alt="Foto de la fiesta">`;
      div.onclick = () => openPhotoModal(e.target.result);
      grid.insertBefore(div, grid.firstChild);
    };
    reader.readAsDataURL(file);
  });
}

function openPhotoModal(src) {
  document.getElementById('modal-photo-img').src = src;
  document.getElementById('photo-modal').classList.add('open');
}

// ─── MODALS ───────────────────────────────────────────────────────
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ─── CONFETTI ─────────────────────────────────────────────────────
function launchConfetti() {
  const colors = ['#C9A84C', '#8B1A1A', '#F5E8C0', '#E8CC7A', '#fff'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${4 + Math.random() * 8}px;
      height: ${4 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.8}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ─── TOAST ────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── SCROLL ANIMATIONS ────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Al cargar la página, chequeá si ya vio el teaser
window.addEventListener('DOMContentLoaded', () => {
  const yaVio = localStorage.getItem('teaser_visto');
  if (yaVio) {
    const overlay = document.getElementById('teaser-overlay');
    if (overlay) overlay.remove();
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }
});

function closeTeaser(e) {
  e.preventDefault();
  localStorage.setItem('teaser_visto', '1');
  const overlay = document.getElementById('teaser-overlay');
  overlay.style.transition = 'opacity 1s ease';
  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  setTimeout(() => {
    overlay.remove();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 800);
}

// ─── CARRUSEL INFINITO (Juegos de la noche) ──────────────────────
(function () {
  const track = document.getElementById('juegos-track');
  const inner = document.getElementById('juegos-inner');
  if (!track || !inner) return;

  const originals = Array.from(inner.children);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = 28;            // px por segundo
  const EXTRA_SETS = 7;        // copias de más para tener margen al deslizar fuerte
  let setW = 0, pos = 0, last = 0, builtWidth = 0;
  let hover = false, touching = false, dragging = false, visible = true;
  let resumeAt = 0, moved = 0, startX = 0, startLeft = 0, idleTimer = null, resizeTimer = null;

  function build() {
    inner.querySelectorAll('[data-clone]').forEach(n => n.remove());
    const first = originals[0], lastC = originals[originals.length - 1];
    const mr = parseFloat(getComputedStyle(lastC).marginRight) || 0;
    setW = lastC.offsetLeft + lastC.offsetWidth + mr - first.offsetLeft;
    if (!setW) return;
    const sets = Math.ceil(track.clientWidth / setW) + EXTRA_SETS;
    for (let i = 1; i < sets; i++) originals.forEach(c => {
      const k = c.cloneNode(true);
      k.setAttribute('data-clone', ''); k.setAttribute('aria-hidden', 'true'); k.setAttribute('tabindex', '-1');
      inner.appendChild(k);
    });
    builtWidth = window.innerWidth;
    pos = setW * 3; track.scrollLeft = pos;
  }

  // Lleva la posición a la franja central. Como las copias son idénticas, no se nota.
  // Solo se llama cuando el carrusel está quieto (así no corta el impulso del dedo en el celu).
  function normalize() {
    if (!setW) return;
    const rel = (((track.scrollLeft - setW * 3) % setW) + setW) % setW;
    const target = setW * 3 + rel;
    if (Math.abs(target - track.scrollLeft) > 1) track.scrollLeft = target;
    pos = track.scrollLeft;
  }

  function tick(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0); last = t;
    const auto = setW && visible && !reduce && !hover && !touching && !dragging && t > resumeAt;
    if (auto) {
      pos += SPEED * dt;
      if (pos >= setW * 4) pos -= setW;
      track.scrollLeft = pos;
    } else if (setW) {
      pos = track.scrollLeft;
    }
    requestAnimationFrame(tick);
  }

  const pause = ms => { resumeAt = performance.now() + ms; };

  // mouse (solo mouse: en el celu "hover" se queda pegado y frenaba el carrusel)
  track.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; });
  track.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { hover = false; pause(600); } });
  track.addEventListener('focusin', () => { hover = true; });
  track.addEventListener('focusout', () => { hover = false; pause(600); });

  // dedo
  track.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  const endTouch = () => { touching = false; pause(2500); };
  track.addEventListener('touchend', endTouch, { passive: true });
  track.addEventListener('touchcancel', endTouch, { passive: true });

  // trackpad / rueda horizontal
  track.addEventListener('wheel', () => pause(2000), { passive: true });

  // cuando se queda quieto, reacomodamos
  track.addEventListener('scroll', () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!touching && !dragging) normalize(); }, 160);
  }, { passive: true });

  // arrastrar con el mouse
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    dragging = true; moved = 0; startX = e.clientX; startLeft = track.scrollLeft;
    track.classList.add('dragging');
  });
  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX; moved = Math.max(moved, Math.abs(dx));
    track.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false; track.classList.remove('dragging'); pause(1500);
  });
  track.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } moved = 0; }, true);

  // solo se anima cuando se ve en pantalla (ahorra batería y memoria)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(track);
  }

  // en el celu la barra del navegador cambia el alto al scrollear: solo reconstruimos si cambia el ANCHO
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (window.innerWidth !== builtWidth) build(); }, 200);
  });

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);
  build();
  requestAnimationFrame(tick);
})();