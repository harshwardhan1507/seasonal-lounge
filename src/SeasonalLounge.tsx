import { useEffect, useMemo, useRef, useState } from 'react';
import { configureSegmentedAudio } from './audio';
import { SeasonalParticles } from './SeasonalParticles';
import type { SeasonDefinition, SeasonalLoungeProps } from './types';

function getInitialSeason(seasons: SeasonDefinition[], initialSeasonId?: string) {
  return seasons.find((season) => season.id === initialSeasonId) ?? seasons[0];
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

  return (
    <section
      ref={loungeRef}
      className={`seasonal-lounge ${calmMode ? 'seasonal-lounge--calm' : ''} ${className}`.trim()}
      style={{ background: season.background, ...style }}
      aria-label={`${season.label} seasonal lounge`}
    >
      {season.videoSrc && (
        <video
          ref={videoRef}
          key={season.videoSrc}
          src={season.videoSrc}
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
      <SeasonalParticles effect={season.effect ?? 'none'} accent={season.accent} />
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
                style={item.id === season.id ? { borderColor: item.accent } : undefined}
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
