import { useState, useMemo, useEffect, useRef } from 'react';
import { SeasonalLounge } from '../src/SeasonalLounge';
import { seasonalPresets } from '../src/presets';
import { themePresets } from '../src/themePresets';
import type { SeasonDefinition, ParticleSettings, SeasonalTheme, EffectLayer, SeasonalEffect } from '../src/types';
import {
  generateReactCode,
  generateConfigCode,
  getInstallCommand,
  getShadcnCommand,
  downloadFile,
  type PackageManager,
  type InstallationMethod,
} from './codeGenerator';
import './playground.css';

const DEFAULT_PARTICLES: ParticleSettings = {
  density: 35,
  speed: 1,
  size: 16,
  opacity: 0.9,
  direction: 'down',
};

const DEFAULT_THEME: SeasonalTheme = {
  background: {
    type: 'gradient',
    fallbackColor: '#24141f',
  },
  colors: {
    primaryAccent: '#f9a8d4',
    secondaryAccent: '#f472b6',
    particleColor: '#f9a8d4',
    textColor: '#ffffff',
    controlBackground: 'rgba(0, 0, 0, 0.36)',
    controlText: '#ffffff',
    controlBorder: 'rgba(255, 255, 255, 0.2)',
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    headingSize: 'clamp(2rem, 6vw, 4rem)',
    bodySize: '0.95rem',
    fontWeight: '700',
  },
  disableParticles: false,
};

