# China 2026

A loose trip companion built for a 2-week trip across China. Dark theme, Pinterest-style idea board, offline-capable, and managed entirely through a custom CLI.

**[china.simonteague.xyz](https://china.simonteague.xyz)**

---

## The problem

My friends and I are going to China for two weeks. For months, we'd been sending each other Instagram Reels in a group chat — restaurants, viewpoints, a 24-hour spa, street food stalls. Hundreds of ideas, all scattered.

We tried a Google Doc. Nobody updated it. It looked bad. It was hard to scan on a phone.

I tried Wanderlog. Too structured. It wanted me to plan exact times and daily itineraries, which felt wrong for the kind of trip we wanted.

## The insight

Research shows that **unplanned trips make people happier** — you're not stressed about missing deadlines or sticking to a schedule. But having *no plan at all* creates its own anxiety: you're standing on a street corner in Xi'an with no idea what to do.

I wanted the sweet spot: **a loose inspiration board** with all our ideas in one place, visual and scannable, that we could pull up on our phones when we didn't know where to go next.

Nothing existed that did exactly what I wanted. So I built it.

## What it does

- **Idea board** — every restaurant, viewpoint, spa, and bar we've saved, displayed as visual cards with photos, notes, and links (Google Maps, Instagram, websites)
- **City filtering** — tap a city pill to see only what's relevant where you are
- **Day-by-day logistics** — flights, train bookings, hotels, and emergency info, organized chronologically
- **Works offline** — service worker caches everything. No cell signal on a train? The site still loads
- **Zero accounts, zero logins** — share the link and anyone can see it

## How I add content

I don't manually edit JSON. I use a custom CLI that my AI agent (Pi) drives:

```bash
# Adding a restaurant from an Instagram Reel:
node scripts/trip.js add idea --city shanghai \
  --title "Jia Jia Tang Bao" \
  --note "Go before 11am or the line is insane — Kai" \
  --link maps:https://maps.google.com/... \
  --link instagram:https://instagram.com/reel/...

# Booking a train mid-trip:
node scripts/trip.js add train --date 2026-05-24 \
  --from Zhangjiajie --to Chongqing \
  --depart 09:00 --arrive 14:00 --train G5678 --status booked
```

The CLI writes to `site/data.json`. Push to main, GitHub Pages deploys automatically.

## Tech stack

- Vanilla HTML, CSS, JavaScript — no frameworks, no build step
- Dark theme, responsive, mobile-first
- PWA with network-first service worker
- GitHub Pages for hosting
- Custom Node.js CLI for data management

## Why this project matters to me

I had a real problem and I was passionate enough to solve it with the tools I'm good at. I didn't wait for someone else's software to fit my needs — I built exactly what I wanted, from the design system to the deployment workflow.

That's how I approach building things: find the friction, understand the user (in this case, me and three friends on a train), and make something that actually works.

---

## Trip details

| City | Dates | Nights |
|------|-------|--------|
| Shanghai | May 18–20, May 31 | 4 |
| Zhangjiajie | May 22–23 | 2 |
| Chongqing | May 25 | 1 |
| Xi'an | May 27 | 1 |
| Beijing | May 29–30 | 2 |

Flights: Austin → Shanghai (May 18–19), Shanghai → Austin (Jun 1)
