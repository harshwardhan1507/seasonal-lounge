# Seasonal Lounge

[![CI](https://github.com/harshwardhan1507/seasonal-lounge/actions/workflows/ci.yml/badge.svg)](https://github.com/harshwardhan1507/seasonal-lounge/actions/workflows/ci.yml)
[![Demo](https://img.shields.io/badge/demo-GitHub%20Pages-f9a8d4)](https://harshwardhan1507.github.io/seasonal-lounge/)
[![License: MIT](https://img.shields.io/badge/license-MIT-7dd3fc.svg)](./LICENSE)

A configurable React lounge for seasonal video scenes, ambient audio highlights, particle effects, and a distraction-free full-screen calm mode.

![Seasonal Lounge spring preview](./docs/seasonal-lounge-preview.png)

Seasonal Lounge grew out of the interactive Lounge in [Harsh Wardhan's portfolio](https://harshwardhanportfolio.vercel.app). The library keeps the reusable experience while leaving all media choices to the application using it.

**[View the live demo →](https://harshwardhan1507.github.io/seasonal-lounge/)**

## Features

- Seasonal video backgrounds
- Optional ambient audio
- Highlight loops using exact start and end times
- Sakura, leaves, rain, snow, sparkles, and fireflies
- Native full-screen mode with a fixed-position fallback
- Automatic muted video playback
- Responsive layout and accessible controls
- Reduced-motion support
- TypeScript definitions
- No bundled music or video

## Installation

```bash
npm install @harshwardhan1507/seasonal-lounge
```

Then import the component and styles:

```tsx
import {
  SeasonalLounge,
  type SeasonDefinition,
} from '@harshwardhan1507/seasonal-lounge';
import '@harshwardhan1507/seasonal-lounge/styles.css';

const seasons: SeasonDefinition[] = [
  {
    id: 'spring',
    label: 'Spring',
    description: 'Soft blossoms, gentle music, and a quiet moment.',
    videoSrc: '/media/spring.mp4',
    audioSrc: '/media/spring.mp3',
    audioSegment: { start: 23, end: 82 },
    effect: 'sakura',
    accent: '#f9a8d4',
    background: '#3b2030',
    symbol: '🌸',
  },
];

export function RestSpace() {
  return <SeasonalLounge seasons={seasons} initialSeasonId="spring" />;
}
```

## Season configuration

| Property | Required | Description |
| --- | --- | --- |
| `id` | Yes | Stable season identifier |
| `label` | Yes | User-facing season name |
| `description` | Yes | Calm-space copy |
| `videoSrc` | No | Application-owned or licensed video URL; omit it for a CSS-only scene |
| `audioSrc` | No | Application-owned or licensed audio URL |
| `audioSegment` | No | Highlight loop `{ start, end }` in seconds |
| `effect` | No | `leaves`, `rain`, `snow`, `sparkles`, `sakura`, `fireflies`, or `none` |
| `accent` | No | Particle and selection color |
| `background` | No | CSS background used while media loads |
| `symbol` | No | Emoji, icon, or any React node |

## Props

`SeasonalLounge` accepts:

- `seasons` — array of season definitions
- `initialSeasonId` — initially selected season
- `volume` — audio volume from `0` to `1` (default `0.42`)
- `allowFullscreen` — enable calm mode (default `true`)
- `showAudioControl` — show the sound button (default `true`)
- `showSeasonPicker` — show season choices (default `true`)
- `calmModeLabel` — customize the full-screen button label
- `onSeasonChange` — receive the newly selected season
- `className` and `style` — customize the root element

## Media and licensing

This package intentionally contains **no music, photos, or video**. Add only media that you created, licensed, or have permission to redistribute. The MIT license covers the source code in this repository, not media supplied by applications using the package.

## Local development

```bash
npm install
npm run check
npm run build
npm run pack:dry
```

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a change and follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © 2026 Harsh Wardhan
