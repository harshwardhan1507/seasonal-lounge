import type { SeasonDefinition } from './types';

/**
 * The complete CSS-only season collection from the original portfolio Lounge.
 * Add `videoSrc`, `audioSrc`, or `audioSegment` in your app when you want media.
 */
export const seasonalPresets: SeasonDefinition[] = [
  {
    id: 'autumn',
    label: 'Autumn',
    description: 'Warm light, drifting leaves, and a mellow place to reset.',
    effect: 'leaves',
    accent: '#fb923c',
    background: 'radial-gradient(circle at 18% 12%, rgba(251,146,60,.32), transparent 34%), radial-gradient(circle at 82% 18%, rgba(190,24,93,.22), transparent 38%), linear-gradient(145deg, #23140e 0%, #3b1d12 48%, #11100e 100%)',
    symbol: '🍂',
  },
  {
    id: 'rain',
    label: 'Rain',
    description: 'A steady wash of rain softens the edges and slows the pace.',
    effect: 'rain',
    accent: '#7dd3fc',
    background: 'radial-gradient(circle at 50% -10%, rgba(125,211,252,.24), transparent 40%), linear-gradient(150deg, #14202b 0%, #182635 48%, #0b1118 100%)',
    symbol: '🌧️',
  },
  {
    id: 'winter',
    label: 'Winter',
    description: 'Slow snow and bright tones make room for a clean, quiet pause.',
    effect: 'snow',
    accent: '#bae6fd',
    background: 'radial-gradient(circle at 70% 10%, rgba(224,242,254,.28), transparent 36%), linear-gradient(145deg, #1d2b3b 0%, #2b4053 45%, #111b26 100%)',
    symbol: '❄️',
  },
  {
    id: 'summer',
    label: 'Summer',
    description: 'Golden light and warm air for an unhurried afternoon.',
    effect: 'sparkles',
    accent: '#fde047',
    background: 'radial-gradient(circle at 75% 8%, rgba(253,224,71,.38), transparent 30%), radial-gradient(circle at 12% 28%, rgba(34,197,94,.18), transparent 34%), linear-gradient(145deg, #18392f 0%, #315c43 44%, #10251f 100%)',
    symbol: '☀️',
  },
  {
    id: 'spring',
    label: 'Spring',
    description: 'Soft sakura, gentle color, and one quiet moment with nowhere else to be.',
    effect: 'sakura',
    accent: '#f9a8d4',
    background: 'radial-gradient(circle at 18% 10%, rgba(251,207,232,.34), transparent 35%), radial-gradient(circle at 82% 20%, rgba(244,114,182,.22), transparent 38%), linear-gradient(145deg, #3b2030 0%, #513147 48%, #171116 100%)',
    symbol: '🌸',
  },
  {
    id: 'night',
    label: 'Night',
    description: 'Deep tones and small firefly lights for a thoughtful late hour.',
    effect: 'fireflies',
    accent: '#bef264',
    background: 'radial-gradient(circle at 15% 15%, rgba(139,92,246,.26), transparent 34%), radial-gradient(circle at 75% 35%, rgba(34,197,94,.12), transparent 30%), linear-gradient(150deg, #111028 0%, #111827 52%, #080b12 100%)',
    symbol: '🌙',
  },
];
