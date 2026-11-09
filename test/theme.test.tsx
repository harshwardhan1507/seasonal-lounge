import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeasonalLounge } from '../src/SeasonalLounge';
import { seasonalPresets } from '../src/presets';
import { themePresets } from '../src/themePresets';
import type { SeasonalTheme, SeasonDefinition } from '../src/types';

describe('Advanced Theme Builder & Layered Effects (Milestone 3 - v1.3)', () => {
  describe('Theme Customization & CSS Variables', () => {
    it('applies custom background colors and gradients', () => {
      const solidTheme: SeasonalTheme = {
        background: {
          type: 'solid',
          solidColor: '#123456',
        },
      };

      const { unmount } = render(<SeasonalLounge seasons={[{ ...seasonalPresets[0], theme: solidTheme }]} />);
      const loungeSolid = screen.getByRole('region', { name: /autumn seasonal lounge/i });
      expect(loungeSolid.style.background).toBe('rgb(18, 52, 86)');
      unmount();

      const gradientTheme: SeasonalTheme = {
        background: {
          type: 'gradient',
          gradient: 'linear-gradient(145deg, #1d2b3b, #111b26)',
          fallbackColor: '#000000',
        },
      };

      render(<SeasonalLounge seasons={[{ ...seasonalPresets[0], theme: gradientTheme }]} />);
      const loungeGrad = screen.getByRole('region', { name: /autumn seasonal lounge/i });
      expect(loungeGrad.style.background).toContain('linear-gradient');
      expect(loungeGrad.style.backgroundColor).toBe('rgb(0, 0, 0)');
    });

    it('applies custom colors and typography as CSS variables', () => {
      const customTheme: SeasonalTheme = {
        colors: {
          primaryAccent: '#ff00aa',
          secondaryAccent: '#00ffcc',
          textColor: '#fefefe',
          controlBackground: 'rgba(255, 0, 100, 0.4)',
          controlText: '#ffffff',
          controlBorder: '#ff00aa',
        },
        typography: {
          fontFamily: 'Georgia, serif',
          headingSize: '3rem',
          bodySize: '1.1rem',
          fontWeight: '800',
        },
      };

      render(<SeasonalLounge seasons={seasonalPresets} theme={customTheme} />);
      const lounge = screen.getByRole('region', { name: /autumn seasonal lounge/i });

      expect(lounge.style.getPropertyValue('--seasonal-accent')).toBe('#ff00aa');
      expect(lounge.style.getPropertyValue('--seasonal-accent-secondary')).toBe('#00ffcc');
      expect(lounge.style.getPropertyValue('--seasonal-text')).toBe('#fefefe');
      expect(lounge.style.getPropertyValue('--seasonal-font-family')).toBe('Georgia, serif');
      expect(lounge.style.getPropertyValue('--seasonal-heading-size')).toBe('3rem');
      expect(lounge.style.getPropertyValue('--seasonal-body-size')).toBe('1.1rem');
      expect(lounge.style.getPropertyValue('--seasonal-font-weight')).toBe('800');
    });

    it('renders optional video when videoUrl is specified in background theme', () => {
      const customTheme: SeasonalTheme = {
        background: {
          videoUrl: 'https://example.com/test-ambient.mp4',
        },
      };

      render(<SeasonalLounge seasons={seasonalPresets} theme={customTheme} />);
      const video = screen.getByLabelText(/seasonal scene/i);
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', 'https://example.com/test-ambient.mp4');
    });
  });

  describe('Layered Effects & Composable Architecture', () => {
    it('renders multiple effect layers simultaneously', () => {
      const seasonWithLayers: SeasonDefinition = {
        ...seasonalPresets[0],
        effects: [
          { effect: 'sakura', particles: { density: 20 } },
          { effect: 'sparkles', particles: { density: 15 } },
        ],
      };

      render(<SeasonalLounge seasons={[seasonWithLayers]} />);
      const particlesContainers = screen.getAllByTestId('seasonal-particles');
      expect(particlesContainers.length).toBe(2);
      expect(particlesContainers[0].children.length).toBe(20);
      expect(particlesContainers[1].children.length).toBe(15);
    });

    it('preserves backward compatibility when single effect is used', () => {
      const legacySeason: SeasonDefinition = {
        ...seasonalPresets[0],
        effect: 'snow',
      };

      render(<SeasonalLounge seasons={[legacySeason]} />);
      const particlesContainer = screen.getByTestId('seasonal-particles');
      expect(particlesContainer).toBeInTheDocument();
      expect(particlesContainer.className).toContain('seasonal-lounge__particles');
    });

    it('disables all particle layers when disableParticles is true', () => {
      const customTheme: SeasonalTheme = {
        disableParticles: true,
        effects: [
          { effect: 'snow' },
          { effect: 'sparkles' },
        ],
      };

      render(<SeasonalLounge seasons={seasonalPresets} theme={customTheme} />);
      expect(screen.queryByTestId('seasonal-particles')).toBeNull();
    });
  });

  describe('Theme Presets', () => {
    const requiredPresets = [
      'sakuraDream',
      'cozyAutumn',
      'midnightRain',
      'winterSilence',
      'goldenSummer',
      'fireflyGarden',
    ];

    it('contains all required theme presets with complete definitions', () => {
      for (const presetKey of requiredPresets) {
        const preset = themePresets[presetKey];
        expect(preset).toBeDefined();
        expect(preset.label).toBeTruthy();
        expect(preset.background).toBeDefined();
        expect(preset.colors?.primaryAccent).toBeTruthy();
        expect(preset.typography?.fontFamily).toBeTruthy();
        expect(preset.effects && preset.effects.length > 0).toBe(true);
      }
    });

    it('can apply a theme preset to SeasonalLounge', () => {
      const preset = themePresets.sakuraDream;
      render(<SeasonalLounge seasons={seasonalPresets} theme={preset} />);
      const lounge = screen.getByRole('region', { name: /autumn seasonal lounge/i });
      expect(lounge.style.getPropertyValue('--seasonal-accent')).toBe(preset.colors?.primaryAccent);
    });
  });
});
