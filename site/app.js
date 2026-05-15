// ==========================================
// China 2026 — App
// ==========================================

const DATA_URL = "data.json";

// ---- Link type icons (Lucide) ----
const LINK_META = {
  maps:       { icon: "map", label: "Maps" },
  instagram:  { icon: "camera", label: "Instagram" },
  website:    { icon: "globe", label: "Website" },
  menu:       { icon: "clipboard-list", label: "Menu" },
  booking:    { icon: "ticket", label: "Book" },
  youtube:    { icon: "play", label: "YouTube" },
  dianping:   { icon: "star", label: "Dianping" },
};

function linkMeta(type) {
  return LINK_META[type] || { icon: "link", label: type };
}

function icon(name, size) {
  return `<i data-lucide="${name}" style="width:${size||16}px;height:${size||16}px;"></i>`;
}

// ---- State ----
let data = null;
let currentCity = "all";
let currentView = "ideas";

// ---- Init ----
async function init() {
  setupNavigation();

  try {
    const res = await fetch(DATA_URL);
    data = await res.json();
  } catch (e) {
    console.error("Failed to load data:", e);
    return;
  }
  renderCityFilters();
  renderIdeas();
  renderLogistics();
  lucide.createIcons();
}

// ---- Navigation ----
function setupNavigation() {
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("drawer-overlay");

  // Set initial hamburger icon
  hamburger.innerHTML = icon("menu", 22);

  function open() {
    hamburger.classList.add("open");
    drawer.classList.add("open");
    overlay.classList.add("open");
    hamburger.innerHTML = icon("x", 22);
    lucide.createIcons();
  }
  function close() {
    hamburger.classList.remove("open");
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    hamburger.innerHTML = icon("menu", 22);
    lucide.createIcons();
  }

  hamburger.addEventListener("click", () => {
    hamburger.classList.contains("open") ? close() : open();
  });
  overlay.addEventListener("click", close);

  document.querySelectorAll(".drawer-link").forEach(link => {
    link.addEventListener("click", () => {
      const view = link.dataset.view;
      switchView(view);
      close();
    });
  });
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${view}`).classList.add("active");
  document.querySelectorAll(".drawer-link").forEach(l => {
    l.classList.toggle("active", l.dataset.view === view);
  });
  const filters = document.getElementById("city-filters");
  filters.style.display = view === "ideas" ? "flex" : "none";
}

// ---- City filter pills ----
function renderCityFilters() {
  const container = document.getElementById("city-filters");
  // Show unique city names (merge shanghai and shanghai-2)
  const seen = new Set();
  data.cities.forEach(city => {
    const baseName = city.id.replace(/-\\d+$/, "");
    if (seen.has(baseName)) return;
    seen.add(baseName);
    const btn = document.createElement("button");
    btn.className = "city-pill";
    btn.dataset.city = baseName;
    btn.textContent = city.name;
    btn.addEventListener("click", () => {
      currentCity = baseName;
      document.querySelectorAll(".city-pill").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      renderIdeas();
    });
    container.appendChild(btn);
  });

  // "All" button
  const allBtn = container.querySelector('[data-city="all"]');
  allBtn.addEventListener("click", () => {
    currentCity = "all";
    document.querySelectorAll(".city-pill").forEach(p => p.classList.remove("active"));
    allBtn.classList.add("active");
    renderIdeas();
  });
}

// ---- Idea cards ----
function renderIdeas() {
  const feed = document.getElementById("idea-feed");
  feed.innerHTML = "";

  // Filter: shanghai matches both shanghai and shanghai-2 ideas
  const filtered = currentCity === "all"
    ? data.ideas
    : data.ideas.filter(i => {
        const base = i.city.replace(/-\\d+$/, "");
        return base === currentCity;
      });

  if (filtered.length === 0) {
    const cityObj = currentCity === "all" ? null : data.cities.find(c => c.id.replace(/-\\d+$/, "") === currentCity);
    const cityName = cityObj ? cityObj.name : currentCity;
    feed.innerHTML = `
      <div class="empty-state">
        <h3>No ideas yet</h3>
        <p>Nothing saved for ${currentCity === "all" ? "this trip" : cityName}. Ideas will show up here once added.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(idea => {
    const card = document.createElement("div");
    card.className = "idea-card";

    const imgHtml = idea.photo
      ? `<img class="idea-card-img" src="images/${escapeHtml(idea.photo)}" alt="${escapeHtml(idea.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"><div class="idea-card-img" style="display:none;align-items:center;justify-content:center;background:var(--bg-pill);">${icon("image", 32)}</div>`
      : `<div class="idea-card-img" style="display:flex;align-items:center;justify-content:center;background:var(--bg-pill);">${icon("image", 32)}</div>`;

    const noteHtml = idea.note
      ? `<p class="idea-card-note">${escapeHtml(idea.note)}</p>`
      : "";

    const linksHtml = (idea.links || []).length
      ? `<div class="idea-card-links">${idea.links.map(l => {
          const meta = linkMeta(l.type);
          return `<a class="idea-link-pill" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${icon(meta.icon, 14)} ${meta.label}</a>`;
        }).join("")}</div>`
      : "";

    card.innerHTML = `
      ${imgHtml}
      <div class="idea-card-body">
        <h3 class="idea-card-title">${escapeHtml(idea.title)}</h3>
        ${noteHtml}
        ${linksHtml}
      </div>
    `;
    feed.appendChild(card);
  });

  lucide.createIcons();
}

