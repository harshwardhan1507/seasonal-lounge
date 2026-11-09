import React from 'react';
import ReactDOM from 'react-dom/client';
import { Playground } from './Playground';
import '../src/styles.css';
import './page.css';

export function Demo() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div>
          <span className="demo-kicker">Interactive Visual Playground</span>
          <h1>Seasonal Lounge</h1>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a
            href="https://github.com/harshwardhan1507/seasonal-lounge"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <a
            href="https://www.npmjs.com/package/@harutoxokura/seasonal-lounge"
            target="_blank"
            rel="noreferrer"
          >
            npm ↗
          </a>
        </div>
      </header>

      <Playground />

      <footer className="demo-footer">
        <p className="demo-caption">
          Bring your own licensed media—or craft a calm, CSS-only ambient atmosphere with real-time particle customization.
        </p>
        <p className="demo-credit">
          Designed and developed by{' '}
          <a href="https://harshwardhanportfolio.vercel.app" target="_blank" rel="noreferrer">
            Harsh Wardhan
          </a>
        </p>
      </footer>
    </main>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Demo />
    </React.StrictMode>,
  );
}
