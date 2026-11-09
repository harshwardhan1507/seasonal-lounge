import type { AudioSegment } from './types';

export function validateAudioSegment(segment?: AudioSegment): AudioSegment | undefined {
  if (!segment) return undefined;
  if (!Number.isFinite(segment.start) || !Number.isFinite(segment.end)) return undefined;
  if (segment.start < 0 || segment.end <= segment.start) return undefined;
  return segment;
}

export function configureSegmentedAudio(audio: HTMLAudioElement, segment?: AudioSegment) {
  const validSegment = validateAudioSegment(segment);
  audio.loop = !validSegment;
  if (!validSegment) return () => undefined;

  const seekToStart = () => {
    audio.currentTime = validSegment.start;
  };
  const loopHighlight = () => {
    if (audio.currentTime >= validSegment.end) {
      audio.currentTime = validSegment.start;
      void audio.play();
    }
  };

  try {
    seekToStart();
  } catch {
    // Metadata may not be ready yet; the listener below applies the seek later.
  }

  audio.addEventListener('loadedmetadata', seekToStart, { once: true });
  audio.addEventListener('timeupdate', loopHighlight);

  return () => {
    audio.removeEventListener('loadedmetadata', seekToStart);
    audio.removeEventListener('timeupdate', loopHighlight);
  };
}
