// ============================================
// EDIT THIS ARRAY TO UPDATE YOUR TRIP
//
// - "notes"  : freeform ideas for each city (food, sights, walks)
// - "links"  : array of { label, url } for blog posts, bookings, maps
// - "hotel"  : optional hotel name
// - Add or remove stops as needed
// ============================================
const tripStops = [
  {
    type: "stay",
    city: "Shanghai",
    dates: "May 18 – May 20",
    nights: 3,
    lat: 31.2304,
    lng: 121.4737,
    notes: [
      "Walk the Bund at night for the skyline views",
      "Try xiaolongbao at Jia Jia Tang Bao",
      "Explore the French Concession on foot"
    ],
    links: [
      { label: "Bund Guide", url: "https://www.lonelyplanet.com/china/shanghai/the-bund" }
    ]
  },
  {
    type: "travel",
    date: "May 21",
    label: "Leave Shanghai → Zhangjiajie"
  },
  {
    type: "stay",
    city: "Zhangjiajie",
    dates: "May 22 – May 23",
    nights: 2,
    lat: 29.1171,
    lng: 110.4792,
    notes: [
      "Avatar Mountains (Yuanjiajie)",
      "Glass bridge at Zhangjiajie Grand Canyon"
    ],
    links: []
  },
  {
    type: "travel",
    date: "May 24",
    label: "Leave Zhangjiajie → Chongqing"
  },
  {
    type: "stay",
    city: "Chongqing",
    dates: "May 25",
    nights: 1,
    hotel: "Ascott Raffles City",
    lat: 29.5630,
    lng: 106.5516,
    notes: [
      "Hot pot dinner — try a local place near Jiefangbei",
      "Hongya Cave at night"
    ],
    links: []
  },
  {
    type: "travel",
    date: "May 26",
    label: "Leave Chongqing → Xi'an"
  },
  {
    type: "stay",
    city: "Xi'an",
    dates: "May 27",
    nights: 1,
    lat: 34.3416,
    lng: 108.9398,
    notes: [
      "Terracotta Warriors (early morning to beat crowds)",
      "Muslim Quarter for street food"
    ],
    links: []
  },
  {
    type: "travel",
    date: "May 28",
    label: "Leave Xi'an → Beijing"
  },
  {
    type: "stay",
    city: "Beijing",
    dates: "May 29 – May 30",
    nights: 2,
    lat: 39.9042,
    lng: 116.4074,
    notes: [
      "Great Wall — Mutianyu section (less crowded than Badaling)",
      "Temple of Heaven park in the morning"
    ],
    links: []
  },
  {
    type: "stay",
    city: "Shanghai",
    dates: "May 31",
    nights: 1,
    lat: 31.2304,
    lng: 121.4737,
    notes: [
      "Last-minute souvenir shopping",
      "Revisit a favourite spot from the first stop"
    ],
    links: []
  },
  {
    type: "travel",
    date: "June 1",
    label: "Fly home"
  }
];

// ============================================
// RENDERING LOGIC — no need to edit below
// ============================================
const timeline = document.getElementById("timeline");

tripStops.forEach((stop, index) => {
  const item = document.createElement("div");
  item.className = `timeline-item timeline-${stop.type}`;

  if (stop.type === "travel") {
    item.innerHTML = `
      <div class="travel-label">
        <span class="travel-date">${stop.date}</span>
        <span class="travel-text">${stop.label}</span>
      </div>
    `;
  } else {
    const metaParts = [`${stop.nights} night${stop.nights > 1 ? "s" : ""}`];
    if (stop.hotel) metaParts.push(stop.hotel);

    const notesHtml = stop.notes && stop.notes.length
      ? `<ul class="notes-list">${stop.notes.map(n => `<li>${escapeHtml(n)}</li>`).join("")}</ul>`
      : `<p class="empty-state">No notes yet — add them in <code>app.js</code>.</p>`;

    const linksHtml = stop.links && stop.links.length
      ? `<div class="links">${stop.links.map(l =>
          `<a class="link-pill" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`
        ).join("")}</div>`
      : "";

    item.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="city-name">${escapeHtml(stop.city)}</div>
            <div class="city-dates">${escapeHtml(stop.dates)}</div>
          </div>
          <div class="meta">${escapeHtml(metaParts.join(" · "))}</div>
        </div>
        ${notesHtml}
        ${linksHtml}
        <div class="map" id="map-${index}"></div>
      </div>
    `;
  }

  timeline.appendChild(item);
});

// Initialize Leaflet maps for each stay
tripStops.forEach((stop, index) => {
  if (stop.type !== "stay") return;
  const container = document.getElementById(`map-${index}`);
  if (!container) return;

  const map = L.map(container, { scrollWheelZoom: false }).setView([stop.lat, stop.lng], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.marker([stop.lat, stop.lng]).addTo(map);
});

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
