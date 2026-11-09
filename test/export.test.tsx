import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Playground } from '../demo/Playground';
import {
  generateReactCode,
  generateConfigCode,
  getInstallCommand,
  downloadFile,
  escapeJsString,
} from '../demo/codeGenerator';
import { seasonalPresets } from '../src/presets';
import type { ParticleSettings, SeasonalTheme, EffectLayer } from '../src/types';

describe('Code Export and Installation Generator (Milestone 4 - v1.4)', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  describe('escapeJsString', () => {
    it('escapes single quotes, backslashes, and line breaks safely', () => {
      const input = "Winter's chill & \\backslash\nnext line";
      const escaped = escapeJsString(input);
      expect(escaped).toBe("Winter\\'s chill & \\\\backslash\\nnext line");
    });
  });

  describe('generateReactCode', () => {
    const season = seasonalPresets[0];
    const particles: ParticleSettings = {
      density: 45,
      speed: 1.25,
      size: 22,
      opacity: 0.85,
      direction: 'up',
    };
    const theme: SeasonalTheme = {
      colors: { primaryAccent: '#f9a8d4', textColor: '#ffffff' },
      typography: { fontFamily: 'Inter, sans-serif' },
    };
    const effects: EffectLayer[] = [
      { effect: 'sakura', particles },
      { effect: 'sparkles', particles: { density: 10, speed: 0.8 } },
    ];

    it('generates a valid, complete React component with public API imports', () => {
      const code = generateReactCode(season, particles, theme, effects);

      // Public API imports
      expect(code).toContain("import { SeasonalLounge, type SeasonDefinition } from '@harshwardhan1507/seasonal-lounge';");
      expect(code).toContain("import '@harshwardhan1507/seasonal-lounge/styles.css';");

      // Preserves configuration
      expect(code).toContain(`id: '${season.id}'`);
      expect(code).toContain('"density": 45');
      expect(code).toContain('"direction": "up"');
      expect(code).toContain('"primaryAccent": "#f9a8d4"');
      expect(code).toContain('"effect": "sparkles"');

      // Exported component
      expect(code).toContain('export function Atmosphere()');
      expect(code).toContain('<SeasonalLounge');
    });

    it('handles media properties cleanly without embedding binary assets', () => {
      const seasonWithMedia = {
        ...season,
        videoSrc: '/media/autumn.mp4',
        audioSrc: '/media/autumn.mp3',
      };
      const code = generateReactCode(seasonWithMedia);
      expect(code).toContain("videoSrc: '/media/autumn.mp4'");
      expect(code).toContain("audioSrc: '/media/autumn.mp3'");
    });
  });

  describe('generateConfigCode', () => {
    it('generates valid parseable JSON with all configuration settings', () => {
      const season = seasonalPresets[1];
      const particles: ParticleSettings = { density: 30, size: 15, direction: 'down' };
      const theme: SeasonalTheme = { colors: { primaryAccent: '#7dd3fc' } };

      const jsonStr = generateConfigCode(season, particles, theme);
      const parsed = JSON.parse(jsonStr);

      expect(parsed.id).toBe(season.id);
      expect(parsed.particles.density).toBe(30);
      expect(parsed.theme.colors.primaryAccent).toBe('#7dd3fc');
    });
  });

  describe('downloadFile', () => {
    it('creates object URL and triggers anchor click for file download', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost/test');
      const revokeObjectURLMock = vi.fn();
      window.URL.createObjectURL = createObjectURLMock;
      window.URL.revokeObjectURL = revokeObjectURLMock;

      const clickMock = vi.fn();
      const createElementOriginal = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = createElementOriginal(tagName);
        if (tagName === 'a') {
          el.click = clickMock;
        }
        return el;
      });

      downloadFile('export const test = 1;', 'test.tsx', 'text/typescript');

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(clickMock).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:http://localhost/test');

      vi.restoreAllMocks();
    });
  });

  describe('Playground Export & Install Tab Interactions', () => {
    it('renders the dedicated export tab and allows format switching', () => {
      render(<Playground />);
      const exportTabBtn = screen.getByRole('tab', { name: /export & install/i });
      fireEvent.click(exportTabBtn);

      const exportSection = screen.getByTestId('export-section');
      expect(exportSection).toBeInTheDocument();
      expect(screen.getByTestId('tsx-preview-box')).toBeInTheDocument();

      // Switch to JSON format
      const jsonFormatBtn = screen.getByRole('button', { name: /config \(\.json\)/i });
      fireEvent.click(jsonFormatBtn);
      expect(screen.getByTestId('json-preview-box')).toBeInTheDocument();

      // Switch to Installation format
      const installFormatBtn = screen.getByRole('button', { name: /^installation$/i });
      fireEvent.click(installFormatBtn);
      expect(screen.getByText('npm install @harshwardhan1507/seasonal-lounge')).toBeInTheDocument();
    });

    it('copies TSX and triggers download from the export tab', async () => {
      render(<Playground />);
      const exportTabBtn = screen.getByRole('tab', { name: /export & install/i });
      fireEvent.click(exportTabBtn);

      const copyTsxBtn = screen.getByRole('button', { name: /copy tsx/i });
      fireEvent.click(copyTsxBtn);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('export function Atmosphere()'),
      );

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/copied to clipboard/i);
      });
    });

    it('updates install command when package manager changes in export tab', () => {
      render(<Playground />);
      const exportTabBtn = screen.getByRole('tab', { name: /export & install/i });
      fireEvent.click(exportTabBtn);

      const installFormatBtn = screen.getByRole('button', { name: /^installation$/i });
      fireEvent.click(installFormatBtn);

      const pmSelect = screen.getByLabelText(/package manager/i);
      fireEvent.change(pmSelect, { target: { value: 'pnpm' } });
      expect(screen.getByText('pnpm add @harshwardhan1507/seasonal-lounge')).toBeInTheDocument();

      fireEvent.change(pmSelect, { target: { value: 'bun' } });
      expect(screen.getByText('bun add @harshwardhan1507/seasonal-lounge')).toBeInTheDocument();
    });
  });
});
