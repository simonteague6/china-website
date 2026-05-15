# China 2026 — Website Design Decisions

## Architecture
- **Static site** — single HTML + CSS + JS
- **Data**: `site/data.json` — single source of truth
- **CLI**: `scripts/trip` (Node.js) with subcommands to add/edit data
- **Deployment**: GitHub Pages (push to main → auto-deploy)
- **Offline**: PWA with network-first service worker (caches text + images, refreshes on load)

## Data Model — Ideas
Each idea is loose and flexible — only title and city are required:
```json
{
  "title": "24hr Spa (New Star)",
  "city": "shanghai",
  "photo": "spa.jpg",
  "note": "Zane sent this — looks incredible",
  "links": [
    { "type": "maps", "url": "https://..." },
    { "type": "instagram", "url": "https://..." },
    { "type": "website", "url": "https://..." }
  ]
}
```
- No categories. Loose vibes only.
- Links array is infinitely extensible (maps, instagram, website, menu, booking, youtube, dianping, etc.)
- Photos stored in `/images/` folder

## Main View — Ideas Feed
- **Vertical stacked cards**: full-width photo on top, title + note + links below
- **City filter pills** at the top: All | Shanghai | Zhangjiajie | Chongqing | Xi'an | Beijing
- Instant client-side filtering. Default = All.
- No "done" tracking — pure inspiration board
- No per-idea attribution

## Navigation
- **Compact sticky top bar**: trip name on left, hamburger menu on right
- **Side drawer**: slides out with links to Ideas + Logistics
- Ideas view is default/primary

## Logistics Section (via drawer)
- **Organized by day**: each day shows flights, trains, hotels relevant to that date
- **Flights**: outbound + return with timeline visualization (local times)
- **Trains**: chronological timeline — upcoming at top, past grayed out at bottom
  - Each train: route, date, departure/arrival times, train number, seat, status
- **Hotels**: per day/city, with links
- **Emergency info**: embassy, emergency numbers, insurance

## Travel Days
- Small indicator cards between cities showing route + approximate transit time
- Evening activities live in the destination city's ideas list

## Visual Design
- **Dark theme**
- **Pinterest board vibe** — image-forward, visual, scrollable
- **Vertical stacked cards** with full-width photos
- **Compact sticky top bar**
- Name: straightforward / descriptive (TBD — user to decide, not "China Crew")

## Group
- Simon, Jonathan, Cash (Dripping Springs, TX), Elliot (living in Shanghai 9 months)

## Flights
**Outbound** — Mon May 18 → Tue May 19 (19h 40m)
- DL1684: AUS 11:10 AM → SEA 1:50 PM (layover 2h 15m)
- DL0281: SEA 4:05 PM → PVG 7:50 PM (Tue)
- Seats: 30C, 42C

**Return** — Mon Jun 1 (18h 6m)
- DL0038: PVG 6:25 PM → LAX 3:19 PM (layover 3h 21m)
- DL0692: LAX 6:40 PM → AUS 11:31 PM
- Seats: 50C, 29C

## Itinerary (approximate)
| City | Dates | Nights | Hotel |
|------|-------|--------|-------|
| Shanghai | May 18–20 | 3 | Elliot handling |
| Zhangjiajie | May 22–23 | 2 | TBC |
| Chongqing | May 25 | 1 | TBC |
| Xi'an | May 27 | 1 | TBC |
| Beijing | May 29–30 | 2 | TBC |
| Shanghai | May 31 | 1 | TBC |

Travel days: May 21 (SH→ZJJ), May 24 (ZJJ→CQ), May 26 (CQ→XA), May 28 (XA→BJ)

Must be back in Shanghai by June 1, 6:25 PM for return flight.

## CLI Script (`scripts/trip`)
Single Node.js script with subcommands:
- `trip add idea --city shanghai --title "..." --photo "..." --note "..." --link maps:URL --link instagram:URL`
- `trip add train --date 2026-05-21 --from Shanghai --to Zhangjiajie --depart 08:30 --arrive 14:15 --train G1234 --seat 12A`
- `trip set hotel --city shanghai --name "..." --checkin 2026-05-18 --checkout 2026-05-21 --link "..." --notes "..."`
- `trip set flight --direction outbound|return --segments '[...]'`
- Modifies `site/data.json` directly
