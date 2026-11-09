# Installation Guide: Seasonal Lounge

Seasonal Lounge provides two flexible installation methods depending on your application's architecture and customization needs:

1. **npm Package Installation** — Install precompiled library via npm (recommended for fast setup and effortless future updates).
2. **shadcn-Style Source Installation** — Copy the component source directly into your codebase (recommended if you want to inspect, refactor, or tailor internal styling and particle animation logic).

---

## Comparison

| Feature | npm Package (`@harshwardhan1507/seasonal-lounge`) | Source Code (shadcn registry) |
| --- | --- | --- |
| **Setup Speed** | Instant (`npm install`) | Instant (`npx shadcn add`) |
| **Location** | `node_modules` | `components/seasonal-lounge/` |
| **Upgrades** | Simple `npm update` | Manually managed |
| **Direct Code Modification** | No (read-only in node_modules) | **Yes** (full source ownership) |
| **Custom Styling / CSS** | CSS variables & props | CSS variables + direct CSS edit |
| **Bundle Impact** | Tree-shakeable ESM | Direct application source |
| **Dependencies** | React >= 18 | React >= 18 |

---

## Method 1: Install via npm (Standard)

### 1. Install the package

```bash
# npm
npm install @harshwardhan1507/seasonal-lounge

# pnpm
pnpm add @harshwardhan1507/seasonal-lounge

# yarn
yarn add @harshwardhan1507/seasonal-lounge

# bun
bun add @harshwardhan1507/seasonal-lounge
```

### 2. Import component and styles

```tsx
import { SeasonalLounge, seasonalPresets } from '@harshwardhan1507/seasonal-lounge';
import '@harshwardhan1507/seasonal-lounge/styles.css';

export function App() {
  return (
    <SeasonalLounge
      seasons={seasonalPresets}
      initialSeasonId="spring"
    />
  );
}
```

---

## Method 2: Install Source Component (shadcn-Style Registry)

Seasonal Lounge provides a registry item compliant with the official [shadcn registry schema](https://ui.shadcn.com/schema/registry-item.json).

### 1. Run the shadcn CLI command

Using the hosted production registry:

```bash
npx shadcn@latest add https://seasonal-lounge.vercel.app/registry/seasonal-lounge.json
```

Or using the GitHub raw repository URL:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/harshwardhan1507/seasonal-lounge/main/registry/seasonal-lounge.json
```

### 2. What files are installed?

The CLI copies the complete self-contained component source into `components/seasonal-lounge/`:

```
components/seasonal-lounge/
├── SeasonalLounge.tsx      # Main lounge component
├── SeasonalParticles.tsx   # Configurable particle engine
├── audio.ts               # Ambient audio loop controller
├── presets.ts             # 6 portfolio seasonal presets
├── themePresets.ts        # 6 curated aesthetic themes
├── types.ts               # TypeScript interfaces
├── styles.css             # Responsive CSS animations
└── index.ts               # Local export barrel
```

### 3. Usage in your app

```tsx
import { SeasonalLounge, seasonalPresets, themePresets } from '@/components/seasonal-lounge';
import '@/components/seasonal-lounge/styles.css';

export function Atmosphere() {
  return (
    <SeasonalLounge
      seasons={seasonalPresets}
      theme={themePresets.sakuraDream}
    />
  );
}
```

---

## Media and Assets Guidance

Seasonal Lounge presets are completely CSS-only by default and require no media downloads.

If you choose to attach custom ambient video scenes or soundtrack audio loops:
- Place video files (e.g. `spring.mp4`) in your application's `public/media/` directory or asset CDN.
- Reference them via standard URLs: `videoSrc: '/media/spring.mp4'`.
