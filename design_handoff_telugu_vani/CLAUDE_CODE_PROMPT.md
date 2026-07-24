# Paste this to Claude Code

You're working in the existing **Telugu Vani** app (React + Vite). I'm giving you a
finished **visual redesign** to apply. The app's functionality already works — your job
is to **restyle the existing screens to match the new design without changing behavior**.

## What you have
A `design_handoff_telugu_vani/` folder at the repo root containing:
- `README.md` — the complete spec: exact colors, typography, spacing, radii, shadows,
  animations, and a per-screen component breakdown. **Read this first and follow it precisely.**
- `design/` — the design as a working React prototype (`screen-*.jsx`, `ui.jsx`, `data.js`).
  Each `screen-*.jsx` is the pixel spec for the matching route. The JSX is plain React, so
  you can lift structure and inline styles almost directly.

## How to apply it
1. Read `design_handoff_telugu_vani/README.md` end to end. Then skim each `design/screen-*.jsx`
   and `design/ui.jsx`.
2. **Add the fonts** (Playfair Display, Mulish, Noto Sans Telugu, Noto Serif Telugu, Ramaraja)
   via the Google Fonts `<link>` in `index.html` (snippet in the README).
3. **Create design tokens** in the project's styling system (CSS variables / Tailwind theme /
   theme object — match whatever the repo already uses). Copy every value from the README's
   "Design Tokens" table verbatim.
4. **Build the shared primitives** first — `TopNav`, `Button` (primary/ghost), `Card`,
   `Eyebrow`, `IconBadge`, `SectionTitle`, `Footer`, the dot-grid background, and the
   `Page`/route entrance animation — as real components in the repo's conventions.
5. **Restyle each screen** to match its `screen-*.jsx`, one route at a time: Home → Tracing →
   Shlokas → Progress → Admin. **Keep all existing logic, data sources, props, handlers, and
   routes.** Only the markup/styles change.
6. **Wire to real data/logic, not the prototype's mock data:**
   - Shlokas content already exists in the repo (`shlokas.js`) — render from it, not from the
     prototype's `data.js`. The fields line up (telugu lines, roman pronunciation, meaning).
   - Tracing Reset / Check stroke / Hear letter must call the app's existing
     validation + TTS, not the prototype's toast stub.
   - Progress and Admin numbers come from the app's real state.
7. **Deity images:** put the 14 artworks in `public/deities/<deity>.png` and render a real
   `<img>` inside the tinted, glowing rounded panel described in the README (one tint per
   deity — values in the README). Do **not** ship the prototype's `<image-slot>` web component
   or its SVG-mandala fallback; those are reference only. If an image is missing, fall back to
   the tinted panel + gold mandala look.
8. Match the **responsive rules** (breakpoints 900 / 540) and **`prefers-reduced-motion`**.

## Acceptance check
- All five routes visually match the prototype (spot-check against `design/Telugu Vani.html`).
- No functionality regressed: tracing still validates, audio still plays, progress/admin still
  reflect real data, routing unchanged.
- Fonts load; Telugu verses render in Ramaraja; headings in Playfair Display.
- Looks correct on mobile (≤ 540px) and tablet (≤ 900px).

Work screen by screen and keep changes presentational. Ask me before altering any data model,
API call, or route.
