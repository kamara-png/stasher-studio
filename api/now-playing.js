// Vercel serverless function for /api/now-playing.
// Picks one track from Kamarack's "Where chill lives" playlist each day.
const playlist = require("../data/playlist.json");

const SLOT_MS = 5 * 60 * 1000;
const NAIROBI_OFFSET_MS = 3 * 60 * 60 * 1000; // keeps slots aligned to local five-minute boundaries

function hashString(value) {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDailyOrder(length) {
  const order = Array.from({ length }, (_, index) => index);
  const random = seededRandom(hashString(`${playlist.name}|${playlist.url}`));
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

const ORDER = buildDailyOrder(playlist.tracks.length);

function slotIndex(now = Date.now()) {
  return Math.floor((now + NAIROBI_OFFSET_MS) / SLOT_MS);
}

function dateKey(now = Date.now()) {
  return new Date(now + NAIROBI_OFFSET_MS).toISOString().slice(0, 10);
}

function getCurrentPick(now = Date.now()) {
  const slot = slotIndex(now);
  const track = playlist.tracks[ORDER[slot % ORDER.length]];
  return {
    live: true,
    playing: true,
    title: track.title,
    artist: track.artist,
    url: `https://open.spotify.com/track/${track.id}`,
    cover: { src: track.cover, width: 640, height: 640 },
    playlist: { name: playlist.name, url: playlist.url },
    date: dateKey(now),
    slot,
  };
}

function handler(_req, res) {
  res.status(200);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(getCurrentPick()));
}

module.exports = handler;
module.exports.getCurrentPick = getCurrentPick;
