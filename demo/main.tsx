import React from 'react';
import ReactDOM from 'react-dom/client';
import { SeasonalLounge } from '../src/SeasonalLounge';
import type { SeasonDefinition } from '../src/types';
import '../src/styles.css';
import './page.css';

const seasons: SeasonDefinition[] = [
  {
    id: 'spring',
    label: 'Spring',
    description: 'Soft sakura, gentle color, and one quiet moment with nowhere else to be.',
    effect: 'sakura',
    accent: '#f9a8d4',
    background: 'radial-gradient(circle at 22% 18%, rgba(251,207,232,.36), transparent 32%), radial-gradient(circle at 78% 24%, rgba(244,114,182,.24), transparent 34%), linear-gradient(145deg, #4b243c, #291420 58%, #100a0f)',
    symbol: '🌸',
  },
  {
    id: 'rain',
    label: 'Rain',
    description: 'A steady wash of rain for a slower, quieter pace.',
    effect: 'rain',
    accent: '#7dd3fc',
    background: 'radial-gradient(circle at 50% 0%, rgba(125,211,252,.25), transparent 36%), linear-gradient(145deg, #172936, #0b1118)',
    symbol: '🌧️',
  },
  {
    id: 'night',
    label: 'Night',
    description: 'Fireflies and deep tones for the last thoughtful hour of the day.',
    effect: 'fireflies',
    accent: '#bef264',
    background: 'radial-gradient(circle at 16% 12%, rgba(139,92,246,.25), transparent 34%), linear-gradient(145deg, #111028, #070a10)',
    symbol: '🌙',
  },
];

function Demo() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div>
          <span className="demo-kicker">Open-source React component</span>
          <h1>Seasonal Lounge</h1>
        </div>
        <a href="https://github.com/harshwardhan1507/seasonal-lounge">View on GitHub ↗</a>
      </header>
      <SeasonalLounge seasons={seasons} initialSeasonId="spring" showAudioControl={false} />
      <p className="demo-caption">Bring your own licensed media—or create a calm, CSS-only scene.</p>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Demo /></React.StrictMode>,
);
