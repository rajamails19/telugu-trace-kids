# Handoff: Telugu Vani — Premium Kids' Learning Redesign

## Overview
A complete visual redesign of the **Telugu Vani** kids' learning app (letter tracing,
shloka recitation, progress, admin). The look is **editorial-premium**: warm cream
canvas, deep-indigo + vivid-orange palette, Playfair Display serif headlines, an
elegant Ramaraja Telugu face for verses, glowing jewel-toned deity panels, and soft
floating cards with gentle entrance animations. Think "premium children's storybook
meets Duolingo polish."

> The **functionality already exists** in the target repo
> (`github.com/rajamails19/telugu-trace-kids`, React + Vite). This handoff is about
> **restyling those existing screens** to match the new design — keep all logic, swap
> the presentation.

## About the Design Files
The files in `/design` are a **design reference built as an HTML/React prototype**
(React 18 + inline Babel JSX). They are **not** meant to be shipped as-is. The task is
to **recreate this design inside the existing Vite + React codebase** using its real
components, router, and build pipeline.

Good news: the prototype is already plain React, so the JSX in each `screen-*.jsx`
maps almost 1:1 onto the repo's components. Treat each `screen-*.jsx` as the visual
spec for the corresponding route, and lift the inline styles into the project's
styling system (CSS Modules / Tailwind / styled-components — whatever the repo uses).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, shadows, and
interactions. Recreate pixel-accurately. Every value below is exact.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| `cream` | `#FBF4E4` | Page background |
| `creamCard` | `#FFFDF8` | Cards, nav bar (warm white) |
| `white` | `#FFFFFF` | Pure white surfaces |
| `ink` | `#3A1E9C` | Primary indigo — headings, brand, body emphasis |
| `inkDeep` | `#241A55` | Default deity-panel base |
| `inkSoft` | `#8E89A8` | Muted body text (lavender-grey) |
| `orange` | `#F0560E` | Primary accent — buttons, active states, eyebrows |
| `orangeDk` | `#D2480A` | Darker orange (track-icon, hovers) |
| `gold` | `#F5B62B` | Avatar ring, gold icon badge, mandala |
| `peach` | `#FCE6D6` | Active nav pill background |
| `petal` | `#F8D9A0` | Soft decorative blob behind hero image |
| `border` | `rgba(58,30,156,0.10)` | Hairline borders / dividers |

Dot-grid background: `radial-gradient(rgba(58,30,156,0.06) 1.4px, transparent 1.4px)`,
`background-size: 22px 22px`, offset `-8px -8px`.

### Per-deity panel tints (jewel tones behind the gold mandala)
```
ganesha #241A55  saraswati #2E1B57  guru #142A4E   gayatri #3A2350
hanuman #4A1730  karagre  #4A1838  shanti #0F3A38  annapurna #14392A
vishnu  #16285C  rivers   #0D3548  deepam #3E2613  shani #221C52
surya   #4A2613  hayagriva #321552
```
Panel background = `radial-gradient(120% 120% at 50% 30%, <tint>, #16102E)`.

### Typography
| Family | Stack | Use |
|---|---|---|
| Display serif | `'Playfair Display', Georgia, serif` | All headlines, card titles, brand, big numbers. Weights 500–900 + **italic** (hero accent "always meant"). |
| UI sans | `'Mulish', system-ui, sans-serif` | Body, buttons, nav links, labels, eyebrows. Weights 400–800. |
| Telugu (UI) | `'Noto Sans Telugu', sans-serif` | Small Telugu labels, **tracing letters** (clean strokes for learning), tab glyphs. |
| Telugu (verse) | `'Ramaraja', 'Noto Serif Telugu', serif` | Large shloka verse text + Telugu-reading accordion (elegant devotional face). |

