import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { configureSegmentedAudio } from './audio';
import { SeasonalParticles } from './SeasonalParticles';
import type { SeasonDefinition, SeasonalLoungeProps, SeasonalTheme } from './types';

function getInitialSeason(seasons: SeasonDefinition[], initialSeasonId?: string) {
  return seasons.find((season) => season.id === initialSeasonId) ?? seasons[0];
}

function resolveBackground(season: SeasonDefinition, theme?: SeasonalTheme): string | undefined {
  if (theme?.background) {
    const bg = theme.background;
    if (bg.type === 'solid' && bg.solidColor) {
      return bg.solidColor;
    }
    if (bg.gradient) {
      return bg.gradient;
    }
    if (bg.gradientColors && bg.gradientColors.length > 0) {
      const dir = bg.gradientDirection ?? '145deg';
      return `linear-gradient(${dir}, ${bg.gradientColors.join(', ')})`;
    }
    if (bg.fallbackColor) {
      return bg.fallbackColor;
    }
  }
  return season.background;
}

export function SeasonalLounge({
  seasons,
  initialSeasonId,
  className = '',
  volume = 0.42,
  allowFullscreen = true,
  showAudioControl = true,
  showSeasonPicker = true,
  calmModeLabel = 'Full-screen calm',
  onSeasonChange,
  style,
  theme,
}: SeasonalLoungeProps) {
  const initialSeason = useMemo(() => getInitialSeason(seasons, initialSeasonId), [initialSeasonId, seasons]);
  const [seasonId, setSeasonId] = useState(initialSeason?.id);
  const [soundOn, setSoundOn] = useState(false);
  const [calmMode, setCalmMode] = useState(false);
  const loungeRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cleanupAudioRef = useRef<(() => void) | null>(null);
  const season = seasons.find((item) => item.id === seasonId) ?? initialSeason;

  const stopAudio = () => {
    cleanupAudioRef.current?.();
    cleanupAudioRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = null;
  };

  const playAudio = (selectedSeason: SeasonDefinition) => {
    if (!selectedSeason.audioSrc) return;
    stopAudio();
    const audio = new Audio(selectedSeason.audioSrc);
    audio.volume = Math.min(1, Math.max(0, volume));
    audio.preload = 'auto';
    cleanupAudioRef.current = configureSegmentedAudio(audio, selectedSeason.audioSegment);
    audioRef.current = audio;
    void audio.play().then(() => setSoundOn(true)).catch(() => setSoundOn(false));
  };

  useEffect(() => {
    setSeasonId(initialSeason?.id);
  }, [initialSeason?.id]);

  useEffect(() => () => stopAudio(), []);

  useEffect(() => {
    const syncFullscreen = () => {
      if (!document.fullscreenElement) setCalmMode(false);
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  if (!season) {
    return <div className="seasonal-lounge__empty">Add at least one season to SeasonalLounge.</div>;
  }

  const activeTheme = season.theme ?? theme;
  const resolvedBg = resolveBackground(season, activeTheme);
  const activeVideo = activeTheme?.background?.videoUrl ?? season.videoSrc;

  const chooseSeason = (nextSeason: SeasonDefinition) => {
    setSeasonId(nextSeason.id);
    if (soundOn) playAudio(nextSeason);
    onSeasonChange?.(nextSeason);
  };

  const toggleAudio = () => {
    if (soundOn) {
      stopAudio();
      setSoundOn(false);
    } else {
      playAudio(season);
    }
  };

  const toggleCalmMode = async () => {
    if (calmMode) {
      if (document.fullscreenElement === loungeRef.current) await document.exitFullscreen();
      setCalmMode(false);
      return;
    }

    void videoRef.current?.play();
    if (!soundOn && season.audioSrc) playAudio(season);
    setCalmMode(true);
    try {
      await loungeRef.current?.requestFullscreen?.();
    } catch {
      // Fixed positioning remains as a fallback when native fullscreen is blocked.
    }
  };

  const hasSolidColor = activeTheme?.background?.type === 'solid' && Boolean(activeTheme.background.solidColor);
  const rootStyle: CSSProperties = {
    background: resolvedBg,
    ...(activeTheme?.background?.fallbackColor && !hasSolidColor
      ? { backgroundColor: activeTheme.background.fallbackColor }
      : {}),
    '--seasonal-accent': activeTheme?.colors?.primaryAccent ?? season.accent ?? '#f9a8d4',
    '--seasonal-accent-secondary': activeTheme?.colors?.secondaryAccent ?? '#f472b6',
    '--seasonal-text': activeTheme?.colors?.textColor ?? 'white',
    '--seasonal-control-bg': activeTheme?.colors?.controlBackground ?? 'rgba(0, 0, 0, 0.36)',
    '--seasonal-control-color': activeTheme?.colors?.controlText ?? 'white',
    '--seasonal-control-border': activeTheme?.colors?.controlBorder ?? 'rgba(255, 255, 255, 0.2)',
    '--seasonal-font-family': activeTheme?.typography?.fontFamily ?? 'Inter, ui-sans-serif, system-ui, sans-serif',
    '--seasonal-heading-size': activeTheme?.typography?.headingSize ?? 'clamp(2rem, 6vw, 4rem)',
    '--seasonal-body-size': activeTheme?.typography?.bodySize ?? '0.95rem',
    '--seasonal-font-weight': activeTheme?.typography?.fontWeight ? String(activeTheme.typography.fontWeight) : '700',
    ...style,
  } as CSSProperties;

  const effectLayers = activeTheme?.effects && activeTheme.effects.length > 0
    ? activeTheme.effects
    : season.effects && season.effects.length > 0
    ? season.effects
    : null;

  return (
    <section
      ref={loungeRef}
      className={`seasonal-lounge ${calmMode ? 'seasonal-lounge--calm' : ''} ${className}`.trim()}
      style={rootStyle}
      aria-label={`${season.label} seasonal lounge`}
    >
      {activeVideo && (
        <video
          ref={videoRef}
          key={activeVideo}
          src={activeVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => void videoRef.current?.play()}
          className="seasonal-lounge__video"
          aria-label={`${season.label} seasonal scene`}
        />
      )}

      {/* Layered or single particle effects */}
      {!activeTheme?.disableParticles && (
        effectLayers ? (
          effectLayers.map((layer, idx) => (
            <SeasonalParticles
              key={`${layer.effect}-${idx}`}
              effect={layer.effect}
              accent={layer.accent ?? activeTheme?.colors?.particleColor ?? activeTheme?.colors?.primaryAccent ?? season.accent}
              settings={layer.particles ?? season.particles}
            />
          ))
        ) : (
          <SeasonalParticles
            effect={season.effect ?? 'none'}
            accent={activeTheme?.colors?.particleColor ?? activeTheme?.colors?.primaryAccent ?? season.accent}
            settings={season.particles}
          />
        )
      )}

      <div className="seasonal-lounge__shade" />

      <div className="seasonal-lounge__topbar">
        {showAudioControl && season.audioSrc && (
          <button type="button" onClick={toggleAudio} className="seasonal-lounge__control" aria-pressed={soundOn}>
            {soundOn ? 'Sound on' : 'Sound off'}
          </button>
        )}
        {allowFullscreen && (
          <button type="button" onClick={() => void toggleCalmMode()} className="seasonal-lounge__control">
            {calmMode ? 'Exit calm mode' : calmModeLabel}
          </button>
        )}
      </div>

      <div className={`seasonal-lounge__content ${calmMode ? 'seasonal-lounge__content--hidden' : ''}`} aria-hidden={calmMode}>
        <span className="seasonal-lounge__symbol" aria-hidden="true">{season.symbol}</span>
        <p className="seasonal-lounge__eyebrow">{season.label} session</p>
        <h2>{season.label}</h2>
        <p>{season.description}</p>

        {showSeasonPicker && seasons.length > 1 && (
          <div className="seasonal-lounge__picker" aria-label="Choose a season">
            {seasons.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseSeason(item)}
                className={item.id === season.id ? 'seasonal-lounge__season seasonal-lounge__season--active' : 'seasonal-lounge__season'}
                style={item.id === season.id ? { borderColor: item.accent ?? activeTheme?.colors?.primaryAccent } : undefined}
                aria-pressed={item.id === season.id}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
