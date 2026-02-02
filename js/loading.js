const loader = document.getElementById("loading-screen");
const counter = document.getElementById("load-count");
const message = document.getElementById("loading-message");
const continueBtn = document.getElementById("continue-btn");

let lastMessageChange = 0;
const MESSAGE_INTERVAL = 1200;

const bgMusic = document.getElementById("bg-music");

const tracks = [
  "/audio/track1.mp3",
  "/audio/track2.mp3",
  "/audio/track3.mp3"
];

/* PRELOAD ALL TRACKS */
tracks.forEach(src => {
  const a = new Audio();
  a.src = src;
  a.preload = "auto";
});

/* ================= LOADER ================= */

// If already loaded once → hide smoothly but DO NOT break script
if (sessionStorage.getItem("loadedOnce")) {
  loader.classList.add("hidden");
  setTimeout(() => loader.remove(), 300);
} else {
  sessionStorage.setItem("loadedOnce", "1");

  const total = 30;
  let current = 1;

  const messages = [
    "Animasyon yukleniyor",
    "Fotograflar yukleniyor",
    "Site yukleniyor"
  ];

  function step() {
    counter.textContent = current;

    const now = Date.now();
    if (now - lastMessageChange > MESSAGE_INTERVAL) {
      message.textContent =
        messages[Math.floor(Math.random() * messages.length)];
      lastMessageChange = now;
    }

    if (current < total) {
      current++;
      setTimeout(step, 60 + Math.random() * 200);
    } else {
      const spinner = loader.querySelector(".spinner");
      const tick = loader.querySelector(".done-tick");

      if (spinner) spinner.style.display = "none";
      if (tick) tick.classList.add("show");

      continueBtn.classList.add("enabled");
      continueBtn.disabled = false;
      message.textContent = "Hazir";
    }
  }

  step();
}

/* ================= USER CLICK ================= */
continueBtn.addEventListener("click", () => {
  const pick = tracks[Math.floor(Math.random() * tracks.length)];

  bgMusic.src = pick;
  bgMusic.muted = false;
  bgMusic.volume = 0.35;
  bgMusic.play().catch(() => {});

  loader.classList.add("hidden");
  setTimeout(() => loader.remove(), 800);
});