export function Playground() {
  const [activeTab, setActiveTab] = useState<'particles' | 'theme' | 'effects' | 'export'>('particles');
  const [exportFormat, setExportFormat] = useState<'tsx' | 'json' | 'install'>('tsx');
  const [installMethod, setInstallMethod] = useState<InstallationMethod>('npm');
  const [packageManager, setPackageManager] = useState<PackageManager>('npm');
  const [shadcnSource, setShadcnSource] = useState<'hosted' | 'github'>('hosted');
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('spring');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [particles, setParticles] = useState<ParticleSettings>(DEFAULT_PARTICLES);
  const [theme, setTheme] = useState<SeasonalTheme>(DEFAULT_THEME);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Layered effects state
  const [secondaryEffect, setSecondaryEffect] = useState<SeasonalEffect>('none');
  const [secondaryParticles, setSecondaryParticles] = useState<ParticleSettings>({
    density: 18,
    speed: 0.8,
    size: 12,
    opacity: 0.7,
    direction: 'random',
  });

  const [feedback, setFeedback] = useState<string | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const baseSeason = useMemo(
    () => seasonalPresets.find((s) => s.id === selectedSeasonId) ?? seasonalPresets[0],
    [selectedSeasonId],
  );

  // Build active effect layers
  const activeEffects: EffectLayer[] = useMemo(() => {
    const list: EffectLayer[] = [
      {
        effect: baseSeason.effect ?? 'sakura',
        particles,
        accent: theme.colors?.particleColor ?? theme.colors?.primaryAccent ?? baseSeason.accent,
      },
    ];
    if (secondaryEffect !== 'none') {
      list.push({
        effect: secondaryEffect,
        particles: secondaryParticles,
        accent: theme.colors?.secondaryAccent ?? '#fde047',
      });
    }
    return list;
  }, [baseSeason, particles, secondaryEffect, secondaryParticles, theme]);

  // Build active season
  const activeCustomSeason: SeasonDefinition = useMemo(() => {
    return {
      ...baseSeason,
      accent: theme.colors?.primaryAccent ?? baseSeason.accent,
      background:
        theme.background?.gradient ??
        (theme.background?.type === 'solid' ? theme.background.solidColor : undefined) ??
        baseSeason.background,
      videoSrc: theme.background?.videoUrl ?? baseSeason.videoSrc,
      particles,
      effects: activeEffects,
      theme,
    };
  }, [baseSeason, theme, particles, activeEffects]);

  const configuredSeasons = useMemo(() => {
    return seasonalPresets.map((s) => {
      if (s.id === selectedSeasonId) {
        return activeCustomSeason;
      }
      return s;
    });
  }, [selectedSeasonId, activeCustomSeason]);

  const generatedTsx = useMemo(
    () => generateReactCode(activeCustomSeason, particles, theme, activeEffects, installMethod),
    [activeCustomSeason, particles, theme, activeEffects, installMethod],
  );

  const generatedJson = useMemo(
    () => generateConfigCode(activeCustomSeason, particles, theme, activeEffects),
    [activeCustomSeason, particles, theme, activeEffects],
  );

  const showFeedback = (message: string) => {
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    setFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 2400);
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
      showFeedback(`Failed to copy to clipboard`);
    }
  };

  const handleDownloadTsx = () => {
    downloadFile(generatedTsx, 'Atmosphere.tsx', 'text/typescript');
    showFeedback('✓ Downloaded Atmosphere.tsx');
  };

  const handleDownloadJson = () => {
    downloadFile(generatedJson, 'seasonal-atmosphere.json', 'application/json');
    showFeedback('✓ Downloaded seasonal-atmosphere.json');
  };

  const applyPreset = (presetKey: string) => {
    const preset = themePresets[presetKey];
    if (!preset) return;
    setActivePresetId(presetKey);
    setTheme(preset);

    if (preset.effects && preset.effects.length > 0) {
      if (preset.effects[0]?.particles) {
        setParticles(preset.effects[0].particles);
      }
      if (preset.effects.length > 1 && preset.effects[1]) {
        setSecondaryEffect(preset.effects[1].effect);
        if (preset.effects[1].particles) {
          setSecondaryParticles(preset.effects[1].particles);
        }
      } else {
        setSecondaryEffect('none');
      }
    }

    showFeedback(`✓ Applied "${preset.label}" theme preset`);
  };

  const resetDefaults = () => {
    setParticles(DEFAULT_PARTICLES);
    setTheme(DEFAULT_THEME);
    setActivePresetId(null);
    setSecondaryEffect('none');
    showFeedback('✓ Atmosphere reset to defaults');
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
            key={`${selectedSeasonId}-${JSON.stringify(theme)}-${JSON.stringify(particles)}-${secondaryEffect}`}
            seasons={configuredSeasons}
            initialSeasonId={selectedSeasonId}
            onSeasonChange={(s: SeasonDefinition) => setSelectedSeasonId(s.id)}
            theme={theme}
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

        {/* Tab Navigation */}
        <div className="tabs-nav" role="tablist" aria-label="Customization categories">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'particles'}
            className={`tab-btn ${activeTab === 'particles' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('particles')}
          >
            Particles
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'theme'}
            className={`tab-btn ${activeTab === 'theme' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            Theme & Colors
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'effects'}
            className={`tab-btn ${activeTab === 'effects' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('effects')}
          >
            Layered Effects
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'export'}
            className={`tab-btn ${activeTab === 'export' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            Export & Install
          </button>
        </div>

        {/* TAB 1: Particles */}
        {activeTab === 'particles' && (
          <>
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
                    <span>{s.symbol} {s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="control-section">
              <h3 className="control-section-title">Particle Configuration</h3>

              {/* Density */}
              <div className="control-field">
                <div className="control-field-top">
                  <label htmlFor="particle-density" className="control-label">Density</label>
                  <span className="control-value-badge" data-testid="density-val">{particles.density}</span>
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
                  <label htmlFor="particle-speed" className="control-label">Speed Multiplier</label>
                  <span className="control-value-badge" data-testid="speed-val">{(particles.speed ?? 1).toFixed(2)}x</span>
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
                  <label htmlFor="particle-size" className="control-label">Particle Size</label>
                  <span className="control-value-badge" data-testid="size-val">{particles.size}px</span>
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
                  <label htmlFor="particle-opacity" className="control-label">Opacity</label>
                  <span className="control-value-badge" data-testid="opacity-val">{(particles.opacity ?? 0.9).toFixed(2)}</span>
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
                  <label htmlFor="particle-direction" className="control-label">Movement Direction</label>
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
          </>
        )}

        {/* TAB 2: Theme & Colors */}
        {activeTab === 'theme' && (
          <>
            {/* Theme Presets */}
            <div className="control-section">
              <h3 className="control-section-title">Theme Presets</h3>
              <div className="control-preset-grid" role="group" aria-label="Theme presets">
                {Object.entries(themePresets).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    className={`preset-btn-card ${activePresetId === key ? 'preset-btn-card--active' : ''}`}
                    onClick={() => applyPreset(key)}
                    aria-pressed={activePresetId === key}
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="control-section">
              <h3 className="control-section-title">Color Palette</h3>

              <div className="control-field">
                <label htmlFor="primary-accent" className="control-label">Primary Accent</label>
                <div className="control-color-row">
                  <input
                    id="primary-accent"
                    type="color"
                    value={theme.colors?.primaryAccent ?? '#f9a8d4'}
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        colors: { ...t.colors, primaryAccent: e.target.value },
                      }))
                    }
                    className="color-input-swatch"
                  />
                  <input
                    type="text"
                    value={theme.colors?.primaryAccent ?? '#f9a8d4'}
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        colors: { ...t.colors, primaryAccent: e.target.value },
                      }))
                    }
                    className="control-input"
                  />
                </div>
              </div>

              <div className="control-field">
                <label htmlFor="particle-color" className="control-label">Particle Color</label>
                <div className="control-color-row">
                  <input
                    id="particle-color"
                    type="color"
                    value={theme.colors?.particleColor ?? '#f9a8d4'}
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        colors: { ...t.colors, particleColor: e.target.value },
                      }))
                    }
                    className="color-input-swatch"
                  />
                  <input
                    type="text"
                    value={theme.colors?.particleColor ?? '#f9a8d4'}
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        colors: { ...t.colors, particleColor: e.target.value },
                      }))
                    }
                    className="control-input"
                  />
                </div>
              </div>

              <div className="control-field">
                <label htmlFor="text-color" className="control-label">Text Color</label>
                <div className="control-color-row">
                  <input
                    id="text-color"
                    type="color"
                    value={theme.colors?.textColor ?? '#ffffff'}
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        colors: { ...t.colors, textColor: e.target.value },
                      }))
                    }
                    className="color-input-swatch"
                  />
                  <input
                    type="text"
                    value={theme.colors?.textColor ?? '#ffffff'}
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        colors: { ...t.colors, textColor: e.target.value },
                      }))
                    }
                    className="control-input"
                  />
                </div>
              </div>
            </div>

            {/* Background */}
            <div className="control-section">
              <h3 className="control-section-title">Background & Media</h3>

              <div className="control-field">
                <label htmlFor="bg-type" className="control-label">Background Style</label>
                <select
                  id="bg-type"
                  value={theme.background?.type ?? 'gradient'}
                  onChange={(e) =>
                    setTheme((t) => ({
                      ...t,
                      background: {
                        ...t.background,
                        type: e.target.value as 'solid' | 'gradient',
                      },
                    }))
                  }
                  className="control-select"
                >
                  <option value="gradient">Custom Gradient</option>
                  <option value="solid">Solid Color</option>
                </select>
              </div>

              {theme.background?.type === 'solid' ? (
                <div className="control-field">
                  <label htmlFor="bg-solid" className="control-label">Solid Color</label>
                  <div className="control-color-row">
                    <input
                      id="bg-solid"
                      type="color"
                      value={theme.background?.solidColor ?? '#24141f'}
                      onChange={(e) =>
                        setTheme((t) => ({
                          ...t,
                          background: { ...t.background, solidColor: e.target.value },
                        }))
                      }
                      className="color-input-swatch"
                    />
                    <input
                      type="text"
                      value={theme.background?.solidColor ?? '#24141f'}
                      onChange={(e) =>
                        setTheme((t) => ({
                          ...t,
                          background: { ...t.background, solidColor: e.target.value },
                        }))
                      }
                      className="control-input"
                    />
                  </div>
                </div>
              ) : (
                <div className="control-field">
                  <label htmlFor="bg-gradient" className="control-label">CSS Gradient</label>
                  <input
                    id="bg-gradient"
                    type="text"
                    value={theme.background?.gradient ?? ''}
                    placeholder="e.g. linear-gradient(145deg, #1d2b3b 0%, #111b26 100%)"
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        background: { ...t.background, gradient: e.target.value },
                      }))
                    }
                    className="control-input"
                  />
                </div>
              )}

              <div className="control-field">
                <label htmlFor="video-url" className="control-label">Optional Video URL</label>
                <input
                  id="video-url"
                  type="text"
                  placeholder="https://example.com/ambient.mp4"
                  value={theme.background?.videoUrl ?? ''}
                  onChange={(e) =>
                    setTheme((t) => ({
                      ...t,
                      background: { ...t.background, videoUrl: e.target.value || undefined },
                    }))
                  }
                  className="control-input"
                />
              </div>
            </div>

            {/* Typography */}
            <div className="control-section">
              <h3 className="control-section-title">Typography</h3>
              <div className="control-field">
                <label htmlFor="font-family" className="control-label">Font Family</label>
                <select
                  id="font-family"
                  value={theme.typography?.fontFamily ?? 'Inter, ui-sans-serif, system-ui, sans-serif'}
                  onChange={(e) =>
                    setTheme((t) => ({
                      ...t,
                      typography: { ...t.typography, fontFamily: e.target.value },
                    }))
                  }
                  className="control-select"
                >
                  <option value="Inter, ui-sans-serif, system-ui, sans-serif">Modern Sans-Serif (Inter)</option>
                  <option value='ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'>Elegant Serif (Georgia)</option>
                  <option value="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">Monospace (Code / Minimal)</option>
                  <option value="system-ui, -apple-system, sans-serif">Native System UI</option>
                </select>
              </div>

              <div className="control-field">
                <label htmlFor="heading-size" className="control-label">Heading Size</label>
                <input
                  id="heading-size"
                  type="text"
                  value={theme.typography?.headingSize ?? 'clamp(2rem, 6vw, 4rem)'}
                  onChange={(e) =>
                    setTheme((t) => ({
                      ...t,
                      typography: { ...t.typography, headingSize: e.target.value },
                    }))
                  }
                  className="control-input"
                />
              </div>
            </div>
          </>
        )}

        {/* TAB 3: Layered Effects */}
        {activeTab === 'effects' && (
          <div className="control-section">
            <h3 className="control-section-title">Effect Combinations & Layers</h3>

            <div className="toggle-row">
              <label htmlFor="disable-particles-toggle" className="toggle-label">
                Disable Particle Animations
              </label>
              <input
                id="disable-particles-toggle"
                type="checkbox"
                checked={theme.disableParticles ?? false}
                onChange={(e) => setTheme((t) => ({ ...t, disableParticles: e.target.checked }))}
                className="toggle-switch"
                aria-label="Disable particle animations"
              />
            </div>

            <div className="control-field">
              <label htmlFor="primary-effect" className="control-label">Base Effect (Layer 1)</label>
              <select
                id="primary-effect"
                value={baseSeason.effect ?? 'sakura'}
                onChange={(e) => {
                  const newEffect = e.target.value as SeasonalEffect;
                  baseSeason.effect = newEffect;
                  setTheme((t) => ({ ...t }));
                }}
                className="control-select"
                disabled={theme.disableParticles}
              >
                <option value="sakura">Sakura Blossoms</option>
                <option value="leaves">Autumn Leaves</option>
                <option value="rain">Window Rain</option>
                <option value="snow">Winter Snow</option>
                <option value="sparkles">Golden Sparkles</option>
                <option value="fireflies">Floating Fireflies</option>
                <option value="none">None</option>
              </select>
            </div>

            <div className="control-field">
              <label htmlFor="secondary-effect" className="control-label">Secondary Layer (Layer 2)</label>
              <select
                id="secondary-effect"
                value={secondaryEffect}
                onChange={(e) => setSecondaryEffect(e.target.value as SeasonalEffect)}
                className="control-select"
                disabled={theme.disableParticles}
              >
                <option value="none">None (Single Effect)</option>
                <option value="sparkles">✦ Sparkles (Complements Sakura, Snow, Fireflies)</option>
                <option value="rain">🌧️ Rain (Complements Autumn Leaves)</option>
                <option value="fireflies">🌙 Fireflies</option>
                <option value="snow">❄️ Snow</option>
                <option value="leaves">🍂 Leaves</option>
                <option value="sakura">🌸 Sakura</option>
              </select>
            </div>

            {secondaryEffect !== 'none' && !theme.disableParticles && (
              <div className="control-field" style={{ paddingLeft: '8px', borderLeft: '2px solid #f9a8d4' }}>
                <div className="control-field-top">
                  <label htmlFor="sec-density" className="control-label">Layer 2 Density</label>
                  <span className="control-value-badge">{secondaryParticles.density}</span>
                </div>
                <input
                  id="sec-density"
                  type="range"
                  min="5"
                  max="50"
                  value={secondaryParticles.density ?? 18}
                  onChange={(e) => setSecondaryParticles((p) => ({ ...p, density: Number(e.target.value) }))}
                  className="control-slider"
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Dedicated Export Section */}
        {activeTab === 'export' && (
          <div className="control-section" data-testid="export-section">
            <h3 className="control-section-title">Code Export & Integration</h3>

            {/* Format Nav */}
            <div className="export-format-nav" role="tablist" aria-label="Export format">
              <button
                type="button"
                className={`export-format-btn ${exportFormat === 'tsx' ? 'export-format-btn--active' : ''}`}
                onClick={() => setExportFormat('tsx')}
              >
                React (.tsx)
              </button>
              <button
                type="button"
                className={`export-format-btn ${exportFormat === 'json' ? 'export-format-btn--active' : ''}`}
                onClick={() => setExportFormat('json')}
              >
                Config (.json)
              </button>
              <button
                type="button"
                className={`export-format-btn ${exportFormat === 'install' ? 'export-format-btn--active' : ''}`}
                onClick={() => setExportFormat('install')}
              >
                Installation
              </button>
            </div>

            {/* Code Box */}
            {exportFormat === 'tsx' && (
              <>
                <div className="code-preview-box" data-testid="tsx-preview-box">
                  <pre className="code-preview-text">{generatedTsx}</pre>
                </div>
                <div className="export-btn-group">
                  <button
                    type="button"
                    className="action-btn action-btn--primary"
                    onClick={() => copyToClipboard(generatedTsx, 'React TSX component')}
                  >
                    📋 Copy TSX
                  </button>
                  <button
                    type="button"
                    className="action-btn action-btn--secondary"
                    onClick={handleDownloadTsx}
                  >
                    💾 Download TSX
                  </button>
                </div>
              </>
            )}

            {exportFormat === 'json' && (
              <>
                <div className="code-preview-box" data-testid="json-preview-box">
                  <pre className="code-preview-text">{generatedJson}</pre>
                </div>
                <div className="export-btn-group">
                  <button
                    type="button"
                    className="action-btn action-btn--primary"
                    onClick={() => copyToClipboard(generatedJson, 'Configuration JSON')}
                  >
                    📋 Copy Config
                  </button>
                  <button
                    type="button"
                    className="action-btn action-btn--secondary"
                    onClick={handleDownloadJson}
                  >
                    💾 Download JSON
                  </button>
                </div>
              </>
            )}

            {exportFormat === 'install' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Installation Method Selector */}
                <div className="control-field">
                  <label htmlFor="install-method-select" className="control-label">Installation Method</label>
                  <select
                    id="install-method-select"
                    value={installMethod}
                    onChange={(e) => setInstallMethod(e.target.value as InstallationMethod)}
                    className="control-select"
                    aria-label="Select installation method"
                  >
                    <option value="npm">📦 npm Package (Recommended for fast setup)</option>
                    <option value="shadcn">🧩 Source Code (shadcn-style registry)</option>
                  </select>
                </div>

                {installMethod === 'npm' ? (
                  <>
                    <div className="control-field">
                      <label htmlFor="package-manager-select" className="control-label">Package Manager</label>
                      <select
                        id="package-manager-select"
                        value={packageManager}
                        onChange={(e) => setPackageManager(e.target.value as PackageManager)}
                        className="control-select"
                      >
                        <option value="npm">npm</option>
                        <option value="pnpm">pnpm</option>
                        <option value="yarn">yarn</option>
                        <option value="bun">bun</option>
                      </select>
                    </div>

                    <div className="code-preview-box">
                      <pre className="code-preview-text">{getInstallCommand(packageManager)}</pre>
                    </div>

                    <button
                      type="button"
                      className="action-btn action-btn--primary"
                      onClick={() => copyToClipboard(getInstallCommand(packageManager), 'npm install command')}
                    >
                      📋 Copy Installation Command
                    </button>

                    <p className="export-guidance-note">
                      <strong>Styles:</strong> Import <code>@harshwardhan1507/seasonal-lounge/styles.css</code> in your app root or component file.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="control-field">
                      <label htmlFor="shadcn-source-select" className="control-label">Registry Source</label>
                      <select
                        id="shadcn-source-select"
                        value={shadcnSource}
                        onChange={(e) => setShadcnSource(e.target.value as 'hosted' | 'github')}
                        className="control-select"
                      >
                        <option value="hosted">Live Production Registry (seasonal-lounge.vercel.app)</option>
                        <option value="github">GitHub Raw Repository Registry</option>
                      </select>
                    </div>

                    <div className="code-preview-box">
                      <pre className="code-preview-text">{getShadcnCommand(shadcnSource)}</pre>
                    </div>

                    <button
                      type="button"
                      className="action-btn action-btn--primary"
                      onClick={() => copyToClipboard(getShadcnCommand(shadcnSource), 'shadcn CLI command')}
                    >
                      📋 Copy shadcn CLI Command
                    </button>

                    <p className="export-guidance-note">
                      <strong>Source Installation:</strong> Copies <code>SeasonalLounge</code>, particle engines, presets, and CSS into your project&apos;s <code>components/seasonal-lounge/</code> folder for complete direct modification.
                    </p>
                  </>
                )}
              </div>
            )}

            <p className="export-guidance-note">
              <strong>Media Notice:</strong> All presets are CSS-only by default. If using custom video or audio, host your media in your application&apos;s public directory or asset CDN.
            </p>
          </div>
        )}

        {/* Global Quick Copy & Export Actions */}
        <div className="control-actions-grid">
          <button
            type="button"
            className="action-btn action-btn--primary"
            onClick={() => copyToClipboard(generatedTsx, 'React Component')}
          >
            📋 Copy React Code
          </button>
          <button
            type="button"
            className="action-btn action-btn--secondary"
            onClick={() => copyToClipboard(generatedJson, 'Configuration JSON')}
          >
            ⚙️ Copy Configuration
          </button>
          <button
            type="button"
            className="action-btn action-btn--secondary"
            onClick={() =>
              copyToClipboard(
                installMethod === 'npm' ? getInstallCommand(packageManager) : getShadcnCommand(shadcnSource),
                'Install Command',
              )
            }
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
