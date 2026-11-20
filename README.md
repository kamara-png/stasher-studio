# stasher studio

The personal site of **Calvin Kamara** — graphic designer, game developer and the person behind **STASHER / ckay.png**. Built as a 1:1 structural copy of a design-studio site, restyled with Calvin's work and a purple theme.

![stasher studio](brand/hero-still-1600.webp)

## What's here

- **Home** — intro, selected work, experience, insights and a footer music widget.
- **Work** — seven case studies: Q Lounge, Apps (Budgeter + Tendo), Generation Now, duo++, STASHER / ckay.png, Porsche 3D and Poster Art.
- **Insights** — long-form design and development articles.
- **About** — Calvin's story, stats, clients and testimonials.
- **Contact** — email, WhatsApp, Instagram, LinkedIn, GitHub, Discord and Spotify.
- **Legal** — privacy, cookies and terms pages.

## Design

The original layout, motion and interaction patterns are preserved. The colour system was switched from red to purple:

| Token | Value |
| --- | --- |
| `--black` | `#0d0018` |
| `--white` | `#f3efff` |
| `--red` (accent) | `#8b5cf6` |
| `--red-3` | `#a78bfa` |
| `--liquid-pink` | `#d8b4fe` |

Hero imagery was recoloured from red/orange to violet to match.

## Running locally

This is a static site with a small Node server for clean URLs and the `/api/now-playing` endpoint. There is **no build step** and **no `npm install`** required.

**Windows:** double-click `start.bat`

**Any platform:**

```bash
node serve.mjs
```

Then open [http://localhost:5173](http://localhost:5173). Set `PORT` to use a different port.

> Do **not** use `npm run dev` — there is no `package.json`.

## Deployment

The site is connected to Vercel through GitHub:

- Repository: `github.com/kamara-png/stasher-studio`
- Vercel project: `stasher-studio` (Hobby)
- Pushes to `main` deploy automatically.

`vercel.json` enables clean URLs and long-lived caching for immutable assets. `api/now-playing.js` is the serverless version of the local endpoint; the shared response data lives in `data/now-playing.json` (kept outside `api/` so Vercel does not treat it as a second `/api/now-playing` route).

## Spotify

The footer widget links to [Spotify user Kamarack](https://open.spotify.com/user/Kamarack) and shows a cover image. A **live** "currently playing" feed requires a Spotify Developer app (client ID, client secret and an authorised refresh token); without those credentials Spotify does not allow reading another user's playback. The static profile link works for everyone.

## Contact

- Email: calvinkamarack@gmail.com
- Instagram: [@ckay.png](https://instagram.com/ckay.png)
- GitHub: [@kamara-png](https://github.com/kamara-png)
- Spotify: [Kamarack](https://open.spotify.com/user/Kamarack)
