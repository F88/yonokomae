import type { PlayMode } from '@/yk/play-mode';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TitleContainer } from './TitleContainer';

// Mock the debug env
Object.defineProperty(import.meta, 'env', {
  value: {
    DEV: false,
    VITE_TITLE_DEBUG: false,
  },
  writable: true,
});

// Comprehensive mock for data-battle-seeds
vi.mock('@yonokomae/data-battle-seeds', () => ({
  battleSeedsByFile: {
    'test-seed.ts': {
      id: 'test-seed',
      themeId: 'history',
      publishState: 'published',
    },
  },
  publishStateKeys: ['published', 'draft', 'review'],
  themeIds: ['history', 'technology', 'culture'],
}));

describe('TitleContainer', () => {
  const mockModes: PlayMode[] = [
    {
      id: 'demo',
      title: 'Demo Mode',
      description: 'Demo mode description',
      enabled: true,
      srLabel: 'Demo Mode for SR',
    },
  ];

  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders with default title', () => {
      render(<TitleContainer modes={mockModes} onSelect={mockOnSelect} />);

      expect(screen.getByText('SELECT MODE')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      render(
        <TitleContainer
          modes={mockModes}
          onSelect={mockOnSelect}
          title="CUSTOM TITLE"
        />,
      );

      expect(screen.getByText('CUSTOM TITLE')).toBeInTheDocument();
    });

    it('renders mode options', () => {
      render(<TitleContainer modes={mockModes} onSelect={mockOnSelect} />);
      screen.debug();
      expect(screen.getByText('Demo Mode')).toBeInTheDocument();
      expect(screen.getByText('Demo Mode for SR')).toBeInTheDocument();
      expect(screen.getByText('Demo mode description')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Use Arrow keys to choose a mode and press Enter or B to start.',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Props handling', () => {
    it('handles battleSeedFile prop', () => {
      render(
        <TitleContainer
          modes={mockModes}
          onSelect={mockOnSelect}
          battleSeedFile="test-seed.ts"
        />,
      );

      // Component should render without error
      expect(screen.getByText('SELECT MODE')).toBeInTheDocument();
    });

    it('handles onBattleSeedChange prop', () => {
      const mockOnBattleSeedChange = vi.fn();

      render(
        <TitleContainer
          modes={mockModes}
          onSelect={mockOnSelect}
          onBattleSeedChange={mockOnBattleSeedChange}
        />,
      );

      expect(screen.getByText('SELECT MODE')).toBeInTheDocument();
    });

    it('handles theme selection props', () => {
      const mockOnThemeChange = vi.fn();

      render(
        <TitleContainer
          modes={mockModes}
          onSelect={mockOnSelect}
          selectedThemeId="history"
          onSelectedThemeIdChange={mockOnThemeChange}
        />,
      );

      expect(screen.getByText('SELECT MODE')).toBeInTheDocument();
    });

    it('handles publish state props', () => {
      const mockOnPublishStateChange = vi.fn();

      render(
        <TitleContainer
          modes={mockModes}
          onSelect={mockOnSelect}
          selectedPublishState="published"
          onSelectedPublishStateChange={mockOnPublishStateChange}
        />,
      );

      expect(screen.getByText('SELECT MODE')).toBeInTheDocument();
    });

    it('handles srIncludeDescription prop', () => {
      render(
        <TitleContainer
          modes={mockModes}
          onSelect={mockOnSelect}
          srIncludeDescription={true}
        />,
      );

      expect(screen.getByText('SELECT MODE')).toBeInTheDocument();
    });
  });

  describe('Mode filtering', () => {
    it('handles empty modes array', () => {
      render(<TitleContainer modes={[]} onSelect={mockOnSelect} />);

      expect(screen.getByText('SELECT MODE')).toBeInTheDocument();
    });

    it('handles undefined modes (uses default)', () => {
      render(<TitleContainer onSelect={mockOnSelect} />);

      expect(screen.getByText('SELECT MODE')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper radiogroup structure', () => {
      render(<TitleContainer modes={mockModes} onSelect={mockOnSelect} />);

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toBeInTheDocument();
      expect(radiogroup).toHaveAttribute('aria-label', 'Play modes');
    });

    it('provides screen reader hints', () => {
      render(<TitleContainer modes={mockModes} onSelect={mockOnSelect} />);

      expect(
        screen.getByText(/Use Arrow keys to choose a mode/),
      ).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('renders with proper card structure', () => {
      render(<TitleContainer modes={mockModes} onSelect={mockOnSelect} />);

      // Should have card structure
      const card = screen
        .getByText('SELECT MODE')
        .closest('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });
  });
});
