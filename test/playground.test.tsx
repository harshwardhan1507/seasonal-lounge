import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Playground } from '../demo/Playground';
import { generateReactCode, generateConfigCode, getInstallCommand } from '../demo/codeGenerator';
import { seasonalPresets } from '../src/presets';

describe('Interactive Visual Playground (Milestone 2 - v1.2)', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('renders the playground with live preview and controls', () => {
    render(<Playground />);
    expect(screen.getByTestId('visual-playground')).toBeInTheDocument();
    expect(screen.getByText('Customization Controls')).toBeInTheDocument();
    expect(screen.getByRole('toolbar', { name: /preview viewport controls/i })).toBeInTheDocument();
  });

  it('switches seasons and updates active state', () => {
    render(<Playground />);
    const controls = screen.getByRole('region', { name: /atmosphere customization controls/i });
    const autumnBtn = within(controls).getByRole('button', { name: /autumn/i });
    fireEvent.click(autumnBtn);
    expect(autumnBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggles viewport between desktop, tablet, and mobile', () => {
    render(<Playground />);
    const tabletBtn = screen.getByRole('button', { name: /tablet/i });
    fireEvent.click(tabletBtn);
    expect(tabletBtn).toHaveClass('viewport-btn--active');

    const mobileBtn = screen.getByRole('button', { name: /mobile/i });
    fireEvent.click(mobileBtn);
    expect(mobileBtn).toHaveClass('viewport-btn--active');
  });

  it('updates particle settings when controls change', () => {
    render(<Playground />);

    // Density slider
    const densityInput = screen.getByLabelText(/particle density/i);
    fireEvent.change(densityInput, { target: { value: '60' } });
    expect(screen.getByTestId('density-val')).toHaveTextContent('60');

    // Speed slider
    const speedInput = screen.getByLabelText(/particle speed multiplier/i);
    fireEvent.change(speedInput, { target: { value: '2.5' } });
    expect(screen.getByTestId('speed-val')).toHaveTextContent('2.50x');

    // Size slider
    const sizeInput = screen.getByLabelText(/particle size in pixels/i);
    fireEvent.change(sizeInput, { target: { value: '28' } });
    expect(screen.getByTestId('size-val')).toHaveTextContent('28px');

    // Opacity slider
    const opacityInput = screen.getByLabelText(/particle opacity/i);
    fireEvent.change(opacityInput, { target: { value: '0.5' } });
    expect(screen.getByTestId('opacity-val')).toHaveTextContent('0.50');

    // Direction select
    const dirSelect = screen.getByLabelText(/particle movement direction/i);
    fireEvent.change(dirSelect, { target: { value: 'up' } });
    expect(dirSelect).toHaveValue('up');
  });

  it('resets controls to defaults when clicking reset', () => {
    render(<Playground />);
    const densityInput = screen.getByLabelText(/particle density/i);
    fireEvent.change(densityInput, { target: { value: '80' } });
    expect(screen.getByTestId('density-val')).toHaveTextContent('80');

    const resetBtn = screen.getByRole('button', { name: /reset particle controls to default values/i });
    fireEvent.click(resetBtn);

    expect(screen.getByTestId('density-val')).toHaveTextContent('35');
    expect(screen.getByTestId('speed-val')).toHaveTextContent('1.00x');
    expect(screen.getByTestId('size-val')).toHaveTextContent('16px');
    expect(screen.getByTestId('opacity-val')).toHaveTextContent('0.90');
  });

  it('copies React code and shows feedback', async () => {
    render(<Playground />);
    const copyReactBtn = screen.getByRole('button', { name: /copy react code/i });
    fireEvent.click(copyReactBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining("from '@harutoxokura/seasonal-lounge'"),
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/copied to clipboard/i);
    });
  });

  it('copies Configuration JSON and shows feedback', async () => {
    render(<Playground />);
    const copyConfigBtn = screen.getByRole('button', { name: /copy configuration/i });
    fireEvent.click(copyConfigBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('"id": "spring"'),
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/copied to clipboard/i);
    });
  });

  it('copies installation command', async () => {
    render(<Playground />);
    const copyInstallBtn = screen.getByRole('button', { name: /copy installation command/i });
    fireEvent.click(copyInstallBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'npm install @harutoxokura/seasonal-lounge',
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/copied to clipboard/i);
    });
  });

  describe('codeGenerator helper', () => {
    const season = seasonalPresets[0];
    const particles = { density: 40, speed: 1.5, size: 20, opacity: 0.8, direction: 'up' as const };

    it('generates valid install commands for all package managers', () => {
      expect(getInstallCommand('npm')).toBe('npm install @harutoxokura/seasonal-lounge');
      expect(getInstallCommand('pnpm')).toBe('pnpm add @harutoxokura/seasonal-lounge');
      expect(getInstallCommand('yarn')).toBe('yarn add @harutoxokura/seasonal-lounge');
      expect(getInstallCommand('bun')).toBe('bun add @harutoxokura/seasonal-lounge');
    });

    it('generates valid JSON config', () => {
      const code = generateConfigCode(season, particles);
      const parsed = JSON.parse(code);
      expect(parsed.id).toBe(season.id);
      expect(parsed.particles.density).toBe(40);
      expect(parsed.particles.direction).toBe('up');
    });

    it('generates valid React component code using public API', () => {
      const code = generateReactCode(season, particles);
      expect(code).toContain("import { SeasonalLounge, type SeasonDefinition } from '@harutoxokura/seasonal-lounge'");
      expect(code).toContain("import '@harutoxokura/seasonal-lounge/styles.css'");
      expect(code).toContain(`id: '${season.id}'`);
      expect(code).toContain('"density": 40');
      expect(code).toContain('<SeasonalLounge');
    });
  });
});
