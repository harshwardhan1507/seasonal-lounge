import { SeasonalLounge, type SeasonDefinition } from '@harshwardhan1507/seasonal-lounge';
import '@harshwardhan1507/seasonal-lounge/styles.css';

const seasons: SeasonDefinition[] = [
  {
    id: 'spring',
    label: 'Spring',
    description: 'Soft blossoms, gentle music, and a quiet moment.',
    videoSrc: '/media/spring.mp4',
    audioSrc: '/media/spring.mp3',
    audioSegment: { start: 23, end: 82 },
    effect: 'sakura',
    accent: '#f9a8d4',
    background: '#3b2030',
    symbol: '🌸',
    particles: {
      density: 36,
      speed: 1.2,
      size: 20,
      opacity: 0.9,
      direction: 'down',
    },
  },
  {
    id: 'rain',
    label: 'Rain',
    description: 'A steady wash of rain for a slower pace.',
    videoSrc: '/media/rain.mp4',
    audioSrc: '/media/rain.mp3',
    effect: 'rain',
    accent: '#7dd3fc',
    background: '#14202b',
    symbol: '🌧️',
  },
];

export function Example() {
  return <SeasonalLounge seasons={seasons} initialSeasonId="spring" />;
}
