// ============================================
// EDIT THIS ARRAY TO UPDATE THE TRIP
//
// Each stop is a "place card" with:
//   - hotel, hotelLink     → where we're crashing
//   - vibe                 → quick sentence on the energy
//   - doNotMiss            → the big hitters
//   - eatDrink             → food & bar ideas
//   - headsUp              → practical stuff (metro, weather, scams, logistics)
//   - links                → extra reading / maps / bookings
// ============================================
const tripStops = [
  {
    type: "stay",
    city: "Shanghai",
    dates: "May 18 – 20",
    nights: 3,
    lat: 31.2304,
    lng: 121.4737,
    hotel: "TBC — near the Bund or French Concession",
    hotelLink: null,
    vibe: "Skyline meets old lanes. Walk everywhere.",
    doNotMiss: [
      "The Bund at night — skyline lit up across the river",
      "French Concession tree-lined streets (Wukang Road, Fuxing Road)",
      "Yu Garden in the morning before the crowds",
      "Rooftop drink with a view — try Flair or Captain"
    ],
    eatDrink: [
      "Xiaolongbao at Jia Jia Tang Bao (cheap, chaotic, perfect)",
      "Lost Heaven on the Bund for Yunnan-style dinner",
      "Beer at The Brew or Boxing Cat if you need a break from tea"
    ],
    headsUp: "Download a VPN before you land. Metro is excellent — get a Shanghai transit card or use Alipay transport QR. Most signs are in English.",
    links: [
      { label: "Shanghai Metro Map", url: "https://www.exploreshanghai.com/metro/" },
      { label: "The Bund guide", url: "https://www.lonelyplanet.com/china/shanghai/the-bund" }
    ]
  },
  {
    type: "travel",
    date: "May 21",
    label: "Leave Shanghai",
    detail: "Fly or train to Zhangjiajie — book this leg soon."
  },
  {
    type: "stay",
    city: "Zhangjiajie",
    dates: "May 22 – 23",
    nights: 2,
    lat: 29.1171,
    lng: 110.4792,
    hotel: "TBC — Wulingyuan district near the park gate",
    hotelLink: null,
    vibe: "Avatar mountains in real life. Legs will hurt.",
    doNotMiss: [
      "Yuanjiajie — the floating pillar mountains (Avatar inspiration)",
      "Tianzi Mountain for sunrise if you're willing to wake up",
      "Zhangjiajie Grand Canyon glass bridge — book ahead",
      "Baofeng Lake boat ride for a calmer afternoon"
    ],
    eatDrink: [
      "Local cured pork and mountain mushrooms",
      "Grab simple noodles near your hotel after a long day in the park"
    ],
    headsUp: "The park is massive and confusing — get a paper map at the gate. Cable cars save time but lines build by 10am. Weather changes fast; bring a light rain layer.",
    links: [
      { label: "Park route planner", url: "https://www.zhangjiajietourism.us/" }
    ]
  },
  {
    type: "travel",
    date: "May 24",
    label: "Leave Zhangjiajie",
    detail: "Train or fly to Chongqing. Evening arrival."
  },
  {
    type: "stay",
    city: "Chongqing",
    dates: "May 25",
    nights: 1,
    lat: 29.5630,
    lng: 106.5516,
    hotel: "Ascott Raffles City",
    hotelLink: "https://www.discoverasr.com/en/ascott-the- residence/ascott-raffles-city-chongqing",
    vibe: "Foggy, vertical, spicy. The city that eats hot pot for breakfast.",
    doNotMiss: [
      "Hongya Cave at night — looks like Spirited Away",
      "Jiefangbei CBD walk — neon, malls, chaos",
      "Dazu Rock Carvings if you want a day-trip (unlikely with one night)"
    ],
    eatDrink: [
      "Hot pot — ask the hotel concierge for a local favourite near Jiefangbei",
      "Xiaomian (Chongqing noodles) for breakfast at any street stall",
      "Try a riverside bar for a cocktail above the Yangtze"
    ],
    headsUp: "This city is built on hills — your legs and maps app will disagree. The metro is great but stations can be 5+ floors underground. Summer heat starts early; expect humid 25–30°C.",
    links: [
      { label: "Ascott Raffles City", url: "https://www.discoverasr.com/en/ascott-the-residence/ascott-raffles-city-chongqing" }
    ]
  },
  {
    type: "travel",
    date: "May 26",
    label: "Leave Chongqing",
    detail: "Morning train or flight to Xi'an."
  },
  {
    type: "stay",
    city: "Xi'an",
    dates: "May 27",
    nights: 1,
    lat: 34.3416,
    lng: 108.9398,
    hotel: "TBC — inside or near the city walls",
    hotelLink: null,
    vibe: "Ancient capital. Terracotta warriors by day, Muslim Quarter by night.",
    doNotMiss: [
      "Terracotta Warriors — go early (opens 8:30). Hire a guide or audio guide.",
      "Muslim Quarter at sunset — street food, lanterns, energy",
      "City wall bike ride (rent a bike on top of the wall)",
      "Giant Wild Goose Pagoda fountain show after dark"
    ],
    eatDrink: [
      "Roujiamo (Chinese hamburger) on the street",
      "Biangbiang noodles — wide, chewy, spicy",
      "Pomegranate juice in the Muslim Quarter"
    ],
    headsUp: "The warriors are ~1hr east of the city. Metro + bus works, or just Didi (Chinese Uber). One night is tight — prioritise warriors in the morning, Muslim Quarter in the evening.",
    links: [
      { label: "Warriors visitor info", url: "https://en.wikipedia.org/wiki/Terracotta_Army" }
    ]
  },
  {
    type: "travel",
    date: "May 28",
    label: "Leave Xi'an",
    detail: "Train to Beijing (fast train ~4.5hrs)."
  },
  {
    type: "stay",
    city: "Beijing",
    dates: "May 29 – 30",
    nights: 2,
    lat: 39.9042,
    lng: 116.4074,
    hotel: "TBC — Dongcheng or Chaoyang district",
    hotelLink: null,
    vibe: "Imperial scale meets hutong charm. Pace yourself.",
    doNotMiss: [
      "Great Wall — Mutianyu section (less packed than Badaling, toboggan down!)",
      "Temple of Heaven park at 7am — locals doing tai chi",
      "Hutong wander around Nanluoguxiang (touristy but fun)",
      "798 Art District if you want galleries and coffee"
    ],
    eatDrink: [
      "Peking duck — Dadong or Siji Minfu for a splurge",
      "Jianbing from a street cart for breakfast",
      "Craft beer at Jing-A or Great Leap if you miss hops"
    ],
    headsUp: "The Wall is 1.5hrs north — book a private car or join a morning tour. Metro is cheap but stations are huge; allow extra time. Air quality can swing — check AQI and bring a mask just in case. Most people don't speak English outside hotels.",
    links: [
      { label: "Mutianyu Wall info", url: "https://www.mutianyugreatwall.com/" }
    ]
  },
  {
    type: "stay",
    city: "Shanghai",
    dates: "May 31",
    nights: 1,
    lat: 31.2304,
    lng: 121.4737,
    hotel: "TBC — near the airport or same first hotel",
    hotelLink: null,
    vibe: "One last walk. Final dumplings. Pack light.",
    doNotMiss: [
      "Revisit your favourite spot from the first stop",
      "Last-minute souvenir hunt on Nanjing Road or Tianzifang",
      "One more skyline view before the flight"
    ],
    eatDrink: [
      "Whatever you missed the first time — no regrets"
    ],
    headsUp: "Pudong (PVG) is ~1hr from the city centre by Maglev or metro. If your flight is early June 1, consider staying near the airport this night.",
    links: []
  },
  {
    type: "travel",
    date: "June 1",
    label: "Go home",
    detail: "Flight out of Shanghai Pudong (PVG)."
  }
];

