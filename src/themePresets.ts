import type { SeasonalTheme } from './types';

export const themePresets: Record<string, SeasonalTheme> = {
  sakuraDream: {
    id: 'sakuraDream',
    label: 'Sakura Dream',
    background: {
      type: 'gradient',
      gradient:
        'radial-gradient(circle at 20% 20%, rgba(251,207,232,0.45), transparent 40%), linear-gradient(135deg, #2d1323 0%, #4a2138 50%, #1a0b14 100%)',
      fallbackColor: '#2d1323',
    },
    colors: {
      primaryAccent: '#f9a8d4',
      secondaryAccent: '#f472b6',
      particleColor: '#fbcfe8',
      textColor: '#fff1f2',
      controlBackground: 'rgba(74, 33, 56, 0.45)',
      controlText: '#fff1f2',
      controlBorder: 'rgba(249, 168, 212, 0.3)',
    },
    typography: {
      fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      headingSize: 'clamp(2.2rem, 6vw, 4.2rem)',
      bodySize: '1rem',
      fontWeight: '600',
    },
    effects: [
      { effect: 'sakura', particles: { density: 32, speed: 1.1, size: 22, opacity: 0.9, direction: 'down' } },
      { effect: 'sparkles', particles: { density: 16, speed: 0.8, size: 14, opacity: 0.7, direction: 'right' } },
    ],
  },

  cozyAutumn: {
    id: 'cozyAutumn',
    label: 'Cozy Autumn',
    background: {
      type: 'gradient',
      gradient:
        'radial-gradient(circle at 80% 20%, rgba(251,146,60,0.35), transparent 45%), linear-gradient(145deg, #241208 0%, #3e1e11 50%, #150a04 100%)',
      fallbackColor: '#241208',
    },
    colors: {
      primaryAccent: '#fb923c',
      secondaryAccent: '#ea580c',
      particleColor: '#fed7aa',
      textColor: '#ffedd5',
      controlBackground: 'rgba(62, 30, 17, 0.45)',
      controlText: '#ffedd5',
      controlBorder: 'rgba(251, 146, 60, 0.3)',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingSize: 'clamp(2rem, 6vw, 4rem)',
      bodySize: '0.95rem',
      fontWeight: '700',
    },
    effects: [
      { effect: 'leaves', particles: { density: 30, speed: 1.2, size: 20, opacity: 0.95, direction: 'down' } },
      { effect: 'rain', particles: { density: 25, speed: 1.4, size: 10, opacity: 0.5, direction: 'down' } },
    ],
  },

  midnightRain: {
    id: 'midnightRain',
    label: 'Midnight Rain',
    background: {
      type: 'gradient',
      gradient:
        'radial-gradient(circle at 50% 0%, rgba(56,189,248,0.25), transparent 50%), linear-gradient(160deg, #090e17 0%, #0f1c2e 50%, #06090f 100%)',
      fallbackColor: '#090e17',
    },
    colors: {
      primaryAccent: '#38bdf8',
      secondaryAccent: '#818cf8',
      particleColor: '#bae6fd',
      textColor: '#f0f9ff',
      controlBackground: 'rgba(15, 28, 46, 0.5)',
      controlText: '#f0f9ff',
      controlBorder: 'rgba(56, 189, 248, 0.3)',
    },
    typography: {
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      headingSize: 'clamp(2rem, 5.5vw, 3.8rem)',
      bodySize: '0.92rem',
      fontWeight: '600',
    },
    effects: [
      { effect: 'rain', particles: { density: 50, speed: 1.5, size: 14, opacity: 0.85, direction: 'down' } },
      { effect: 'sparkles', particles: { density: 12, speed: 0.7, size: 12, opacity: 0.6, direction: 'right' } },
    ],
  },

  winterSilence: {
    id: 'winterSilence',
    label: 'Winter Silence',
    background: {
      type: 'gradient',
      gradient:
        'radial-gradient(circle at 70% 15%, rgba(186,230,253,0.35), transparent 45%), linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #090d16 100%)',
      fallbackColor: '#0f172a',
    },
    colors: {
      primaryAccent: '#bae6fd',
      secondaryAccent: '#93c5fd',
      particleColor: '#ffffff',
      textColor: '#f8fafc',
      controlBackground: 'rgba(30, 41, 59, 0.5)',
      controlText: '#f8fafc',
      controlBorder: 'rgba(186, 230, 253, 0.3)',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      headingSize: 'clamp(2rem, 6vw, 4rem)',
      bodySize: '0.95rem',
      fontWeight: '600',
    },
    effects: [
      { effect: 'snow', particles: { density: 40, speed: 0.85, size: 16, opacity: 0.9, direction: 'down' } },
      { effect: 'sparkles', particles: { density: 15, speed: 0.6, size: 10, opacity: 0.75, direction: 'random' } },
    ],
  },

  goldenSummer: {
    id: 'goldenSummer',
    label: 'Golden Summer',
    background: {
      type: 'gradient',
      gradient:
        'radial-gradient(circle at 30% 20%, rgba(253,224,71,0.38), transparent 40%), linear-gradient(140deg, #172e21 0%, #224d35 50%, #0a1710 100%)',
      fallbackColor: '#172e21',
    },
    colors: {
      primaryAccent: '#fde047',
      secondaryAccent: '#4ade80',
      particleColor: '#fef08a',
      textColor: '#fefce8',
      controlBackground: 'rgba(34, 77, 53, 0.45)',
      controlText: '#fefce8',
      controlBorder: 'rgba(253, 224, 71, 0.3)',
    },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      headingSize: 'clamp(2rem, 6vw, 4rem)',
      bodySize: '0.95rem',
      fontWeight: '700',
    },
    effects: [
      { effect: 'sparkles', particles: { density: 35, speed: 1.1, size: 20, opacity: 0.9, direction: 'right' } },
    ],
  },

  fireflyGarden: {
    id: 'fireflyGarden',
    label: 'Firefly Garden',
    background: {
      type: 'gradient',
      gradient:
        'radial-gradient(circle at 20% 80%, rgba(190,242,100,0.28), transparent 40%), linear-gradient(150deg, #0c1322 0%, #111e33 50%, #060a12 100%)',
      fallbackColor: '#0c1322',
    },
    colors: {
      primaryAccent: '#bef264',
      secondaryAccent: '#a855f7',
      particleColor: '#d9f99d',
      textColor: '#f7fee7',
      controlBackground: 'rgba(17, 30, 51, 0.45)',
      controlText: '#f7fee7',
      controlBorder: 'rgba(190, 242, 100, 0.3)',
    },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      headingSize: 'clamp(2rem, 6vw, 4rem)',
      bodySize: '0.95rem',
      fontWeight: '600',
    },
    effects: [
      { effect: 'fireflies', particles: { density: 32, speed: 1, size: 18, opacity: 0.95, direction: 'random' } },
      { effect: 'sparkles', particles: { density: 16, speed: 0.7, size: 12, opacity: 0.65, direction: 'right' } },
    ],
  },
};
