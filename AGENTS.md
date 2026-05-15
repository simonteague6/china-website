# China 2026 — Trip Website

## What this project is
A dark, Pinterest-style single-page website for a 2-week China trip (May 18 – Jun 1, 2026). The site serves as a shared inspiration board and logistics hub — pull it up on your phone during the trip to see ideas, flights, trains, and hotels in one place.

**Group:** Simon, Jonathan, Cash (Dripping Springs, TX), Elliot (living in Shanghai 9 months)

## Key design decisions
- **No categories.** Ideas are loose. Just title, city, photo, note, links. Pure inspiration board.
- **No done tracking.** No checkmarks, no visited states.
- **No attribution.** Ideas don't show who suggested them.
- **Dark theme, Pinterest board vibe.** Image-forward vertical stacked cards.
- **City filter pills** at top: All | Shanghai | Zhangjiajie | Chongqing | Xi'an | Beijing
- **Side drawer** (hamburger) for navigation: Ideas | Logistics
- **Logistics organized by day** — flights, trains, hotels, emergency info
- **Trains: chronological timeline**, upcoming at top, past grayed out
- **Travel days: small indicators** between city cards. Evening activities live in next city.
- **Offline PWA** with network-first service worker (caches text + images, refreshes on load)
- **No categories field** in data model — just title, city, photo, note, links[]

## Architecture
- **Static site**: `site/index.html`, `site/styles.css`, `site/app.js`
- **Data**: `site/data.json` — single source of truth, fetched at runtime
- **Photos**: `site/images/` — all images in one flat folder
- **CLI**: `scripts/trip.js` (Node.js) — subcommands for adding ideas, trains, hotels, flights
- **Deployment**: GitHub Pages (push to main → auto-deploy)

## Data model

### Ideas (`data.ideas[]`)
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
All fields optional except title and city. Links types: maps, instagram, website, menu, booking, youtube, dianping, etc. — infinitely extensible.

### Trains (`data.trains[]`)
```json
{
  "date": "2026-05-21",
  "from": "Shanghai",
  "to": "Zhangjiajie",
  "depart": "08:30",
  "arrive": "14:15",
  "train": "G1234",
  "seat": "12A",
  "status": "booked"
}
```
Status: "booked", "not-booked", or "completed". Display: upcoming at top, past grayed.

### Hotels (`data.hotels[]`)
```json
{
  "city": "shanghai",
  "name": "TBD — Elliot handling",
  "checkin": "2026-05-18",
  "checkout": "2026-05-21",
  "link": null,
  "notes": "Elliot is handling the booking"
}
```

### Flights (`data.flights`)
Outbound and return, each with segments array.

### Cities (`data.cities[]`)
Ordered list of city objects with: name, dates, nights, lat, lng, vibe (optional), headsUp (optional).

## Flights

**Outbound** — Mon May 18 → Tue May 19 (19h 40m total)
- DL1684: AUS 11:10 AM → SEA 1:50 PM (4h 40m), seat 30C
- Layover: 2h 15m in Seattle
- DL0281: SEA 4:05 PM → PVG 7:50 PM (12h 45m), seat 42C

**Return** — Mon Jun 1 (18h 6m total)
- DL0038: PVG 6:25 PM → LAX 3:19 PM (11h 54m), seat 50C
- Layover: 3h 21m in LAX
- DL0692: LAX 6:40 PM → AUS 11:31 PM (2h 51m), seat 29C

Must be back in Shanghai by June 1, 6:25 PM.

## Itinerary (approximate — only flights are locked)
| Dates | City | Nights | Hotel |
|-------|------|--------|-------|
| May 18–20 | Shanghai | 3 | Elliot handling |
| May 21 | Travel: SH→ZJJ | — | — |
| May 22–23 | Zhangjiajie | 2 | TBC |
| May 24 | Travel: ZJJ→CQ | — | — |
| May 25 | Chongqing | 1 | TBC |
| May 26 | Travel: CQ→XA | — | — |
| May 27 | Xi'an | 1 | TBC |
| May 28 | Travel: XA→BJ | — | — |
| May 29–30 | Beijing | 2 | TBC |
| May 31 | Shanghai | 1 | TBC |
| Jun 1 | Fly home (PVG 6:25 PM) | — | — |

## CLI script (`scripts/trip.js`)
Single Node.js script with subcommands. Reads/writes `site/data.json`.

Usage:
```bash
node scripts/trip.js add idea --city shanghai --title "..." [--photo "..."] [--note "..."] [--link maps:URL] [--link instagram:URL] ...
node scripts/trip.js add train --date 2026-05-21 --from Shanghai --to Zhangjiajie --depart 08:30 --arrive 14:15 [--train G1234] [--seat 12A] [--status booked]
node scripts/trip.js set hotel --city shanghai --name "..." --checkin 2026-05-18 --checkout 2026-05-21 [--link "..."] [--notes "..."]
node scripts/trip.js set flight --direction outbound|return --segments '[...]'
```

## Content workflow
1. User tells Pi agent what to add (idea, train, hotel)
2. Pi agent runs the CLI script
3. Pi agent commits + pushes to GitHub
4. GitHub Pages auto-deploys

## Naming
**Site name:** "China 2026" (straightforward, descriptive — NOT "China Crew")

## The old site
The previous AI-generated site (`site/index.html`, `site/styles.css`, `site/app.js`) is being completely replaced. Nothing from it should survive. The old content was AI-generated filler. The itinerary plan was the only good part, and even that had issues with travel day representation.
