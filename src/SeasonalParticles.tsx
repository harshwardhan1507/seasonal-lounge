import type { CSSProperties } from 'react';
import type { SeasonalOverlayProps } from './types';

const symbols = {
  leaves: ['🍁', '🍂'],
  sakura: ['🌸', '·', '🌸'],
  sparkles: ['✦'],
  rain: [''],
  snow: [''],
  fireflies: [''],
  none: [''],
} satisfies Record<string, string[]>;

export function clamp(val: number, min: number, max: number): number {
  if (!Number.isFinite(val)) return min;
  return Math.min(max, Math.max(min, val));
}

const VALID_DIRECTIONS = ['up', 'down', 'left', 'right', 'random'] as const;

export function SeasonalParticles({
  effect,
  accent,
  count,
  className = '',
  settings,
  particles,
}: SeasonalOverlayProps) {
  if (effect === 'none') return null;

  const actualSettings = settings ?? particles;
  const defaultCount = effect === 'rain' ? 42 : effect === 'sakura' ? 34 : 28;

  let particleCount = defaultCount;
  if (actualSettings?.density !== undefined) {
    particleCount = Math.round(clamp(actualSettings.density, 0, 100));
  } else if (count !== undefined) {
    particleCount = Math.max(0, Math.round(count));
  }

  if (particleCount <= 0) return null;

  const effectSymbols = symbols[effect] ?? [''];
  const speedMultiplier = actualSettings?.speed !== undefined ? clamp(actualSettings.speed, 0.25, 3) : 1;
  const customSize = actualSettings?.size !== undefined ? clamp(actualSettings.size, 1, 120) : undefined;
  const customOpacity = actualSettings?.opacity !== undefined ? clamp(actualSettings.opacity, 0, 1) : undefined;
  const direction =
    actualSettings?.direction && VALID_DIRECTIONS.includes(actualSettings.direction)
      ? actualSettings.direction
      : undefined;

  const containerClasses = [
    'seasonal-lounge__particles',
    direction ? `seasonal-lounge__particles--dir-${direction}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerStyle: CSSProperties = {
    '--seasonal-accent': accent ?? '#f9a8d4',
    ...(customOpacity !== undefined ? { opacity: customOpacity, '--particle-opacity': customOpacity } : {}),
  } as CSSProperties;

  return (
    <div
      className={containerClasses}
      style={containerStyle}
      aria-hidden="true"
      data-testid="seasonal-particles"
      data-direction={direction}
    >
      {Array.from({ length: particleCount }, (_, index) => {
        const durationSec = (4.2 + (index % 8) * 0.58) / speedMultiplier;
        const delaySec = -((index * 0.29) % 4.5) / speedMultiplier;
        const sizePx = customSize !== undefined ? customSize : 9 + (index % 6) * 2.5;

        const style = {
          '--particle-left': `${(index * 41 + 7) % 100}%`,
          '--particle-top': `${8 + ((index * 31) % 78)}%`,
          '--particle-delay': `${delaySec.toFixed(2)}s`,
          '--particle-duration': `${durationSec.toFixed(2)}s`,
          '--particle-drift': `${-65 + (index % 10) * 14}px`,
          '--particle-size': `${sizePx}px`,
        } as CSSProperties;

        const particleClass = [
          'seasonal-lounge__particle',
          `seasonal-lounge__particle--${effect}`,
          direction ? `seasonal-lounge__particle--dir-${direction}` : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <span
            key={index}
            style={style}
            className={particleClass}
            data-testid={`seasonal-particle-${index}`}
          >
            {effectSymbols[index % effectSymbols.length]}
          </span>
        );
      })}
    </div>
  );
}
