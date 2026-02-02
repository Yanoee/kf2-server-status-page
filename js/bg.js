const bg = document.getElementById("bg-image");
if (!bg) {
  console.warn("bg-image not found");
} else {

  /* ================= CONFIG ================= */
  const IMAGES = ["bg_1","bg_2","bg_3","bg_4","bg_5","bg_6","bg_7","bg_8","bg_9"];

  const PARALLAX_MAX = 12;     // px
  const SMOOTHING = 0.06;
  const DOF_BLUR_BASE = 2;
  const DOF_BLUR_RANGE = 1.5;

  /* ================= PICK BG ================= */
  const pick = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  bg.style.backgroundImage = `url(/img/${pick}.webp)`;
  bg.style.backgroundSize = "cover";
  bg.style.backgroundPosition = "center";

  /* ================= STATE ================= */
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  /* ================= EVENTS ================= */
  window.addEventListener("mousemove", e => {
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;

    targetX = cx * PARALLAX_MAX;
    targetY = cy * PARALLAX_MAX;
  });

  /* ================= LOOP ================= */
  function animate() {
    currentX += (targetX - currentX) * SMOOTHING;
    currentY += (targetY - currentY) * SMOOTHING;

    const blur =
      DOF_BLUR_BASE +
      (Math.abs(currentX) + Math.abs(currentY)) / PARALLAX_MAX * DOF_BLUR_RANGE;

    bg.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    bg.style.filter = `brightness(0.32) blur(${blur}px)`;

    requestAnimationFrame(animate);
  }

  animate();
}
