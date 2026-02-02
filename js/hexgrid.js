const canvas = document.getElementById("hex-canvas");
const ctx = canvas.getContext("2d");

/* ================= RESIZE ================= */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  hexState.clear(); // ← FIX: prevent infinite Map growth
}
window.addEventListener("resize", resize);

/* ================= STATE ================= */
const hexState = new Map();
resize();

/* ================= GEOMETRY (LOCKED) ================= */
const R = 28;
const GAP = 0.86;
const LINE = 1.2;

const DX = Math.sqrt(3) * R;
const DY = 1.5 * R;

/* ================= COLORS ================= */
const DARK = [60, 60, 60];
const RED  = [180, 20, 35];

/* ================= RANDOM ANIMATION ================= */
const CHANGE_RATE = 0.2;   // how often target changes
const LERP_SPEED  = 0.04;    // smoothness

/* ================= MOUSE RIPPLE ================= */
let mouseX = -9999;
let mouseY = -9999;

const RIPPLE_RADIUS = 180;
const RIPPLE_POWER  = 0.6;

/* ================= EVENTS ================= */
window.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener("mouseleave", () => {
  mouseX = -9999;
  mouseY = -9999;
});

/* ================= UTILS ================= */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = v => Math.max(0, Math.min(1, v));

function colorMix(v) {
  return `rgba(
    ${lerp(DARK[0], RED[0], v)},
    ${lerp(DARK[1], RED[1], v)},
    ${lerp(DARK[2], RED[2], v)},
    ${0.25 + v * 0.45}
  )`;
}

/* ================= DRAW HEX ================= */
function drawHex(cx, cy, intensity) {
  const r = R * GAP;
  ctx.strokeStyle = colorMix(intensity);
  ctx.beginPath();

  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + i * Math.PI / 3;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.closePath();
  ctx.stroke();
}

/* ================= MAIN LOOP ================= */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = LINE;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const cols = canvas.width / DX + 2;
  const rows = canvas.height / DY + 2;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {

      const x = col * DX + (row % 2 ? DX / 2 : 0);
      const y = row * DY;
      const key = `${col},${row}`;

      if (!hexState.has(key)) {
        hexState.set(key, {
          value: Math.random(),
          target: Math.random()
        });
      }

      const h = hexState.get(key);

      if (Math.random() < CHANGE_RATE) {
        h.target = Math.random();
      }

      h.value = lerp(h.value, h.target, LERP_SPEED);

      /* ===== MOUSE RIPPLE ===== */
      const dxm = x - mouseX;
      const dym = y - mouseY;
      const dist = Math.sqrt(dxm * dxm + dym * dym);

      let ripple = 0;
      if (dist < RIPPLE_RADIUS) {
        ripple = (1 - dist / RIPPLE_RADIUS) * RIPPLE_POWER;
      }

      drawHex(x, y, clamp(h.value + ripple));
    }
  }

  requestAnimationFrame(draw);
}

draw();
