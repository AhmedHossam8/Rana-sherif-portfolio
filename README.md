# Rana Sherif — UI/UX Portfolio

Personal portfolio for Rana Sherif, a UI/UX designer. Built with React + Vite + Tailwind CSS.

## Features

- Auto-syncs projects from Behance at runtime (no rebuild needed)
- Project cards with hover slideshow gallery
- Animated painter character with mouse tracking
- Dark mode toggle
- Responsive design with loading skeletons
- Smooth entrance and scroll animations

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS 3
- **Deployment:** Netlify (with reverse proxy for Behance API)

## Behance Integration

Projects are fetched from Behance by parsing the public profile page at runtime via a Netlify server-side redirect proxy — no RSS feed, no backend, no build-step sync. Add a project on Behance and it appears on the site instantly.

## Development

```bash
npm install
npm run dev
```

## Deployment

Push to GitHub, connect repo to Netlify. Set `VITE_BEHANCE_URL` as an environment variable. The `netlify.toml` handles build settings and proxy redirects automatically.
