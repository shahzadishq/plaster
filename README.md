# Pläster Gebäudereinigung GmbH — Website

Premium B2B marketing site for **Pläster Gebäudereinigung GmbH** (est. **1982**,
Emmendingen). Built with **React + Vite + TypeScript**, **Framer Motion** for
animation, and **Tailwind CSS + shadcn** wired up so you can drop in
[21st.dev](https://21st.dev) / shadcn components.

## Stack

| Concern | Choice |
|---|---|
| Build | Vite 5 + React 18 + TypeScript |
| Animation | Framer Motion (scroll fades, staggered reveals, hover, counters) |
| Styling | Existing design system in `src/styles/legacy.css` + Tailwind utilities |
| Components | shadcn-ready (`components.json`, `@/components/ui`, `cn()` in `src/lib/utils.ts`) |
| Icons | lucide-react |

## Develop

```bash
npm install
npm run dev        # http://localhost:5173/plaster/
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Structure

```
index.html              # Vite entry (meta, fonts, JSON-LD)
src/
  main.tsx              # imports index.css (Tailwind) + styles/legacy.css
  App.tsx               # composes all sections + scroll progress
  components/           # Header, Hero, About, Stats, Services, Projects, Why,
                        # Testimonials, Faq, Cta, Contact, Footer, CallBar
  components/motion.tsx # Reveal + stagger variants (Framer Motion)
  styles/legacy.css     # the original design system (reused verbatim)
  lib/                  # utils (cn), asset() helper
public/assets/          # logo, photos, video, favicon
.github/workflows/deploy.yml   # build + deploy to GitHub Pages
```

## Animations (Framer Motion)

- `Reveal` — scroll-triggered fade-up (`whileInView`)
- `staggerContainer` / `staggerItem` — staggered grid/list reveals
- `whileHover` lifts on service / project / testimonial cards
- Animated stat counters via `useInView` + `animate`
- Scroll progress bar via `useScroll`
- `MotionConfig reducedMotion="user"` respects `prefers-reduced-motion`

## Adding 21st.dev / shadcn components

Tailwind + shadcn are pre-configured (`components.json`, design tokens in
`src/index.css`, brand colors in `tailwind.config.js`). Add primitives with:

```bash
npx shadcn@latest add button card accordion
```

then paste 21st.dev component code into `src/components/`. Tailwind preflight is
**disabled** so the existing design is untouched; new components use Tailwind
utilities and the shadcn tokens.

## Deployment (GitHub Pages)

Deployed via GitHub Actions (`.github/workflows/deploy.yml`) — build `dist/` and
publish. **One-time setup:** in the repo go to **Settings → Pages → Build and
deployment → Source → "GitHub Actions"**. `vite.config.ts` sets `base: "/plaster/"`.

## Placeholders to confirm

Testimonials (sample quotes/names), footer social + Impressum/Datenschutz/AGB
links, and the contact form endpoint (currently a simulated submit in
`src/components/Contact.tsx`).
