// ==========================================
// China 2026 — App
// ==========================================

const DATA_URL = "data.json";

// ---- Link type icons & labels ----
const LINK_META = {
  maps:       { icon: "🗺️", label: "Maps" },
  instagram:  { icon: "📸", label: "Instagram" },
  website:    { icon: "🌐", label: "Website" },
  menu:       { icon: "📋", label: "Menu" },
  booking:    { icon: "🎫", label: "Book" },
  youtube:    { icon: "▶️", label: "YouTube" },
  dianping:   { icon: "⭐", label: "Dianping" },
};

function linkMeta(type) {
  return LINK_META[type] || { icon: "🔗", label: type };
}

// ---- State ----
let data = null;
let currentCity = "all";
let currentView = "ideas";

// ---- Init ----
async function init() {
  // Navigation must work regardless of data loading
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
}

// ---- Navigation ----
function setupNavigation() {
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("drawer-overlay");

  function open() {
    hamburger.classList.add("open");
    drawer.classList.add("open");
    overlay.classList.add("open");
  }
  function close() {
    hamburger.classList.remove("open");
    drawer.classList.remove("open");
    overlay.classList.remove("open");
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

  // Show/hide city filters
  const filters = document.getElementById("city-filters");
  filters.style.display = view === "ideas" ? "flex" : "none";
}

// ---- City filter pills ----
function renderCityFilters() {
  const container = document.getElementById("city-filters");
  data.cities.forEach(city => {
    const btn = document.createElement("button");
    btn.className = "city-pill";
    btn.dataset.city = city.id;
    btn.textContent = city.name;
    btn.addEventListener("click", () => {
      currentCity = city.id;
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

  const filtered = currentCity === "all"
    ? data.ideas
    : data.ideas.filter(i => i.city === currentCity);

  if (filtered.length === 0) {
    const cityName = currentCity === "all" ? "any city" : data.cities.find(c => c.id === currentCity)?.name || currentCity;
    feed.innerHTML = `
      <div class="empty-state">
        <h3>No ideas yet</h3>
        <p>Nothing saved for ${cityName}. Ideas will show up here once added.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(idea => {
    const card = document.createElement("div");
    card.className = "idea-card";

    const imgHtml = idea.photo
      ? `<img class="idea-card-img" src="images/${escapeHtml(idea.photo)}" alt="${escapeHtml(idea.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"><div class="idea-card-img" style="display:none;align-items:center;justify-content:center;color:var(--text-dim);font-size:2rem;background:var(--bg-pill);">📍</div>`
      : `<div class="idea-card-img" style="display:flex;align-items:center;justify-content:center;color:var(--text-dim);font-size:2rem;background:var(--bg-pill);">📍</div>`;

    const noteHtml = idea.note
      ? `<p class="idea-card-note">${escapeHtml(idea.note)}</p>`
      : "";

    const linksHtml = (idea.links || []).length
      ? `<div class="idea-card-links">${idea.links.map(l => {
          const meta = linkMeta(l.type);
          return `<a class="idea-link-pill" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${meta.icon} ${meta.label}</a>`;
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
}

// ---- Logistics (day-by-day) ----
function renderLogistics() {
  const container = document.getElementById("logistics-content");
  container.innerHTML = "";

  // Build day-by-day structure from May 18 to Jun 1
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

    // Find flights for this day
    // Outbound: May 18
    if (dateStr === "2026-05-18" && data.flights.outbound) {
      entries.push({
        icon: "✈️",
        title: `Fly: ${data.flights.outbound.label}`,
        detail: `${data.flights.outbound.segments[0].depart} — arrives ${data.flights.outbound.arriveDate} at ${data.flights.outbound.segments[data.flights.outbound.segments.length-1].arrive}`,
        type: "flight",
        flight: data.flights.outbound,
      });
    }

    // Return: Jun 1
    if (dateStr === "2026-06-01" && data.flights.return) {
      entries.push({
        icon: "✈️",
        title: `Fly home: ${data.flights.return.label}`,
        detail: `${data.flights.return.segments[0].depart} — arrives ${data.flights.return.segments[data.flights.return.segments.length-1].arrive}`,
        type: "flight",
        flight: data.flights.return,
      });
    }

    // Find trains for this day
    const dayTrains = (data.trains || []).filter(t => t.date === dateStr);
    dayTrains.forEach(train => {
      const timeStr = train.depart ? `Departs ${train.depart}` : "Time TBC";
      const arriveStr = train.arrive ? `Arrives ${train.arrive}` : "";
      entries.push({
        icon: "🚄",
        title: `${train.from} → ${train.to}`,
        detail: [timeStr, arriveStr, train.train ? `Train ${train.train}` : "", train.seat ? `Seat ${train.seat}` : ""].filter(Boolean).join(" · "),
        past: train.status === "completed",
        upcoming: train.status !== "completed",
      });
    });

    // Find hotels checking in/out this day
    const hotelsIn = (data.hotels || []).filter(h => h.checkin === dateStr);
    const hotelsOut = (data.hotels || []).filter(h => h.checkout === dateStr);

    hotelsIn.forEach(h => {
      const city = data.cities.find(c => c.id === h.city);
      entries.push({
        icon: "🏨",
        title: `Check in: ${h.name}`,
        detail: `${city ? city.name : h.city} · until ${formatDate(h.checkout)}${h.link ? ` · <a href="${h.link}" target="_blank" rel="noopener" style="color:var(--accent)">View</a>` : ""}`,
      });
    });

    hotelsOut.forEach(h => {
      entries.push({
        icon: "🏨",
        title: `Check out: ${h.name}`,
        detail: h.city,
      });
    });

    // Find travel days
    const travel = (data.travelDays || []).find(t => t.date === dateStr);
    if (travel) {
      entries.push({
        icon: "🚄",
        title: travel.label,
        detail: travel.detail,
      });
    }

    // City context
    const cityForDay = findCityForDay(dateStr);
    if (cityForDay && entries.length === 0) {
      const cityNights = cityForDay.nights > 1 ? `${cityForDay.nights} nights` : "1 night";
      entries.push({
        icon: "📍",
        title: `${cityForDay.name}${cityForDay.nameZh ? ` ${cityForDay.nameZh}` : ""}`,
        detail: cityForDay.vibe || `Staying in ${cityForDay.name} (${cityNights})`,
      });
    }

    if (entries.length === 0) return;

    const group = document.createElement("div");
    group.className = "day-group";

    const pastClass = day < new Date() ? "past" : "";

    group.innerHTML = `
      <div class="day-group-header">
        <span class="day-group-date">${monthName} ${day.getUTCDate()}</span>
        <span class="day-group-day">${dayName}</span>
      </div>
      <div class="day-group-body">
        ${entries.map(e => `
          <div class="log-entry ${e.past ? 'past' : ''}">
            <div class="log-entry-icon">${e.icon}</div>
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

  // Emergency section at the bottom
  container.appendChild(renderEmergency());
}

function renderFlightVisual(flight) {
  if (!flight || !flight.segments) return "";

  const segmentsHtml = flight.segments.map((seg, i) => `
    <div class="flight-segment">
      <div class="flight-segment-icon">✈️</div>
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
        ⏳ ${escapeHtml(flight.layovers[i].duration)} layover in ${escapeHtml(flight.layovers[i].at)}
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
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">${escapeHtml(em.usEmbassy.address || "")}</div>
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
  // Map date to city based on itinerary
  const mapping = {
    "2026-05-18": "shanghai",
    "2026-05-19": "shanghai",
    "2026-05-20": "shanghai",
    "2026-05-21": null, // travel
    "2026-05-22": "zhangjiajie",
    "2026-05-23": "zhangjiajie",
    "2026-05-24": null, // travel
    "2026-05-25": "chongqing",
    "2026-05-26": null, // travel
    "2026-05-27": "xian",
    "2026-05-28": null, // travel
    "2026-05-29": "beijing",
    "2026-05-30": "beijing",
    "2026-05-31": "shanghai",
  };
  const cityId = mapping[dateStr];
  if (!cityId) return null;
  return data.cities.find(c => c.id === cityId);
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
