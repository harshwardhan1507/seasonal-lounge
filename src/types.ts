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
};

export type SeasonalOverlayProps = {
  effect: SeasonalEffect;
  accent?: string;
  count?: number;
  className?: string;
  settings?: ParticleSettings;
  particles?: ParticleSettings;
};