// ---- Logistics (day-by-day) ----
function renderLogistics() {
  const container = document.getElementById("logistics-content");
  container.innerHTML = "";

  const start = new Date("2026-05-18");
  const end = new Date("2026-06-01");
  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  days.forEach(day => {
    const dateStr = day.toISOString().slice(0, 10);
    const dayName = dayNames[day.getUTCDay()];
    const monthName = monthNames[day.getUTCMonth()];

    const entries = [];

    // Outbound flight: May 18
    if (dateStr === "2026-05-18" && data.flights.outbound) {
      entries.push({
        icon: "plane",
        title: `Fly: ${data.flights.outbound.label}`,
        detail: `${data.flights.outbound.segments[0].depart} — arrives ${data.flights.outbound.arriveDate} at ${data.flights.outbound.segments[data.flights.outbound.segments.length-1].arrive}`,
        type: "flight",
        flight: data.flights.outbound,
      });
    }

    // Return flight: Jun 1
    if (dateStr === "2026-06-01" && data.flights.return) {
      entries.push({
        icon: "plane",
        title: `Fly home: ${data.flights.return.label}`,
        detail: `${data.flights.return.segments[0].depart} — arrives ${data.flights.return.segments[data.flights.return.segments.length-1].arrive}`,
        type: "flight",
        flight: data.flights.return,
      });
    }

    // Trains
    const dayTrains = (data.trains || []).filter(t => t.date === dateStr);
    dayTrains.forEach(train => {
      const timeStr = train.depart ? `Departs ${train.depart}` : "Time TBC";
      const arriveStr = train.arrive ? `Arrives ${train.arrive}` : "";
      entries.push({
        icon: "train-front",
        title: `${train.from} → ${train.to}`,
        detail: [timeStr, arriveStr, train.train ? `Train ${train.train}` : "", train.seat ? `Seat ${train.seat}` : ""].filter(Boolean).join(" · "),
        past: train.status === "completed",
      });
    });

    // Hotels
    const hotelsIn = (data.hotels || []).filter(h => h.checkin === dateStr);
    const hotelsOut = (data.hotels || []).filter(h => h.checkout === dateStr);

    hotelsIn.forEach(h => {
      const city = data.cities.find(c => c.id === h.city || h.city.startsWith(c.id));
      entries.push({
        icon: "building",
        title: `Check in: ${h.name}`,
        detail: `${city ? city.name : h.city} · until ${formatDate(h.checkout)}${h.link ? ` · <a href="${h.link}" target="_blank" rel="noopener" style="color:var(--accent)">View</a>` : ""}`,
      });
    });

    hotelsOut.forEach(h => {
      entries.push({
        icon: "building",
        title: `Check out: ${h.name}`,
        detail: h.city,
      });
    });

    // Travel days
    const travel = (data.travelDays || []).find(t => t.date === dateStr);
    if (travel) {
      entries.push({
        icon: "train-front",
        title: travel.label,
        detail: travel.detail,
      });
    }

    // City context (where are we sleeping tonight?)
    const cityId = findCityForDay(dateStr);
    if (cityId) {
      const city = data.cities.find(c => c.id === cityId);
      if (city && entries.length === 0) {
        entries.push({
          icon: "map-pin",
          title: `${city.name}${city.nameZh ? ` ${city.nameZh}` : ""}`,
          detail: city.vibe || `Staying in ${city.name}`,
        });
      }
    }

    if (entries.length === 0) return;

    const group = document.createElement("div");
    group.className = "day-group";

    group.innerHTML = `
      <div class="day-group-header">
        <span class="day-group-date">${monthName} ${day.getUTCDate()}</span>
        <span class="day-group-day">${dayName}</span>
      </div>
      <div class="day-group-body">
        ${entries.map(e => `
          <div class="log-entry ${e.past ? 'past' : ''}">
            <div class="log-entry-icon">${icon(e.icon, 18)}</div>
            <div class="log-entry-info">
              <div class="log-entry-title">${e.title}</div>
              ${e.detail ? `<div class="log-entry-detail">${e.detail}</div>` : ""}
              ${e.type === "flight" ? renderFlightVisual(e.flight) : ""}
            </div>
          </div>
        `).join("")}
      </div>
    `;
    container.appendChild(group);
  });

  // Emergency section
  container.appendChild(renderEmergency());
  lucide.createIcons();
}

