# China 2026 — Website Design Decisions

## Architecture
- **Static site** — single HTML + CSS + JS, data in a JS/JSON file
- **Deployment**: GitHub Pages (push to main → auto-deploy)
- **Offline**: PWA with network-first service worker (caches text + images, refreshes on load)

## Data Model
Each idea is an object with flexible fields:
```js
{
  title: "24hr Spa (New Star)",
  city: "shanghai",
  category: "wellness",  // wellness, food, drink, activity, shopping, viewpoint, etc.
  photo: "spa.jpg",      // stored in /images/
  note: "Zane sent this — looks incredible",
  links: [
    { type: "maps", url: "..." },
    { type: "instagram", url: "..." },
    { type: "website", url: "..." }
    // extensible — add menu, booking, youtube, etc.
  ]
}
```

All fields are optional except title, city, and category. Links array is infinitely extensible.

## Main View — Ideas Feed
- **Vertical stacked cards**: full-width photo on top, text/info below
- **City filter pills** at the top: All | Shanghai | Zhangjiajie | Chongqing | Xi'an | Beijing
- Filtering is instant client-side (no page reload)
- Photos stored in `/images/` folder
- External links (maps, instagram, website) open in native apps / new tabs

## Navigation
- **Compact sticky top bar**: trip name on left, hamburger menu on right
- **Side drawer** (hamburger): slides out with links to Ideas + Logistics
- Ideas view is the default/primary

## Logistics Section (via drawer)
- **Flights**: outbound + return with timeline visualization (local times)
- **Trains**: chronological timeline — upcoming at top, past grayed out at bottom
  - Each train: route, date, departure/arrival times, train number, seat, status (booked/not booked/completed)
- **Hotels**: per city, with links
- **Practical tips**: per city (VPN, transport, weather, etc.)
- **Vibe**: short city description (optional)

## Travel Days
- Small indicator cards between cities showing route + approximate transit time
- Evening activities live in the destination city's ideas list
- No split-day cards needed

## Visual Design
- **Dark theme** (dark background, light text)
- **Pinterest board vibe** — image-forward, visual, scrollable
- **Compact sticky top bar** — minimal chrome, maximize content space
- Vertical stacked cards with bold photos
- Name: straightforward / descriptive (e.g., "China 2026")

## Flights
**Outbound** — Mon May 18 → Tue May 19 (19h 40m)
- DL1684: AUS 11:10 AM → SEA 1:50 PM (layover 2h 15m)
- DL0281: SEA 4:05 PM → PVG 7:50 PM (Tue)

**Return** — Mon Jun 1 (18h 6m)
- DL0038: PVG 6:25 PM → LAX 3:19 PM (layover 3h 21m)
- DL0692: LAX 6:40 PM → AUS 11:31 PM

## Itinerary (approximate)
| City | Dates | Nights |
|------|-------|--------|
| Shanghai | May 18–20 | 3 |
| Zhangjiajie | May 22–23 | 2 |
| Chongqing | May 25 | 1 |
| Xi'an | May 27 | 1 |
| Beijing | May 29–30 | 2 |
| Shanghai | May 31 | 1 |

Travel days: May 21 (SH→ZJJ), May 24 (ZJJ→CQ), May 26 (CQ→XA), May 28 (XA→BJ)

Must be back in Shanghai by June 1, 6:25 PM for return flight.
