import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Playground } from '../demo/Playground';
import { getShadcnCommand, REGISTRY_URL, REGISTRY_RAW_GITHUB_URL } from '../demo/codeGenerator';

describe('shadcn-Style Component Registry (Milestone 5 - v2.0)', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });
  const rootDir = path.resolve(__dirname, '..');
  const registryFilePath = path.join(rootDir, 'registry', 'seasonal-lounge.json');
  const registryIndexFilePath = path.join(rootDir, 'registry', 'index.json');
  const demoPublicFilePath = path.join(rootDir, 'demo', 'public', 'registry', 'seasonal-lounge.json');

  it('generates valid registry item matching shadcn registry schema', () => {
    expect(fs.existsSync(registryFilePath)).toBe(true);
    const content = fs.readFileSync(registryFilePath, 'utf-8');
    const json = JSON.parse(content);

    expect(json.$schema).toBe('https://ui.shadcn.com/schema/registry-item.json');
    expect(json.name).toBe('seasonal-lounge');
    expect(json.type).toBe('registry:ui');
    expect(json.title).toBe('Seasonal Lounge');
    expect(json.description).toBeTruthy();
    expect(Array.isArray(json.files)).toBe(true);
    expect(json.files.length).toBe(8);

    const expectedFiles = [
      'SeasonalLounge.tsx',
      'SeasonalParticles.tsx',
      'audio.ts',
      'presets.ts',
      'themePresets.ts',
      'types.ts',
      'styles.css',
      'index.ts',
    ];

    for (const file of json.files) {
      expect(expectedFiles).toContain(file.path);
      expect(file.type).toBe('registry:ui');
      expect(file.target).toBe(`components/seasonal-lounge/${file.path}`);
      expect(typeof file.content).toBe('string');
      expect(file.content.length).toBeGreaterThan(0);
    }
  });

  it('generates valid registry index matching shadcn registry list schema', () => {
    expect(fs.existsSync(registryIndexFilePath)).toBe(true);
    const content = fs.readFileSync(registryIndexFilePath, 'utf-8');
    const json = JSON.parse(content);

    expect(json.$schema).toBe('https://ui.shadcn.com/schema/registry.json');
    expect(json.name).toBe('seasonal-lounge');
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.items.some((i: { name: string }) => i.name === 'seasonal-lounge')).toBe(true);
  });

  it('mirrors registry files to demo/public for hosted deployment', () => {
    expect(fs.existsSync(demoPublicFilePath)).toBe(true);
    const rootRegistry = fs.readFileSync(registryFilePath, 'utf-8');
    const demoRegistry = fs.readFileSync(demoPublicFilePath, 'utf-8');
    expect(rootRegistry).toBe(demoRegistry);
  });

  it('ensures all registry file contents match current source in src/', () => {
    const registry = JSON.parse(fs.readFileSync(registryFilePath, 'utf-8'));
    for (const item of registry.files) {
      const srcPath = path.join(rootDir, 'src', item.path);
      expect(fs.existsSync(srcPath)).toBe(true);
      const srcContent = fs.readFileSync(srcPath, 'utf-8');
      expect(item.content).toBe(srcContent);
    }
  });

  it('generates valid shadcn CLI installation commands', () => {
    expect(getShadcnCommand('hosted')).toBe(`npx shadcn@latest add ${REGISTRY_URL}`);
    expect(getShadcnCommand('github')).toBe(`npx shadcn@latest add ${REGISTRY_RAW_GITHUB_URL}`);
  });

  it('provides installation method selector in the playground UI', async () => {
    render(<Playground />);
    const exportTabBtn = screen.getByRole('tab', { name: /export & install/i });
    fireEvent.click(exportTabBtn);

    const installFormatBtn = screen.getByRole('button', { name: /^installation$/i });
    fireEvent.click(installFormatBtn);

    const installMethodSelect = screen.getByLabelText(/select installation method/i);
    expect(installMethodSelect).toBeInTheDocument();

    // Switch to shadcn source installation
    fireEvent.change(installMethodSelect, { target: { value: 'shadcn' } });
    expect(screen.getByText(`npx shadcn@latest add ${REGISTRY_URL}`)).toBeInTheDocument();

    // Copy shadcn command
    const copyShadcnBtn = screen.getByRole('button', { name: /copy shadcn cli command/i });
    fireEvent.click(copyShadcnBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`npx shadcn@latest add ${REGISTRY_URL}`);
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/copied to clipboard/i);
    });
  });
});
