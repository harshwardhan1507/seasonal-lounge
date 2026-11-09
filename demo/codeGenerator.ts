import type { SeasonDefinition, ParticleSettings, SeasonalTheme, EffectLayer } from '../src/types';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
export type InstallationMethod = 'npm' | 'shadcn';

export const REGISTRY_URL = 'https://seasonal-lounge.vercel.app/registry/seasonal-lounge.json';
export const REGISTRY_RAW_GITHUB_URL =
  'https://raw.githubusercontent.com/harshwardhan1507/seasonal-lounge/main/registry/seasonal-lounge.json';

export function getInstallCommand(pm: PackageManager = 'npm'): string {
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

export function getShadcnCommand(source: 'hosted' | 'github' = 'hosted'): string {
  const targetUrl = source === 'hosted' ? REGISTRY_URL : REGISTRY_RAW_GITHUB_URL;
  return `npx shadcn@latest add ${targetUrl}`;
}

export function escapeJsString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

export function generateConfigObject(
  season: SeasonDefinition,
  particles?: ParticleSettings,
  theme?: SeasonalTheme,
  effects?: EffectLayer[],
) {
  return {
    id: season.id,
    label: season.label,
    description: season.description,
    effect: season.effect ?? 'none',
    accent: season.accent ?? '#f9a8d4',
    background: season.background,
    videoSrc: season.videoSrc,
    audioSrc: season.audioSrc,
    audioSegment: season.audioSegment,
    ...(particles ? { particles } : {}),
    ...(effects && effects.length > 0 ? { effects } : {}),
    ...(theme ? { theme } : {}),
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
  installMethod: InstallationMethod = 'npm',
): string {
  const symbolStr = typeof season.symbol === 'string' ? `'${escapeJsString(season.symbol)}'` : "'🌸'";
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

  const videoSrcSection = config.videoSrc
    ? `\n    videoSrc: '${escapeJsString(config.videoSrc)}',`
    : '';

  const audioSrcSection = config.audioSrc
    ? `\n    audioSrc: '${escapeJsString(config.audioSrc)}',`
    : '';

  const imports =
    installMethod === 'shadcn'
      ? `import React from 'react';
import { SeasonalLounge, type SeasonDefinition } from '@/components/seasonal-lounge';
import '@/components/seasonal-lounge/styles.css';`
      : `import React from 'react';
import { SeasonalLounge, type SeasonDefinition } from '@harshwardhan1507/seasonal-lounge';
import '@harshwardhan1507/seasonal-lounge/styles.css';`;

  return `${imports}

/**
 * Custom Seasonal Lounge atmosphere component.
 * If you use custom videoSrc or audioSrc, ensure the media files are hosted in your app's public/ folder or CDN.
 */
export const atmosphereSeasons: SeasonDefinition[] = [
  {
    id: '${escapeJsString(config.id)}',
    label: '${escapeJsString(config.label)}',
    description: '${escapeJsString(config.description)}',
    effect: '${config.effect ?? 'none'}',
    accent: '${escapeJsString(config.accent ?? '#f9a8d4')}',
    background: '${escapeJsString(config.background ?? '')}',
    symbol: ${symbolStr},${videoSrcSection}${audioSrcSection}${particlesSection}${effectsSection}${themeSection}
  },
];

export function Atmosphere() {
  return (
    <div style={{ width: '100%', minHeight: '36rem' }}>
      <SeasonalLounge
        seasons={atmosphereSeasons}
        initialSeasonId="${escapeJsString(config.id)}"
      />
    </div>
  );
}

export default Atmosphere;
`;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  if (typeof window === 'undefined' || !window.URL) return;
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
