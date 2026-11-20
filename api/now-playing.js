// Vercel serverless function for /api/now-playing.
// Keeps the widget pointed at Kamarack's Spotify profile.
const DATA = {
  live: true,
  playing: true,
  title: "Kamarack on Spotify",
  artist: "Follow my music — Kamarack",
  url: "https://open.spotify.com/user/Kamarack",
  cover: { src: "/media/now-playing-cover.jpg", width: 300, height: 300 },
};

module.exports = function handler(_req, res) {
  res.status(200);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(DATA));
}
