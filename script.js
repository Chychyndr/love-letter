const CONFIG = { message: "You are my favorite place to come back to", typingSpeed: 54, particles: 52 };
const app = document.querySelector('#app');
const stage = document.querySelector('.stage');
const particles = document.querySelector('#particles');
const envelopeButton = document.querySelector('#envelopeButton');
const letterDialog = document.querySelector('#letterDialog');
const closeLetter = document.querySelector('#closeLetter');
const typedText = document.querySelector('#typedText');
const cursor = document.querySelector('#cursor');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const art = envelopeButton.querySelector('svg');
const front = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
front.setAttribute('viewBox', '0 0 520 380');
front.setAttribute('class', 'envelope-front-layer');
front.setAttribute('aria-hidden', 'true');
front.setAttribute('focusable', 'false');
for (const selector of ['.env-front', '.env-closed-flap', '.wax-seal-svg']) front.append(art.querySelector(selector));
art.querySelector('.preview-letter')?.remove();
stage.append(front);
letterDialog.inert = true;
let state = 'closed';
let typingTimer;
const wait = ms => new Promise(resolve => setTimeout(resolve, motion.matches ? 0 : ms));
function createParticles() {
  const symbols = ['♥', '♡', '✦', '✧', '•'];
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < CONFIG.particles; i++) {
    const item = document.createElement('span');
    item.className = 'particle';
    item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const values = { x: (Math.random()*100)+'%', size: (9+Math.random()*22)+'px', duration: (13+Math.random()*18)+'s', delay: (-Math.random()*26)+'s', drift: (-95+Math.random()*190)+'px', r: (-35+Math.random()*70)+'deg', alpha: .2+Math.random()*.46 };
    for (const [key, value] of Object.entries(values)) item.style.setProperty('--'+key, value);
    fragment.append(item);
  }
  particles.append(fragment);
}
function stopTyping() { clearTimeout(typingTimer); cursor.classList.remove('is-visible'); }
function typeMessage() {
  stopTyping();
  typedText.textContent = '';
  if (motion.matches) { typedText.textContent = CONFIG.message; return; }
  cursor.classList.add('is-visible');
  let index = 0;
  function write() {
    typedText.textContent = CONFIG.message.slice(0, ++index);
    if (index < CONFIG.message.length) typingTimer = setTimeout(write, CONFIG.message[index-1] === ' ' ? CONFIG.typingSpeed*.55 : CONFIG.typingSpeed);
    else typingTimer = setTimeout(stopTyping, 850);
  }
  write();
}
async function openEnvelope() {
  if (state !== 'closed') return;
  state = 'opening'; envelopeButton.disabled = true;
  app.classList.add('is-unsealed'); await wait(180);
  app.classList.add('is-open'); await wait(520);
  app.classList.add('is-lifted'); await wait(900);
  app.classList.add('is-expanded'); await wait(900);
  app.classList.add('is-reading'); letterDialog.inert = false; state = 'reading';
  typeMessage(); closeLetter.focus({preventScroll:true});
}
async function closeFullLetter() {
  if (state !== 'reading') return;
  state = 'closing'; stopTyping(); letterDialog.inert = true;
  app.classList.remove('is-reading'); await wait(180); typedText.textContent = '';
  app.classList.remove('is-expanded'); await wait(900);
  app.classList.remove('is-lifted'); await wait(900);
  app.classList.remove('is-open'); await wait(520);
  app.classList.remove('is-unsealed'); await wait(180);
  state = 'closed'; envelopeButton.disabled = false; envelopeButton.focus({preventScroll:true});
}
envelopeButton.addEventListener('click', openEnvelope);
closeLetter.addEventListener('click', closeFullLetter);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeFullLetter(); });
createParticles();