function renderFlightVisual(flight) {
  if (!flight || !flight.segments) return "";

  const segmentsHtml = flight.segments.map((seg, i) => `
    <div class="flight-segment">
      <div class="flight-segment-icon">${icon("plane", 18)}</div>
      <div class="flight-segment-route">
        <span class="code">${escapeHtml(seg.from)}</span>
        <span class="arrow">→</span>
        <span class="code">${escapeHtml(seg.to)}</span>
        <span class="time">${escapeHtml(seg.depart)} – ${escapeHtml(seg.arrive)}${seg.arriveNextDay ? ' (+1)' : ''}</span>
      </div>
      <div class="flight-segment-meta">
        ${escapeHtml(seg.flight)}<br>${escapeHtml(seg.seat)}<br>${escapeHtml(seg.duration)}
      </div>
    </div>
    ${flight.layovers && flight.layovers[i] ? `
      <div class="flight-layover">
        ${icon("clock", 14)} ${escapeHtml(flight.layovers[i].duration)} layover in ${escapeHtml(flight.layovers[i].at)}
      </div>
    ` : ""}
  `).join("");

  return `
    <div class="flight-visual">
      <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;">
        ${escapeHtml(flight.label)} · ${escapeHtml(flight.duration)}
      </div>
      ${segmentsHtml}
    </div>
  `;
}

function renderEmergency() {
  const em = data.emergency || {};
  return `
    <div class="section-header">Emergency</div>
    <div class="emergency-grid">
      ${em.usEmbassy ? `
        <div class="emergency-card">
          <div class="emergency-card-label">US Embassy</div>
          <div class="emergency-card-value">${escapeHtml(em.usEmbassy.phone)}</div>
        </div>
      ` : ""}
      <div class="emergency-card">
        <div class="emergency-card-label">Police</div>
        <div class="emergency-card-value">${escapeHtml(em.police || "110")}</div>
      </div>
      <div class="emergency-card">
        <div class="emergency-card-label">Ambulance</div>
        <div class="emergency-card-value">${escapeHtml(em.ambulance || "120")}</div>
      </div>
      <div class="emergency-card">
        <div class="emergency-card-label">Fire</div>
        <div class="emergency-card-value">${escapeHtml(em.fire || "119")}</div>
      </div>
    </div>
  `;
}

function findCityForDay(dateStr) {
  // Each day maps to the city we're sleeping in that night
  const mapping = {
    "2026-05-18": "shanghai",
    "2026-05-19": "shanghai",
    "2026-05-20": "shanghai",
    "2026-05-21": "zhangjiajie",   // travel + arrive, sleep here
    "2026-05-22": "zhangjiajie",
    "2026-05-23": "zhangjiajie",
    "2026-05-24": "chongqing",     // travel + arrive, sleep here
    "2026-05-25": "chongqing",
    "2026-05-26": "xian",          // travel + arrive, sleep here
    "2026-05-27": "xian",
    "2026-05-28": "beijing",       // travel + arrive, sleep here
    "2026-05-29": "beijing",
    "2026-05-30": "shanghai-2",    // travel + arrive, sleep here
    "2026-05-31": "shanghai-2",
  };
  return mapping[dateStr] || null;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

// ---- Utilities ----
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---- Service Worker ----
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

// ---- Boot ----
init();