Google Fonts import (in `<head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;0,900;1,500;1,600;1,700;1,800&family=Mulish:wght@400;500;600;700;800&family=Noto+Sans+Telugu:wght@400;600;700&family=Noto+Serif+Telugu:wght@400;500;600;700&family=Ramaraja&display=swap" rel="stylesheet">
```

Type scale (px): eyebrow 12.5 / 800 / `letter-spacing 2.2` / uppercase · body 15–19 ·
card title 25 (serif/800) · section heading clamp(28,3.4vw,40) · page H1
clamp(38,5vw,60) · hero H1 clamp(40,6vw,72) · big stat number 30–44 (serif/800).

### Radii / shadows / spacing
- Radii: cards **26px**, deity panel **30–36px**, icon badges `size*0.36`, pills/buttons **999px**, letter chips **18px**.
- Card shadow: `0 1px 0 rgba(58,30,156,0.04), 0 26px 50px -34px rgba(36,26,85,0.5)`.
  Hover: lift `translateY(-6px)` + deepen to `0 38px 60px -34px rgba(36,26,85,0.55)`.
- Button (primary) shadow: `0 10px 22px -8px rgba(240,86,14,0.6)`.
- Deity panel: `0 34–40px 56–70px -28px rgba(36,26,85,0.7)`, inset `0 0 0 1px rgba(245,182,43,0.25)`.
- Content max-width **1180px**, side padding **24px**. Card inner padding 22–28px.

### Animations (all `cubic-bezier(.22,1,.36,1)` unless noted)
- `tvPageIn` (route change): opacity 0→1, `translateY(14px)→0`, .5s.
- `tvRise` (stagger cards/sections): opacity 0→1, `translateY(20px)→0`, .5–.6s, per-item delay `0.06–0.08s * index`.
- `tvGlow` (deity mandala): opacity .6→1 + scale 1→1.05, 5s ease-in-out infinite.
- `tvPop` (toast): scale .85→1, .3s.
- Button hover: `translateY(-2px)`, `cubic-bezier(.34,1.56,.64,1)`.
- Card-hover arrow nudge: `→` `translateX(4px)`.
- Respect `prefers-reduced-motion: reduce` (durations ~0).

---

## Screens / Views
Routing in the prototype is hash-based (`#home`, `#tracing`, …) with a sticky floating
pill nav. In the repo, wire these to the existing router. Each maps to a `screen-*.jsx`.

### 1. TopNav (shared) — `ui.jsx`
Sticky floating pill, `max-width 1180`, `rgba(255,253,248,0.94)` + `backdrop-blur(14px)`,
radius 999, soft shadow.
- **Left brand:** orange rounded-square (38px, radius 13) with white Telugu "వ", then
  "Telugu Vani" in Playfair 800/22 indigo. Clicking → home.
- **Center links:** Home · Tracing · Shlokas · Progress · Admin. Mulish 700/15.5,
  pill padding `9px 18px`. **Active** = peach bg `#FCE6D6` + orange text. Hover (inactive)
  = `rgba(58,30,156,0.05)`. Hidden < 900px (use existing mobile nav).
- **Right avatar:** 42px circle, 2.5px gold border, `#FFF6E2` bg, "SJ" Mulish 800/14 orange.

### 2. Home — `screen-home.jsx`
- **Hero**, 2-col grid `1.05fr 0.95fr`, gap 48 (collapses to 1 col < 900px, image first).
  - Eyebrow pill (gold-tint bg) "Built for kids · Loved by parents".
  - H1 Playfair 800 clamp(40,6vw,72), indigo, with `<i>` orange accent "always meant".
  - Sub: Mulish 500/19 inkSoft, max-width 480.
  - Buttons: primary "Start tracing →" → tracing; ghost "Browse shlokas" → shlokas.
  - 3 stats row (gap 38): serif 30 number + uppercase 11.5 label — 56 Letters / 14 Shlokas / 4.9★ Parent rating.
  - **Deity panel** (right): petal blob behind (rotated -4deg), then rounded-36 panel with
    radial indigo bg, gold ring inset, animated glow, holding the deity image (see Assets).
- **Rituals section:** SectionTitle "Three rituals, one beautiful journey" (Telugu accent
  "మూడు మార్గాలు"). 3-col card grid (1 col < 900px). Each card: petal blob, IconBadge,
  uppercase category, serif title, muted body, "Open →". Cards → tracing / shlokas / progress.
  Badges: Practice=orange (అ) · Recite=indigo (ఓం) · Track=gold (★).

### 3. Tracing — `screen-tracing.jsx`
Centered header (eyebrow "Practice", H1 "Letter Tracing", sub). 2-col grid `300px 1fr`
(1 col < 900px).
- **Left card — letter picker:** label "Vowels · అచ్చులు". 3-col grid of 12 vowel chips
  (aspect 1, radius 18). Active = orange bg + white glyph + shadow; inactive = `#FCEFE0`,
  hover `#FBE3CF`. Glyph Noto Sans Telugu 700/26.
- **Right card — canvas:** "Now tracing" eyebrow, "Letter <glyph> · <roman>" title.
  - **Trace area:** aspect 1.32, dashed orange border, faint gradient fill, a huge faded
    guide glyph (`rgba(240,86,14,0.16)`), and an HTML5 `<canvas>` overlay. Drawing: orange
    stroke, `lineWidth 13`, round caps, soft shadow. Supports mouse + touch. DPR-aware resize.
    Caption "TRACE INSIDE THE GOLDEN GUIDE".
  - **Reset** button (indigo pill) top-right of canvas; clears strokes.
  - Buttons: primary "✓ Check stroke" (shows a green "✦ Beautiful! +5 stars" toast for ~1.9s),
    ghost "▶ Hear letter", ghost "Show stroke order".
  - *Repo integration:* wire Reset/Check/Hear to the existing tracing-validation + TTS logic.

### 4. Shlokas — `screen-shlokas.jsx`
Centered header (eyebrow "Daily recitation", H1 "Nitya Shlokas", sub, pill counter
`<idx+1> / <total>` = N/14).
- **Deity tabs:** wrap-centered row of 14 pills (icon + name). Active = orange bg + white
  + shadow; inactive = white + hairline border. Selecting sets the active shloka.
- **Featured verse card:** 2-col `1.1fr 0.9fr` (1 col < 900px).
  - Left: eyebrow pill "Featured verse · <label>"; verse lines in **Ramaraja**
    clamp(23,2.5vw,32)/600 indigo, line-height 1.75; play row = indigo circle ▶ +
    "Listen & Repeat" / "Slow tempo · <dur>".
  - Right: deity panel tinted per deity (see tints) with gold mandala / dropped image.
  - **Accordions:** "తెలుగు చదవడం · Telugu Reading", "English Pronunciation", "💡 Meaning".
    One open at a time; chevron rotates; `max-height` transition. Meaning open by default.
- **Prev / Next** buttons cycle deities (wrap-around); the keyed verse re-fades (`tvRise .45s`).
- *Content:* all 14 shlokas (Telugu lines, hyphenated roman pronunciation, meaning, tempo)
  are in `data.js → window.SHLOKAS`, keyed by deity. This matches the repo's `shlokas.js`.

### 5. Progress — `screen-progress.jsx`
Centered header (eyebrow "Your journey", H1 "Progress", sub).
- **4 stat cards** (4-col → 2-col < 900 → 1-col < 540): emoji, serif 42 number, uppercase
  label. 🔥 12 Day streak · ✍️ 28 Letters mastered · 🕉️ 6 Shlokas learned · 🏆 4 Trophies.
- **Milestones card:** serif "Milestones" + vertical timeline. Each row: status dot
  (done = orange ✓; pending = peach ring) connected by a 2px line, serif title (muted if
  pending), uppercase "Day N / Soon" on the right.

### 6. Admin — `screen-admin.jsx`
Centered header (eyebrow "Dashboard", H1 "Admin", sub).
- **3 stat cards** (3-col → 1-col < 900): serif 44 number + uppercase label —
  3 Active learners / 42 Sessions this week / 92% Avg. accuracy.
- **Learners card:** header "Learners" + primary "+ Add learner". Rows (grid
  `1.6fr 1fr 1fr 1fr`, collapses on mobile): gold-ring avatar initial + serif name,
  then 🔥 streak / ✍️ letters / 🕉️ shlokas.

---

## Interactions & Behavior
- **Navigation:** nav links + hero/card CTAs switch routes; each route entrance plays
  `tvPageIn`; window scrolls to top (smooth).
- **Tracing canvas:** pointer/touch draw; Reset clears; Check → success toast.
- **Shlokas:** tab select + Prev/Next change the active shloka and re-fade the verse;
  accordions expand one-at-a-time.
- **Hover:** cards lift; buttons rise; "Open →" arrow nudges.
- **Responsive:** breakpoints 900px (grids → 1 col, desktop nav hidden, hero image first)
  and 540px (stat grids → 1 col). Hit targets ≥ 44px.

## State Management
- `route` (active screen) — replace with the repo's router.
- Tracing: `selectedVowelIndex`, canvas `isDrawing`/`isDirty`, `toastVisible`.
- Shlokas: `activeIndex` (deity), `openAccordion`.
- Everything else is static content from `data.js` — in the repo, source it from the
  existing `shlokas.js` / progress / learner data instead.

## Assets
- **Deity images:** the prototype uses an `<image-slot>` web component as a drop-zone with
  a generated **gold-mandala SVG fallback** (`data.js → window.mandalaDataURI`). In the
  **repo**, replace each with a real `<img>` (e.g. `/public/deities/ganesha.png`, …) — one
  per deity, sitting inside the tinted rounded panel with the animated gold glow. The
  client will supply the 14 deity artworks (e.g. Midjourney exports). Keep the panel frame,
  tint, ring, and glow exactly as specified.
- **Icons/emoji:** plain Unicode emoji are used for stats, tabs, and badges — keep or swap
  for the repo's icon set.
- **Fonts:** Google Fonts (links above). No local font files needed.
- **No raster assets** are required by the chrome itself — all surfaces are CSS.

## Files (in `/design`)
- `Telugu Vani.html` — app shell: font links, global CSS (keyframes + responsive), router, mount.
- `data.js` — **all tokens** (`window.T`), the 14 shlokas (`window.SHLOKAS`), deity tabs
  (`window.DEITIES`), per-deity tints (`window.DEITY_TINT`), vowels, progress, learners,
  and the mandala SVG fallback.
- `ui.jsx` — shared primitives: `DotField, Eyebrow, Button, Card, PetalBlob, IconBadge,
  TopNav, Footer, SectionTitle, Page`.
- `screen-home.jsx`, `screen-tracing.jsx`, `screen-shlokas.jsx`, `screen-progress.jsx`,
  `screen-admin.jsx` — one per route; the visual spec for that screen.
- `image-slot.js` — the prototype's drop-zone component (reference only; replace with `<img>`).

See `CLAUDE_CODE_PROMPT.md` for a ready-to-paste instruction to drive the implementation.
