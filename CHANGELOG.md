# Changelog

All notable changes to this project will be documented here.

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
