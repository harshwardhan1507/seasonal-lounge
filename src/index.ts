import './styles.css';

export { SeasonalLounge } from './SeasonalLounge';
export { SeasonalParticles, clamp } from './SeasonalParticles';
export { configureSegmentedAudio, validateAudioSegment } from './audio';
export { seasonalPresets } from './presets';
export { themePresets } from './themePresets';
export type {
  AudioSegment,
  EffectLayer,
  ParticleSettings,
  SeasonDefinition,
  SeasonalEffect,
  SeasonalLoungeProps,
  SeasonalOverlayProps,
  SeasonalTheme,
  SeasonalThemeBackground,
  SeasonalThemeColors,
  SeasonalThemeTypography,
} from './types';
