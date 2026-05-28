# Chris Folorunso Portfolio

Persona 3 Reload **pause-menu-inspired** portfolio for **Chris Folorunso** — Game Designer & Programmer.

**Reference video:** [Pause Menu - Persona 3 Reload](https://youtu.be/4d6x1CIgLSc) — layout, motion rhythm, and submenu patterns adapted with **original assets only** (no Atlus/Persona copyrighted art, characters, fonts, or exact UI clones).

Secondary technical references: [deltea P3R recreation](https://p3r.deltea.space/), [Adrian Kowalik breakdown](https://adrian-kowalik.com/projects/persona-3-reload-ui-recreation).

## Stack

- Vite + React + TypeScript
- SCSS + CSS variables
- react-router-dom v6+
- GSAP + `@gsap/react` (`useGSAP`, `gsap.matchMedia` / reduced motion)
- lucide-react
- Montserrat (italic menu) + Poppins (panels) via Google Fonts

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Content editing

| File | Purpose |
|------|---------|
| `src/data/site.json` | Name, tagline, bio, email, socials |
| `src/data/menu.json` | Menu labels, routes, offsets, action hints |
| `src/data/projects.json` | Featured repo slugs (merged with GitHub API) |
| `src/data/timeline.json` | Resume timeline entries |
| `src/data/gallery.json` | Gallery image paths and titles |

Tune staggered menu spacing in `menu.json` (`offsetX`, `offsetY`, `rotate`) and compare with the reference video at 0:00.

## Placeholders you should fill

1. **Email** — `src/data/site.json` → `email`
2. **Formspree** — copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT`
3. **Resume PDF** — add `public/assets/resume/chris-folorunso-resume.pdf`
4. **Gallery** — replace SVG placeholders in `public/assets/gallery/` and update `gallery.json`

## GitHub projects

Featured repos (always listed first): `Prototype_Z`, `Final_Year_VR_Project`, `MythGJ`, `TheBarMan`, `BetterWorldGJ` from [@Zodiac411](https://github.com/Zodiac411).

## No Atlus assets policy

This site recreates **interaction patterns** (three-zone pause layout, tri-cyan staggered menu, selector motion, water background, glass sub-panels) using original SVG motifs, CSS, and canvas — **not** game sprites, portraits, licensed fonts, or triangular cursor meshes from Persona 3 Reload.

## Deploy

- **Vercel:** connect repo, build `npm run build`, output `dist`
- **GitHub Pages:** set `base` in `vite.config.ts` if needed, deploy `dist`

## Keyboard

- ↑ / ↓ — move menu focus
- Enter — open section
- Esc — close sub-panel (return home)
