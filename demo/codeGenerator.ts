import type { SeasonDefinition, ParticleSettings, SeasonalTheme, EffectLayer } from '../src/types';

export function getInstallCommand(pm: 'npm' | 'pnpm' | 'yarn' | 'bun' = 'npm'): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm add @harshwardhan1507/seasonal-lounge';
    case 'yarn':
      return 'yarn add @harshwardhan1507/seasonal-lounge';
    case 'bun':
      return 'bun add @harshwardhan1507/seasonal-lounge';
    case 'npm':
    default:
      return 'npm install @harshwardhan1507/seasonal-lounge';
  }
}

export function generateConfigObject(
  season: SeasonDefinition,
  particles?: ParticleSettings,
  theme?: SeasonalTheme,
  effects?: EffectLayer[],
) {
  return {
    ...season,
    ...(particles ? { particles } : {}),
    ...(theme ? { theme } : {}),
    ...(effects && effects.length > 0 ? { effects } : {}),
  };
}

export function generateConfigCode(
  season: SeasonDefinition,
  particles?: ParticleSettings,
  theme?: SeasonalTheme,
  effects?: EffectLayer[],
): string {
  const config = generateConfigObject(season, particles, theme, effects);
  return JSON.stringify(config, null, 2);
}

export function generateReactCode(
  season: SeasonDefinition,
  particles?: ParticleSettings,
  theme?: SeasonalTheme,
  effects?: EffectLayer[],
): string {
  const symbolStr = typeof season.symbol === 'string' ? `'${season.symbol}'` : "'🌸'";
  const config = generateConfigObject(season, particles, theme, effects);

  const particlesSection = config.particles
    ? `\n    particles: ${JSON.stringify(config.particles, null, 4).replace(/\n/g, '\n    ')},`
    : '';

  const effectsSection = config.effects && config.effects.length > 0
    ? `\n    effects: ${JSON.stringify(config.effects, null, 4).replace(/\n/g, '\n    ')},`
    : '';

  const themeSection = config.theme
    ? `\n    theme: ${JSON.stringify(config.theme, null, 4).replace(/\n/g, '\n    ')},`
    : '';

  return `import { SeasonalLounge, type SeasonDefinition } from '@harshwardhan1507/seasonal-lounge';
import '@harshwardhan1507/seasonal-lounge/styles.css';

const seasons: SeasonDefinition[] = [
  {
    id: '${config.id}',
    label: '${config.label}',
    description: '${config.description.replace(/'/g, "\\'")}',
    effect: '${config.effect ?? 'none'}',
    accent: '${config.accent ?? '#f9a8d4'}',
    background: '${(config.background ?? '').replace(/'/g, "\\'")}',
    symbol: ${symbolStr},${particlesSection}${effectsSection}${themeSection}
  },
];

export function Atmosphere() {
  return (
    <div style={{ width: '100%', minHeight: '36rem' }}>
      <SeasonalLounge
        seasons={seasons}
        initialSeasonId="${config.id}"
      />
    </div>
  );
}
`;
}
