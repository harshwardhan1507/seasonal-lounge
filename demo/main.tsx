import React from 'react';
import ReactDOM from 'react-dom/client';
import { SeasonalLounge } from '../src/SeasonalLounge';
import { seasonalPresets } from '../src/presets';
import '../src/styles.css';
import './page.css';

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
      <SeasonalLounge seasons={seasonalPresets} initialSeasonId="spring" showAudioControl={false} />
      <p className="demo-caption">Bring your own licensed media—or create a calm, CSS-only scene.</p>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Demo /></React.StrictMode>,
);
