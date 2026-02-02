const API_URL = "/api/status.php";
const REFRESH_MS = 5000;

/* ================= DOM HELPERS ================= */
const $ = id => document.getElementById(id);
const setText = (id, value) => {
  const el = $(id);
  if (el) el.textContent = value;
};

/* ================= STATUS BADGE ================= */
function setStatus(isOnline, error = false) {
  const badge = document.getElementById("server-status");
  if (!badge) return;

  badge.classList.remove("online", "offline");

  if (isOnline) {
    badge.textContent = "Aktif";
    badge.classList.add("online");
  } else {
    badge.textContent = error ? "Hata" : "Kapali";
    badge.classList.add("offline");
  }
}

/* ================= FETCH STATUS ================= */
async function fetchStatus() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const data = await res.json();

    if (!data || data.online !== true) {
      showOffline();
      return;
    }

    showOnline(data);
  } catch (err) {
    console.error("STATUS FETCH ERROR:", err);
    showOffline();
  }
}

/* ================= ONLINE ================= */
function showOnline(d) {
  setStatus(true);

  // HEADER
  setText("server-name", d.name || "--");

  // CURRENT GAME
  setText("cg-name", d.name || "--");
  setText("cg-type", d.mode || "Survival");
  setText("cg-map", d.map || "--");

  // RULES (static, honest)
  setText("r-players", `${d.players}/${d.max}`);
  setText("r-min", "1");
  setText("r-spec", "Acik");
  setText("r-mapvote", "Acik");
  setText("r-kickvote", "Acik");

  renderPlayers(d.playerlist || []);
}

/* ================= OFFLINE ================= */
function showOffline() {
  setStatus(false);

  setText("server-name", "--");
  setText("cg-name", "--");
  setText("cg-type", "--");
  setText("cg-map", "--");

  setText("r-players", "--/--");
  setText("r-min", "--");
  setText("r-spec", "--");
  setText("r-mapvote", "--");
  setText("r-kickvote", "--");

  renderPlayers([]);
}

/* ================= PLAYERS TABLE ================= */
function renderPlayers(list) {
  const body = $("players-body");
  if (!body) return;

  body.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="3" class="no-players">Oyuncu yok</td>`;
    body.appendChild(row);
    return;
  }

  list.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.Name || "-"}</td>
      <td>${typeof p.Kills === "number" ? p.Kills : "--"}</td>
      <td>${p.Time || "00:00"}</td>
    `;
    body.appendChild(row);
  });
}

/* ================= START ================= */
fetchStatus();
setInterval(fetchStatus, REFRESH_MS);
