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
const flapLayer = front.cloneNode(false);
flapLayer.setAttribute('class', 'envelope-flap-layer');
const flap = art.querySelector('.env-closed-flap');
flap.removeAttribute('clip-path');
flapLayer.append(flap);
const seal = art.querySelector('.wax-seal-svg');
flapLayer.append(seal);
front.append(art.querySelector('.env-front'));
art.querySelector('.env-open-flap')?.remove();
art.querySelector('.preview-letter')?.remove();
stage.append(front, flapLayer);
const envelopeWrap = document.querySelector('#envelopeWrap');
letterDialog.inert = true;
let state = 'closed';
let typingTimer;
const TIMING = { total: 2050, seal: [0, 220], flap: [100, 760], extract: [550, 1420], expand: [1190, 2050] };
let position = 0;
const clamp = v => Math.min(1, Math.max(0, v));
const mix = (a, b, t) => a + (b - a) * t;
const ease = t => t * t * (3 - 2 * t);
const phase = (ms, [start, end]) => ease(clamp((ms - start) / (end - start)));

// All moving elements share one reversible timeline. The flap is a single
// piece of paper rotating around its fixed horizontal fold at SVG y=103.
function render(progress) {
  position = progress;
  const ms = progress * TIMING.total;
  const released = phase(ms, TIMING.seal);
  const angle = Math.PI * phase(ms, TIMING.flap);
  const projection = Math.cos(angle);
  const extracted = phase(ms, TIMING.extract);
  const expanded = phase(ms, TIMING.expand);
  flap.setAttribute('transform', `translate(0 103) scale(1 ${projection}) translate(0 -103)`);
  flapLayer.classList.toggle('is-back', projection < 0);
  flapLayer.style.zIndex = projection < 0 ? '1' : '5';
  flap.style.filter = `brightness(${0.82 + 0.18 * Math.abs(projection)})`;
  seal.style.opacity = 1 - released;
  seal.style.visibility = released === 1 ? 'hidden' : 'visible';
  seal.setAttribute('transform', `translate(260 224) scale(${1 - .08 * released}) translate(-260 -224)`);
  const w = envelopeWrap.offsetWidth;
  const h = stage.clientHeight;
  const viewportWidth = stage.clientWidth;
  const pocketY = h / 2 - .076 * w + .10 * w * extracted;
  const envelopeY = mix(pocketY, h * .92 + .17 * w, expanded);
  for (const layer of [envelopeWrap, front, flapLayer]) layer.style.top = `${envelopeY}px`;
  const hingeY = pocketY - 87 / 520 * w;
  const paperY = hingeY + mix(.235, -.235, extracted) * w;
  const portrait = viewportWidth <= 600 && h > viewportWidth;
  letterDialog.style.top = `${mix(paperY, h * (portrait ? .46 : .45), expanded)}px`;
  // The folded note nearly fills the pocket; its reading size grows only modestly.
  const paperWidth = mix(w * .76, Math.min(650, viewportWidth * .90, w * .98), expanded);
  const paperHeight = mix(w * .42, Math.min(650, h * .74, w * .86), expanded);
  letterDialog.style.width = `${paperWidth}px`;
  letterDialog.style.height = `${paperHeight}px`;
  letterDialog.style.setProperty('--paper-radius', `${mix(5, 10, expanded)}px`);
  letterDialog.style.setProperty('--paper-inner-radius', `${mix(2, 5, expanded)}px`);
  letterDialog.style.setProperty('--paper-inset', `${paperWidth * .03}px`);
  letterDialog.style.setProperty('--paper-shadow-y', `${mix(2, 12, expanded)}px`);
  letterDialog.style.setProperty('--paper-shadow-blur', `${mix(5, 30, expanded)}px`);
}
function play(target) {
  if (motion.matches) { render(target); return Promise.resolve(); }
  const from = position;
  const duration = Math.abs(target - from) * TIMING.total * (target === 0 ? .82 : 1);
  return new Promise(resolve => {
    let start;
    function tick(now) {
      start ??= now;
      const t = clamp((now - start) / duration);
      render(mix(from, target, t));
      if (t < 1) requestAnimationFrame(tick); else resolve();
    }
    requestAnimationFrame(tick);
  });
}
window.addEventListener('resize', () => render(position));
render(0);
function createParticles() {
  const symbols = ['♥', '♡', '✦', '✧', '•'];
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < CONFIG.particles; i++) {
    const item = document.createElement('span');
    item.className = 'particle';
    item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const values = { x: `${Math.random()*100}%`, size: `${9+Math.random()*22}px`, duration: `${13+Math.random()*18}s`, delay: `${-Math.random()*26}s`, drift: `${-95+Math.random()*190}px`, r: `${-35+Math.random()*70}deg`, alpha: .2+Math.random()*.46 };
    for (const [key, value] of Object.entries(values)) item.style.setProperty(`--${key}`, value);
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
  await play(1);
  app.classList.add('is-reading'); letterDialog.inert = false; state = 'reading';
  typeMessage(); closeLetter.focus({preventScroll:true});
}
async function closeFullLetter() {
  if (state !== 'reading') return;
  state = 'closing'; stopTyping(); letterDialog.inert = true;
  app.classList.remove('is-reading'); typedText.textContent = '';
  await play(0);
  state = 'closed'; envelopeButton.disabled = false; envelopeButton.focus({preventScroll:true});
}
envelopeButton.addEventListener('click', openEnvelope);
closeLetter.addEventListener('click', closeFullLetter);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeFullLetter(); });
createParticles();
