/* =====================================================
   alerts.js
   - Password popup open / close
   - Copy buttons (bulletproof copy)
   - Click sound
   - Green success feedback
   - ESC to close
   - Click outside to close
   - Draggable popup
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ================= ELEMENTS ================= */
  const popup = document.getElementById("password-popup");
  const popupBox = popup?.querySelector(".popup-box");

  const openBtn = document.getElementById("show-password");
  const closeBtn = document.getElementById("close-password");

  const clickSound = document.getElementById("click-sound");

  /* ================= OPEN POPUP ================= */
  if (openBtn && popup) {
    openBtn.addEventListener("click", e => {
      e.preventDefault();
      popup.classList.add("active");
    });
  }

  /* ================= CLOSE POPUP (X) ================= */
  if (closeBtn && popup) {
    closeBtn.addEventListener("click", () => {
      popup.classList.remove("active");
    });
  }

  /* ================= CLOSE ON ESC ================= */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && popup?.classList.contains("active")) {
      popup.classList.remove("active");
    }
  });

  /* ================= CLICK OUTSIDE TO CLOSE ================= */
  if (popup) {
    popup.addEventListener("mousedown", e => {
      if (e.target === popup) {
        popup.classList.remove("active");
      }
    });
  }

  /* ================= COPY BUTTONS ================= */
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const text = btn.dataset.copy;
      if (!text) return;

      /* ---- BULLETPROOF COPY (works for long text) ---- */
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);

      ta.focus();
      ta.select();

      const copied = document.execCommand("copy");
      document.body.removeChild(ta);

      if (!copied) return;

      /* ---- CLICK SOUND ---- */
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.volume = 0.6;
        clickSound.play().catch(() => {});
      }

      /* ---- SUCCESS FEEDBACK ---- */
      const original = btn.textContent;
      btn.textContent = "Kopyalandı";
      btn.classList.add("success");

      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("success");
      }, 1200);
    });
  });

  /* ================= DRAGGABLE POPUP ================= */
  if (!popupBox) return;

  let dragging = false;
  let startX = 0, startY = 0;
  let boxX = 0, boxY = 0;

  popupBox.addEventListener("mousedown", e => {
    if (e.target.closest("button")) return;

    dragging = true;
    popupBox.classList.add("dragging");

    const rect = popupBox.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    boxX = rect.left;
    boxY = rect.top;
  });

  document.addEventListener("mousemove", e => {
    if (!dragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    popupBox.style.position = "fixed";
    popupBox.style.left = boxX + dx + "px";
    popupBox.style.top  = boxY + dy + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
    popupBox.classList.remove("dragging");
  });

});
