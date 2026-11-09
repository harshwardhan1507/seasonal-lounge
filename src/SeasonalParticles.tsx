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

export function SeasonalParticles({ effect, accent, count, className = '' }: SeasonalOverlayProps) {
  if (effect === 'none') return null;
  const particleCount = count ?? (effect === 'rain' ? 42 : effect === 'sakura' ? 34 : 28);
  const effectSymbols = symbols[effect];

  return (
    <div
      className={`seasonal-lounge__particles ${className}`.trim()}
      style={{ '--seasonal-accent': accent ?? '#f9a8d4' } as CSSProperties}
      aria-hidden="true"
    >
      {Array.from({ length: particleCount }, (_, index) => {
        const style = {
          '--particle-left': `${(index * 41 + 7) % 100}%`,
          '--particle-top': `${8 + ((index * 31) % 78)}%`,
          '--particle-delay': `${-((index * 0.29) % 4.5)}s`,
          '--particle-duration': `${4.2 + (index % 8) * 0.58}s`,
          '--particle-drift': `${-65 + (index % 10) * 14}px`,
          '--particle-size': `${9 + (index % 6) * 2.5}px`,
        } as CSSProperties;

        return (
          <span
            key={index}
            style={style}
            className={`seasonal-lounge__particle seasonal-lounge__particle--${effect}`}
          >
            {effectSymbols[index % effectSymbols.length]}
          </span>
        );
      })}
    </div>
  );
}
