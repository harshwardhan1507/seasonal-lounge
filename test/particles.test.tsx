import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeasonalParticles, clamp } from '../src/SeasonalParticles';
import { SeasonalLounge } from '../src/SeasonalLounge';
import { seasonalPresets } from '../src/presets';
import type { SeasonalEffect } from '../src/types';

describe('SeasonalParticles & ParticleSettings (Milestone 1 - v1.1)', () => {
  describe('clamp helper', () => {
    it('clamps values within bounds', () => {
      expect(clamp(50, 0, 100)).toBe(50);
      expect(clamp(-10, 0, 100)).toBe(0);
      expect(clamp(150, 0, 100)).toBe(100);
      expect(clamp(NaN, 0, 100)).toBe(0);
      expect(clamp(Infinity, 0, 100)).toBe(0);
    });
  });

  describe('Default values when settings are omitted', () => {
    it('renders default rain count (42 particles)', () => {
      render(<SeasonalParticles effect="rain" />);
      const container = screen.getByTestId('seasonal-particles');
      expect(container.children.length).toBe(42);
    });

    it('renders default sakura count (34 particles)', () => {
      render(<SeasonalParticles effect="sakura" />);
      const container = screen.getByTestId('seasonal-particles');
      expect(container.children.length).toBe(34);
    });

    it('renders default leaves/snow/sparkles/fireflies count (28 particles)', () => {
      const effects: SeasonalEffect[] = ['leaves', 'snow', 'sparkles', 'fireflies'];
      for (const effect of effects) {
        const { unmount } = render(<SeasonalParticles effect={effect} />);
        const container = screen.getByTestId('seasonal-particles');
        expect(container.children.length).toBe(28);
        unmount();
      }
    });

    it('renders null when effect is none', () => {
      const { container } = render(<SeasonalParticles effect="none" />);
      expect(container.firstChild).toBeNull();
    });

    it('has aria-hidden="true" on particles container', () => {
      render(<SeasonalParticles effect="sakura" />);
      const container = screen.getByTestId('seasonal-particles');
      expect(container).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Custom ParticleSettings', () => {
    it('renders custom density', () => {
      render(<SeasonalParticles effect="leaves" settings={{ density: 50 }} />);
      const container = screen.getByTestId('seasonal-particles');
      expect(container.children.length).toBe(50);
    });

    it('renders 0 particles and returns null when density is 0', () => {
      const { container } = render(<SeasonalParticles effect="leaves" settings={{ density: 0 }} />);
      expect(container.firstChild).toBeNull();
    });

    it('clamps density to maximum 100', () => {
      render(<SeasonalParticles effect="leaves" settings={{ density: 150 }} />);
      const container = screen.getByTestId('seasonal-particles');
      expect(container.children.length).toBe(100);
    });

    it('clamps density to minimum 0', () => {
      const { container } = render(<SeasonalParticles effect="leaves" settings={{ density: -20 }} />);
      expect(container.firstChild).toBeNull();
    });

    it('applies custom particle size in pixels', () => {
      render(<SeasonalParticles effect="sakura" settings={{ size: 24 }} />);
      const particle = screen.getByTestId('seasonal-particle-0');
      expect(particle.style.getPropertyValue('--particle-size')).toBe('24px');
    });

    it('clamps custom particle size within safe bounds', () => {
      render(<SeasonalParticles effect="sakura" settings={{ size: 0 }} />);
      const particle = screen.getByTestId('seasonal-particle-0');
      expect(particle.style.getPropertyValue('--particle-size')).toBe('1px');
    });

    it('applies custom speed multiplier to duration and delay', () => {
      // Default duration for index 0 is 4.2s
      render(<SeasonalParticles effect="rain" settings={{ speed: 2 }} />);
      const particle = screen.getByTestId('seasonal-particle-0');
      // 4.2 / 2 = 2.1s
      expect(particle.style.getPropertyValue('--particle-duration')).toBe('2.10s');
    });

    it('clamps speed multiplier to min 0.25 and max 3', () => {
      const { unmount: unmountMin } = render(<SeasonalParticles effect="rain" settings={{ speed: 0.01 }} />);
      const particleMin = screen.getByTestId('seasonal-particle-0');
      // 4.2 / 0.25 = 16.8s
      expect(particleMin.style.getPropertyValue('--particle-duration')).toBe('16.80s');
      unmountMin();

      render(<SeasonalParticles effect="rain" settings={{ speed: 10 }} />);
      const particleMax = screen.getByTestId('seasonal-particle-0');
      // 4.2 / 3 = 1.4s
      expect(particleMax.style.getPropertyValue('--particle-duration')).toBe('1.40s');
    });

    it('applies custom opacity to container style and variable', () => {
      render(<SeasonalParticles effect="snow" settings={{ opacity: 0.65 }} />);
      const container = screen.getByTestId('seasonal-particles');
      expect(container.style.opacity).toBe('0.65');
      expect(container.style.getPropertyValue('--particle-opacity')).toBe('0.65');
    });

    it('clamps opacity to 0..1', () => {
      const { unmount } = render(<SeasonalParticles effect="snow" settings={{ opacity: -0.5 }} />);
      const container = screen.getByTestId('seasonal-particles');
      expect(container.style.opacity).toBe('0');
      unmount();

      render(<SeasonalParticles effect="snow" settings={{ opacity: 1.5 }} />);
      const containerMax = screen.getByTestId('seasonal-particles');
      expect(containerMax.style.opacity).toBe('1');
    });

    it('applies directional modifier classes', () => {
      const directions = ['up', 'down', 'left', 'right', 'random'] as const;
      for (const dir of directions) {
        const { unmount } = render(<SeasonalParticles effect="fireflies" settings={{ direction: dir }} />);
        const container = screen.getByTestId('seasonal-particles');
        expect(container).toHaveClass(`seasonal-lounge__particles--dir-${dir}`);
        expect(container).toHaveAttribute('data-direction', dir);
        const particle = screen.getByTestId('seasonal-particle-0');
        expect(particle).toHaveClass(`seasonal-lounge__particle--dir-${dir}`);
        unmount();
      }
    });

    it('supports alias prop particles in SeasonalOverlayProps', () => {
      render(<SeasonalParticles effect="sparkles" particles={{ density: 15, size: 20 }} />);
      const container = screen.getByTestId('seasonal-particles');
      expect(container.children.length).toBe(15);
      const particle = screen.getByTestId('seasonal-particle-0');
      expect(particle.style.getPropertyValue('--particle-size')).toBe('20px');
    });
  });

  describe('Integration with SeasonalLounge and SeasonDefinition', () => {
    it('passes season particles settings to particles overlay', () => {
      const customSeasons = [
        {
          ...seasonalPresets[0],
          particles: { density: 18, size: 30, direction: 'up' as const },
        },
      ];

      render(<SeasonalLounge seasons={customSeasons} />);
      const container = screen.getByTestId('seasonal-particles');
      expect(container.children.length).toBe(18);
      expect(container).toHaveClass('seasonal-lounge__particles--dir-up');
    });
  });
});