// ============================================
// RENDERING — no need to edit below
// ============================================
const stopsContainer = document.getElementById("stops");
let stayIndex = 0;

const externalIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`;

tripStops.forEach((stop, i) => {
  if (stop.type === "travel") {
    const el = document.createElement("div");
    el.className = "travel-card";
    el.innerHTML = `
      <div class="travel-icon">✈️</div>
      <div class="travel-text">
        <strong>${stop.date}</strong> — ${escapeHtml(stop.label)}<br>
        <span style="color:#a09890;font-size:0.85rem;">${escapeHtml(stop.detail || "")}</span>
      </div>
    `;
    stopsContainer.appendChild(el);
    return;
  }

  stayIndex++;
  const el = document.createElement("article");
  el.className = "stop-card";

  const metaParts = [`${stop.nights} night${stop.nights > 1 ? "s" : ""}`];

  const hotelHtml = stop.hotelLink
    ? `<a class="link-pill" href="${escapeHtml(stop.hotelLink)}" target="_blank" rel="noopener">${externalIcon} ${escapeHtml(stop.hotel)}</a>`
    : `<span style="color:#8a817a;font-size:0.95rem;">${escapeHtml(stop.hotel)}</span>`;

  const doNotMissHtml = (stop.doNotMiss || []).length
    ? `<ul class="idea-list">${stop.doNotMiss.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`
    : `<p class="empty-state">Nothing here yet.</p>`;

  const eatDrinkHtml = (stop.eatDrink || []).length
    ? `<ul class="idea-list">${stop.eatDrink.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`
    : "";

  const headsUpHtml = stop.headsUp
    ? `<div class="heads-up">${escapeHtml(stop.headsUp)}</div>`
    : "";

  const linksHtml = (stop.links || []).length
    ? `<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.75rem;">
        ${stop.links.map(l => `<a class="link-pill" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${externalIcon} ${escapeHtml(l.label)}</a>`).join("")}
       </div>`
    : "";

  el.innerHTML = `
    <div class="stop-header">
      <div>
        <div class="stop-number">Stop ${stayIndex}</div>
        <h2 class="stop-title">${escapeHtml(stop.city)}</h2>
        <div class="stop-meta">${escapeHtml(stop.dates)} · ${escapeHtml(metaParts.join(" · "))}</div>
      </div>
      <div style="display:flex;gap:0.4rem;flex-wrap:wrap;justify-content:flex-end;">
        <span class="stop-tag">${stop.nights} nights</span>
        ${stop.hotelLink ? `<span class="stop-tag secondary">Hotel booked</span>` : `<span class="stop-tag secondary">Hotel TBC</span>`}
      </div>
    </div>
    <div class="stop-body">
      <div class="stop-section">
        <div class="section-title">Where we're staying</div>
        <div class="hotel-row">${hotelHtml}</div>
      </div>
      ${stop.vibe ? `
      <div class="stop-section">
        <div class="section-title">The vibe</div>
        <p style="margin:0;font-size:1rem;color:#3a332b;font-style:italic;">${escapeHtml(stop.vibe)}</p>
      </div>` : ""}
      <div class="stop-section">
        <div class="section-title">Don't miss</div>
        ${doNotMissHtml}
      </div>
      ${eatDrinkHtml ? `
      <div class="stop-section">
        <div class="section-title">Eat & drink</div>
        ${eatDrinkHtml}
      </div>` : ""}
      ${headsUpHtml ? `
      <div class="stop-section">
        <div class="section-title">Heads up</div>
        ${headsUpHtml}
      </div>` : ""}
      ${linksHtml}
      <div class="map" id="map-${i}"></div>
    </div>
  `;

  stopsContainer.appendChild(el);
});

// Leaflet maps
tripStops.forEach((stop, i) => {
  if (stop.type !== "stay") return;
  const container = document.getElementById(`map-${i}`);
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
