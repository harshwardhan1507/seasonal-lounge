import type { SeasonDefinition, ParticleSettings } from '../src/types';

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

export function generateConfigObject(season: SeasonDefinition, particles: ParticleSettings) {
  return {
    ...season,
    particles,
  };
}

export function generateConfigCode(season: SeasonDefinition, particles: ParticleSettings): string {
  const config = generateConfigObject(season, particles);
  return JSON.stringify(config, null, 2);
}

export function generateReactCode(season: SeasonDefinition, particles: ParticleSettings): string {
  const symbolStr = typeof season.symbol === 'string' ? `'${season.symbol}'` : "'🌸'";
  const particlesJson = JSON.stringify(particles, null, 4)
    .split('\n')
    .map((line, idx) => (idx === 0 ? line : `    ${line}`))
    .join('\n');

  return `import { SeasonalLounge, type SeasonDefinition } from '@harshwardhan1507/seasonal-lounge';
import '@harshwardhan1507/seasonal-lounge/styles.css';

const seasons: SeasonDefinition[] = [
  {
    id: '${season.id}',
    label: '${season.label}',
    description: '${season.description.replace(/'/g, "\\'")}',
    effect: '${season.effect ?? 'none'}',
    accent: '${season.accent ?? '#f9a8d4'}',
    background: '${(season.background ?? '').replace(/'/g, "\\'")}',
    symbol: ${symbolStr},
    particles: ${particlesJson},
  },
];

export function Atmosphere() {
  return (
    <div style={{ width: '100%', minHeight: '36rem' }}>
      <SeasonalLounge
        seasons={seasons}
        initialSeasonId="${season.id}"
      />
    </div>
  );
}
`;
}
