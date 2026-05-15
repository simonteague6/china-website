#!/usr/bin/env node
// scripts/trip.js — CLI for managing China 2026 trip data
// Usage: node scripts/trip.js <command> [options]

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "site", "data.json");

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
}

function parseArgs(argv) {
  const args = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        if (args[key]) {
          if (Array.isArray(args[key])) args[key].push(next);
          else args[key] = [args[key], next];
        } else {
          args[key] = next;
        }
        i++;
      } else {
        args[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  args._ = positional;
  return args;
}

function parseLink(raw) {
  const colon = raw.indexOf(":");
  if (colon === -1) throw new Error(`Invalid link format: "${raw}". Use type:url (e.g. maps:https://...)`);
  return { type: raw.slice(0, colon), url: raw.slice(colon + 1) };
}

function addIdea(args) {
  if (!args.city || !args.title) {
    console.error("Usage: trip add idea --city <city> --title <title> [--photo <file>] [--note <text>] [--link type:url ...]");
    process.exit(1);
  }
  const data = readData();
  const cityExists = data.cities.find(c => c.id === args.city.toLowerCase());
  if (!cityExists) {
    console.error(`Unknown city "${args.city}". Valid cities: ${data.cities.map(c => c.id).join(", ")}`);
    process.exit(1);
  }
  const idea = {
    title: args.title,
    city: args.city.toLowerCase()
  };
  if (args.photo) idea.photo = args.photo;
  if (args.note) idea.note = args.note;
  if (args.link) {
    const links = Array.isArray(args.link) ? args.link : [args.link];
    idea.links = links.map(parseLink);
  }
  data.ideas.push(idea);
  writeData(data);
  console.log(`✅ Added idea: "${idea.title}" → ${idea.city}`);
}

function addTrain(args) {
  if (!args.date || !args.from || !args.to) {
    console.error("Usage: trip add train --date YYYY-MM-DD --from <city> --to <city> [--depart HH:MM] [--arrive HH:MM] [--train G1234] [--seat 12A] [--status booked|not-booked|completed]");
    process.exit(1);
  }
  const data = readData();
  const train = {
    date: args.date,
    from: args.from,
    to: args.to,
    status: args.status || "not-booked"
  };
  if (args.depart) train.depart = args.depart;
  if (args.arrive) train.arrive = args.arrive;
  if (args.train) train.train = args.train;
  if (args.seat) train.seat = args.seat;
  data.trains.push(train);
  writeData(data);
  console.log(`✅ Added train: ${train.from} → ${train.to} on ${train.date} [${train.status}]`);
}

function setHotel(args) {
  if (!args.city || !args.name || !args.checkin || !args.checkout) {
    console.error("Usage: trip set hotel --city <city> --name <name> --checkin YYYY-MM-DD --checkout YYYY-MM-DD [--link URL] [--notes text]");
    process.exit(1);
  }
  const data = readData();
  const existing = data.hotels.findIndex(h => h.city === args.city.toLowerCase() && h.checkin === args.checkin);
  const hotel = {
    city: args.city.toLowerCase(),
    name: args.name,
    checkin: args.checkin,
    checkout: args.checkout,
    link: args.link || null,
    notes: args.notes || ""
  };
  if (existing >= 0) {
    data.hotels[existing] = hotel;
    console.log(`✅ Updated hotel: ${hotel.name} in ${hotel.city}`);
  } else {
    data.hotels.push(hotel);
    console.log(`✅ Added hotel: ${hotel.name} in ${hotel.city}`);
  }
  writeData(data);
}

function setFlight(args) {
  console.error("Flight management is done by editing data.json directly.");
  console.error("Current flights are set for outbound (May 18-19) and return (Jun 1).");
  process.exit(1);
}

function list(args) {
  const data = readData();
  if (args._.length < 2) {
    console.log("Usage: trip list ideas|trains|hotels|cities");
    process.exit(1);
  }
  const what = args._[1];
  if (what === "ideas") {
    const city = args.city;
    const items = city ? data.ideas.filter(i => i.city === city.toLowerCase()) : data.ideas;
    if (items.length === 0) {
      console.log(city ? `No ideas for ${city} yet.` : "No ideas yet.");
    } else {
      items.forEach((idea, i) => {
        console.log(`${i + 1}. ${idea.title} [${idea.city}]${idea.note ? ` — ${idea.note}` : ""}`);
      });
    }
  } else if (what === "trains") {
    data.trains.sort((a, b) => a.date.localeCompare(b.date));
    data.trains.forEach(t => {
      const icon = t.status === "completed" ? "✅" : t.status === "booked" ? "🎫" : "⏳";
      console.log(`${icon} ${t.date}: ${t.from} → ${t.to}${t.train ? ` (${t.train})` : ""} [${t.status}]`);
    });
  } else if (what === "hotels") {
    data.hotels.forEach(h => {
      console.log(`🏨 ${h.city}: ${h.name} (${h.checkin} → ${h.checkout})${h.link ? ` — ${h.link}` : ""}`);
    });
  } else if (what === "cities") {
    data.cities.forEach(c => {
      console.log(`📍 ${c.name} (${c.nameZh}): ${c.dates} — ${c.nights} nights`);
    });
  } else {
    console.log(`Unknown list type: ${what}`);
    process.exit(1);
  }
}

// Main
const args = parseArgs(process.argv.slice(2));
const command = args._[0];

switch (command) {
  case "add":
    if (args._[1] === "idea") addIdea(args);
    else if (args._[1] === "train") addTrain(args);
    else {
      console.error("Usage: trip add idea|train [options]");
      process.exit(1);
    }
    break;
  case "set":
    if (args._[1] === "hotel") setHotel(args);
    else if (args._[1] === "flight") setFlight(args);
    else {
      console.error("Usage: trip set hotel|flight [options]");
      process.exit(1);
    }
    break;
  case "list":
    list(args);
    break;
  default:
    console.log("China 2026 — Trip Manager");
    console.log("");
    console.log("Commands:");
    console.log("  trip add idea    --city <id> --title <text> [--photo <file>] [--note <text>] [--link type:url ...]");
    console.log("  trip add train   --date YYYY-MM-DD --from <city> --to <city> [--depart HH:MM] [--arrive HH:MM] [--train ID] [--seat ID] [--status booked|not-booked|completed]");
    console.log("  trip set hotel   --city <id> --name <text> --checkin YYYY-MM-DD --checkout YYYY-MM-DD [--link URL] [--notes text]");
    console.log("  trip list ideas  [--city <id>]");
    console.log("  trip list trains");
    console.log("  trip list hotels");
    console.log("  trip list cities");
    console.log("");
    console.log("Cities: shanghai, zhangjiajie, chongqing, xian, beijing");
    console.log("Link types: maps, instagram, website, menu, booking, youtube, dianping, ...");
}
