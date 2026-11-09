import { useState, useMemo, useEffect, useRef } from 'react';
import { SeasonalLounge } from '../src/SeasonalLounge';
import { seasonalPresets } from '../src/presets';
import type { SeasonDefinition, ParticleSettings } from '../src/types';
import { generateReactCode, generateConfigCode, getInstallCommand } from './codeGenerator';
import './playground.css';

const DEFAULT_PARTICLES: ParticleSettings = {
  density: 35,
  speed: 1,
  size: 16,
  opacity: 0.9,
  direction: 'down',
};

export function Playground() {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('spring');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [particles, setParticles] = useState<ParticleSettings>(DEFAULT_PARTICLES);
  const [feedback, setFeedback] = useState<string | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const baseSeason = useMemo(
    () => seasonalPresets.find((s) => s.id === selectedSeasonId) ?? seasonalPresets[0],
    [selectedSeasonId],
  );

  // Rebuild the seasons array with the customized particle settings for the active season
  const configuredSeasons = useMemo(() => {
    return seasonalPresets.map((season) => {
      if (season.id === selectedSeasonId) {
        return {
          ...season,
          particles,
        };
      }
      return season;
    });
  }, [selectedSeasonId, particles]);

  const activeCustomSeason = useMemo(() => {
    return {
      ...baseSeason,
      particles,
    };
  }, [baseSeason, particles]);

  const showFeedback = (message: string) => {
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    setFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showFeedback(`✓ ${label} copied to clipboard!`);
    } catch {
      // Fallback
      showFeedback(`Failed to copy to clipboard`);
    }
  };

  const resetDefaults = () => {
    setParticles(DEFAULT_PARTICLES);
    showFeedback('✓ Particle settings reset to defaults');
  };

  return (
    <div className="playground-container" data-testid="visual-playground">
      {/* Left panel: Live preview */}
      <div className="playground-preview-panel">
        <div className="preview-toolbar" role="toolbar" aria-label="Preview viewport controls">
          <div className="viewport-toggle-group">
            <button
              type="button"
              className={`viewport-btn ${viewport === 'desktop' ? 'viewport-btn--active' : ''}`}
              onClick={() => setViewport('desktop')}
              aria-label="Desktop viewport"
            >
              Desktop
            </button>
            <button
              type="button"
              className={`viewport-btn ${viewport === 'tablet' ? 'viewport-btn--active' : ''}`}
              onClick={() => setViewport('tablet')}
              aria-label="Tablet viewport (768px)"
            >
              Tablet
            </button>
            <button
              type="button"
              className={`viewport-btn ${viewport === 'mobile' ? 'viewport-btn--active' : ''}`}
              onClick={() => setViewport('mobile')}
              aria-label="Mobile viewport (390px)"
            >
              Mobile
            </button>
          </div>
          <span className="preview-badge">Live Interactive Component</span>
        </div>

        <div className={`preview-stage preview-stage--${viewport}`}>
          <SeasonalLounge
            key={`${selectedSeasonId}-${JSON.stringify(particles)}`}
            seasons={configuredSeasons}
            initialSeasonId={selectedSeasonId}
            onSeasonChange={(s: SeasonDefinition) => setSelectedSeasonId(s.id)}
            showAudioControl={false}
          />
        </div>
      </div>

      {/* Right panel: Customization controls */}
      <div className="playground-controls-panel" role="region" aria-label="Atmosphere Customization Controls">
        <div className="controls-header">
          <h2>Customization Controls</h2>
          <button
            type="button"
            className="reset-btn"
            onClick={resetDefaults}
            aria-label="Reset particle controls to default values"
          >
            Reset Defaults
          </button>
        </div>

        {/* Season Selection */}
        <div className="control-section">
          <h3 className="control-section-title">Select Season</h3>
          <div className="control-season-grid" role="group" aria-label="Select season preset">
            {seasonalPresets.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`season-btn-card ${s.id === selectedSeasonId ? 'season-btn-card--active' : ''}`}
                style={s.id === selectedSeasonId ? { borderColor: s.accent } : undefined}
                onClick={() => setSelectedSeasonId(s.id)}
                aria-pressed={s.id === selectedSeasonId}
              >
                <span>{s.symbol}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Particle Settings Controls */}
        <div className="control-section">
          <h3 className="control-section-title">Particle Configuration</h3>

          {/* Density */}
          <div className="control-field">
            <div className="control-field-top">
              <label htmlFor="particle-density" className="control-label">
                Density
              </label>
              <span className="control-value-badge" data-testid="density-val">
                {particles.density}
              </span>
            </div>
            <input
              id="particle-density"
              type="range"
              min="0"
              max="100"
              step="1"
              value={particles.density ?? 35}
              onChange={(e) => setParticles((p) => ({ ...p, density: Number(e.target.value) }))}
              className="control-slider"
              aria-label="Particle density"
            />
          </div>

          {/* Speed */}
          <div className="control-field">
            <div className="control-field-top">
              <label htmlFor="particle-speed" className="control-label">
                Speed Multiplier
              </label>
              <span className="control-value-badge" data-testid="speed-val">
                {(particles.speed ?? 1).toFixed(2)}x
              </span>
            </div>
            <input
              id="particle-speed"
              type="range"
              min="0.25"
              max="3"
              step="0.05"
              value={particles.speed ?? 1}
              onChange={(e) => setParticles((p) => ({ ...p, speed: Number(e.target.value) }))}
              className="control-slider"
              aria-label="Particle speed multiplier"
            />
          </div>

          {/* Size */}
          <div className="control-field">
            <div className="control-field-top">
              <label htmlFor="particle-size" className="control-label">
                Particle Size
              </label>
              <span className="control-value-badge" data-testid="size-val">
                {particles.size}px
              </span>
            </div>
            <input
              id="particle-size"
              type="range"
              min="4"
              max="60"
              step="1"
              value={particles.size ?? 16}
              onChange={(e) => setParticles((p) => ({ ...p, size: Number(e.target.value) }))}
              className="control-slider"
              aria-label="Particle size in pixels"
            />
          </div>

          {/* Opacity */}
          <div className="control-field">
            <div className="control-field-top">
              <label htmlFor="particle-opacity" className="control-label">
                Opacity
              </label>
              <span className="control-value-badge" data-testid="opacity-val">
                {(particles.opacity ?? 0.9).toFixed(2)}
              </span>
            </div>
            <input
              id="particle-opacity"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={particles.opacity ?? 0.9}
              onChange={(e) => setParticles((p) => ({ ...p, opacity: Number(e.target.value) }))}
              className="control-slider"
              aria-label="Particle opacity"
            />
          </div>

          {/* Direction */}
          <div className="control-field">
            <div className="control-field-top">
              <label htmlFor="particle-direction" className="control-label">
                Movement Direction
              </label>
            </div>
            <select
              id="particle-direction"
              value={particles.direction ?? 'down'}
              onChange={(e) =>
                setParticles((p) => ({
                  ...p,
                  direction: e.target.value as ParticleSettings['direction'],
                }))
              }
              className="control-select"
              aria-label="Particle movement direction"
            >
              <option value="down">Down (Falling)</option>
              <option value="up">Up (Rising)</option>
              <option value="left">Left (Drifting West)</option>
              <option value="right">Right (Drifting East)</option>
              <option value="random">Random (Floating)</option>
            </select>
          </div>
        </div>

        {/* Copy & Export Actions */}
        <div className="control-actions-grid">
          <button
            type="button"
            className="action-btn action-btn--primary"
            onClick={() => copyToClipboard(generateReactCode(activeCustomSeason, particles), 'React Component')}
          >
            📋 Copy React Code
          </button>
          <button
            type="button"
            className="action-btn action-btn--secondary"
            onClick={() => copyToClipboard(generateConfigCode(activeCustomSeason, particles), 'Configuration JSON')}
          >
            ⚙️ Copy Configuration
          </button>
          <button
            type="button"
            className="action-btn action-btn--secondary"
            onClick={() => copyToClipboard(getInstallCommand('npm'), 'Install Command')}
          >
            📦 Copy Installation Command
          </button>

          <div className="action-feedback" role="status" aria-live="polite">
            {feedback ?? ''}
          </div>
        </div>
      </div>
    </div>
  );
}
