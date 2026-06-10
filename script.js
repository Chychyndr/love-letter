const CONFIG = {
  message: "You are my favorite place to come back to",
  typingSpeed: 54,
  particles: 52,
  letterDelay: 1050,
};

const app = document.querySelector("#app");
const particles = document.querySelector("#particles");
const envelopeButton = document.querySelector("#envelopeButton");
const letterDialog = document.querySelector("#letterDialog");
const closeLetter = document.querySelector("#closeLetter");
const typedText = document.querySelector("#typedText");
const cursor = document.querySelector("#cursor");

let isOpen = false;
let isAnimating = false;
let typingTimer = null;
let showLetterTimer = null;

function createParticles() {
  const symbols = ["♥", "♡", "✦", "✧", "•"];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < CONFIG.particles; i += 1) {
    const item = document.createElement("span");
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    item.className = "particle";
    item.textContent = symbol;
    item.style.setProperty("--x", `${Math.random() * 100}%`);
    item.style.setProperty("--size", `${9 + Math.random() * 22}px`);
    item.style.setProperty("--duration", `${13 + Math.random() * 18}s`);
    item.style.setProperty("--delay", `${Math.random() * -26}s`);
    item.style.setProperty("--drift", `${-95 + Math.random() * 190}px`);
    item.style.setProperty("--r", `${-35 + Math.random() * 70}deg`);
    item.style.setProperty("--alpha", `${0.2 + Math.random() * 0.46}`);

    fragment.appendChild(item);
  }

  particles.appendChild(fragment);
}

function stopTyping() {
  window.clearTimeout(typingTimer);
  typingTimer = null;
  cursor.classList.remove("is-visible");
}

function typeMessage() {
  stopTyping();
  typedText.textContent = "";
  cursor.classList.add("is-visible");

  let index = 0;

  const write = () => {
    typedText.textContent = CONFIG.message.slice(0, index);
    index += 1;

    if (index <= CONFIG.message.length) {
      const currentChar = CONFIG.message[index - 2] || "";
      const pause = currentChar === " " ? CONFIG.typingSpeed * 0.55 : CONFIG.typingSpeed;
      typingTimer = window.setTimeout(write, pause);
      return;
    }

    typingTimer = window.setTimeout(() => cursor.classList.remove("is-visible"), 850);
  };

  write();
}

function openEnvelope() {
  if (isOpen || isAnimating) return;

  isOpen = true;
  isAnimating = true;
  envelopeButton.disabled = true;
  app.classList.add("is-open");
  envelopeButton.setAttribute("aria-label", "Envelope opened");

  showLetterTimer = window.setTimeout(() => {
    app.classList.add("is-reading");
    typeMessage();
    isAnimating = false;
    closeLetter.focus({ preventScroll: true });
  }, CONFIG.letterDelay);
}

function closeFullLetter() {
  if (!isOpen || isAnimating) return;

  isAnimating = true;
  stopTyping();
  window.clearTimeout(showLetterTimer);
  typedText.textContent = "";
  app.classList.add("is-closing");
  app.classList.remove("is-reading");

  window.setTimeout(() => {
    app.classList.remove("is-open", "is-closing");
    envelopeButton.disabled = false;
    envelopeButton.setAttribute("aria-label", "Open the envelope");
    isOpen = false;
    isAnimating = false;
    envelopeButton.focus({ preventScroll: true });
  }, 720);
}

envelopeButton.addEventListener("click", openEnvelope);

closeLetter.addEventListener("click", (event) => {
  event.stopPropagation();
  closeFullLetter();
});

letterDialog.addEventListener("click", (event) => {
  if (event.target === letterDialog) {
    closeFullLetter();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeFullLetter();
  }
});

createParticles();
