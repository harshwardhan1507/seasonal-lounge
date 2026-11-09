import type { CSSProperties, ReactNode } from 'react';

export type SeasonalEffect =
  | 'leaves'
  | 'rain'
  | 'snow'
  | 'sparkles'
  | 'sakura'
  | 'fireflies'
  | 'none';

export type AudioSegment = {
  start: number;
  end: number;
};

export interface ParticleSettings {
  density?: number;
  speed?: number;
  size?: number;
  opacity?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'random';
}

export interface EffectLayer {
  effect: SeasonalEffect;
  particles?: ParticleSettings;
  accent?: string;
}

export interface SeasonalThemeBackground {
  type?: 'solid' | 'gradient';
  solidColor?: string;
  gradient?: string;
  gradientDirection?: string;
  gradientColors?: string[];
  fallbackColor?: string;
  videoUrl?: string;
}

export interface SeasonalThemeColors {
  primaryAccent?: string;
  secondaryAccent?: string;
  particleColor?: string;
  textColor?: string;
  controlBackground?: string;
  controlText?: string;
  controlBorder?: string;
}

export interface SeasonalThemeTypography {
  fontFamily?: string;
  headingSize?: string;
  bodySize?: string;
  fontWeight?: string | number;
}

export interface SeasonalTheme {
  id?: string;
  label?: string;
  background?: SeasonalThemeBackground;
  colors?: SeasonalThemeColors;
  typography?: SeasonalThemeTypography;
  effects?: EffectLayer[];
  disableParticles?: boolean;
}

export type SeasonDefinition = {
  id: string;
  label: string;
  description: string;
  videoSrc?: string;
  audioSrc?: string;
  audioSegment?: AudioSegment;
  effect?: SeasonalEffect;
  accent?: string;
  background?: string;
  symbol?: ReactNode;
  particles?: ParticleSettings;
  theme?: SeasonalTheme;
  effects?: EffectLayer[];
};

export type SeasonalLoungeProps = {
  seasons: SeasonDefinition[];
  initialSeasonId?: string;
  className?: string;
  volume?: number;
  allowFullscreen?: boolean;
  showAudioControl?: boolean;
  showSeasonPicker?: boolean;
  calmModeLabel?: string;
  onSeasonChange?: (season: SeasonDefinition) => void;
  style?: CSSProperties;
  theme?: SeasonalTheme;
};

export type SeasonalOverlayProps = {
  effect: SeasonalEffect;
  accent?: string;
  count?: number;
  className?: string;
  settings?: ParticleSettings;
  particles?: ParticleSettings;
};
