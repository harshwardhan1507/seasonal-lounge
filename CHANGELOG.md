# Changelog

All notable changes to this project will be documented here.

## [1.4.0] - 2026-11-09

### Added

- Code Export and Installation Generator in the Visual Playground
- Dedicated Export & Install tab with live code preview and format switcher (React TSX, JSON Config, Installation)
- One-click "Copy TSX" generating standalone, fully-typed React components using the public package API
- "Download TSX" (`Atmosphere.tsx`) and "Download JSON" (`seasonal-atmosphere.json`) file exports
- Multi-package manager install command generation (supporting npm, pnpm, yarn, and bun)
- Safe string escaping for user-configured descriptions, symbols, gradients, and media URLs
- Developer guidance for media hosting and stylesheet imports
- Automated test coverage for TSX code generation, JSON serialization, escaping, and browser file downloads

## [1.3.0] - 2026-11-09

### Added

- Advanced Theme Builder system (`SeasonalTheme`, `SeasonalThemeBackground`, `SeasonalThemeColors`, `SeasonalThemeTypography`)
- Composable multi-layer effects architecture (`EffectLayer`) supporting combined atmospheric animations (e.g. Sakura + Sparkles, Leaves + Rain)
- Six curated theme presets: Sakura Dream, Cozy Autumn, Midnight Rain, Winter Silence, Golden Summer, and Firefly Garden
- Background configuration for solid colors, CSS gradients, fallback colors, and video URLs
- Color tokens for primary accent, secondary accent, particle color, text color, and control elements
- Typography settings for font family, heading size, body text size, and font weight via CSS variables
- Toggle for completely disabling particles (`disableParticles`)
- Three-tab visual playground organization: Particles, Theme & Colors, and Layered Effects
- Unit and integration tests for theme customization, layered rendering, and preset application

## [1.2.0] - 2026-11-09

### Added

- Interactive visual customization playground in the demo application
- Two-panel responsive workspace with live preview and real-time controls
- Responsive preview viewports: Desktop (100%), Tablet (768px), and Mobile (390px)
- Live sliders for particle density, speed multiplier, particle size, opacity, and direction
- Quick actions: Copy React Component code, Copy Configuration JSON, and Copy Install Command
- Clipboard feedback toast and reset-to-defaults functionality
- Comprehensive test suite for playground controls, clipboard operations, and code generation

## [1.1.0] - 2026-11-09

### Added

- Customizable particle settings (`ParticleSettings`) per season and on `SeasonalParticles`
- Configurable `density` (0 to 100 particles) with zero-DOM optimization for density 0
- Configurable `speed` multiplier (0.25x to 3x) for duration and delay
- Configurable `size` in pixels with effect-specific proportions
- Configurable `opacity` (0 to 1) with keyframe preservation
- Directional particle animations: `up`, `down`, `left`, `right`, and `random`
- Automated test suite for particle settings, boundaries, SSR compatibility, and motion preferences

## [0.2.0] - 2026-11-09

### Added

- Ready-to-use CSS-only presets for every portfolio season
- Autumn leaves, Rain, Winter snow, Summer sparkles, Spring sakura, and Night fireflies in the live demo
- Preset quick-start and season reference in the README

## [0.1.0] - 2026-11-09

### Added

- Configurable React seasonal lounge
- Optional video and ambient audio
- Exact audio highlight loops
- Sakura, leaves, rain, snow, sparkles, and fireflies
- Native full-screen calm mode with a fallback
- Responsive CSS-only demo
- TypeScript declarations and reduced-motion support
