import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeChip } from './ThemeChip';
import { battleThemeCatalog } from '@yonokomae/catalog';
import type { Battle } from '@yonokomae/types';

// Mock the catalog
vi.mock('@yonokomae/catalog', () => ({
  battleThemeCatalog: [
    {
      id: 'history',
      name: 'History',
      icon: '📜',
      description: 'Historical battles',
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: '💻',
      description: 'Tech battles',
    },
    {
      id: 'culture',
      name: 'Culture',
      icon: '🎭',
      description: 'Cultural battles',
    },
  ],
}));

describe('ThemeChip', () => {
  describe('Basic Rendering', () => {
    it('should render theme chip with name and icon', () => {
      render(<ThemeChip themeId="history" />);

      const chip = screen.getByTestId('theme-chip');
      expect(chip).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();
      expect(screen.getByText('📜')).toBeInTheDocument();
    });

    it('should render different theme correctly', () => {
      render(<ThemeChip themeId="technology" />);

      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('💻')).toBeInTheDocument();
    });

    it('should hide name when showName is false', () => {
      render(<ThemeChip themeId="culture" showName={false} />);

      expect(screen.queryByText('Culture')).not.toBeInTheDocument();
      expect(screen.getByText('🎭')).toBeInTheDocument();
    });

    it('should show name by default', () => {
      render(<ThemeChip themeId="history" />);

      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  describe('Theme Resolution', () => {
    it('should fallback to first theme for unknown themeId', () => {
      render(<ThemeChip themeId={'unknown' as Battle['themeId']} />);

      expect(screen.getByText('History')).toBeInTheDocument();
      expect(screen.getByText('📜')).toBeInTheDocument();
    });

    it('should handle all valid theme IDs', () => {
      const validThemeIds: Battle['themeId'][] = [
        'history',
        'technology',
        'culture',
      ];

      validThemeIds.forEach((themeId) => {
        const { unmount } = render(<ThemeChip themeId={themeId} />);
        const chip = screen.getByTestId('theme-chip');
        expect(chip).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have appropriate aria-label', () => {
      render(<ThemeChip themeId="technology" />);

      const chip = screen.getByLabelText('Theme Technology');
      expect(chip).toBeInTheDocument();
    });

    it('should have title attribute with description', () => {
      render(<ThemeChip themeId="culture" />);

      const chip = screen.getByTestId('theme-chip');
      expect(chip).toHaveAttribute('title', 'Cultural battles');
    });

    it('should mark icon as aria-hidden', () => {
      render(<ThemeChip themeId="history" />);

      const icon = screen.getByText('📜');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const customClass = 'custom-test-class';
      render(<ThemeChip themeId="technology" className={customClass} />);

      const chip = screen.getByTestId('theme-chip');
      expect(chip).toHaveClass(customClass);
    });

    it('should have default variant styling', () => {
      render(<ThemeChip themeId="history" />);

      const chip = screen.getByTestId('theme-chip');
      expect(chip).toHaveClass(
        'px-1.5',
        'py-0.5',
        'inline-flex',
        'items-center',
      );
    });

    it('should apply different variant styles', () => {
      const { rerender } = render(
        <ThemeChip themeId="technology" variant="default" />,
      );
      let chip = screen.getByTestId('theme-chip');
      expect(chip).toBeInTheDocument();

      rerender(<ThemeChip themeId="technology" variant="outline" />);
      chip = screen.getByTestId('theme-chip');
      expect(chip).toBeInTheDocument();

      rerender(<ThemeChip themeId="technology" variant="secondary" />);
      chip = screen.getByTestId('theme-chip');
      expect(chip).toBeInTheDocument();
    });

    it('should have responsive text sizing classes', () => {
      render(<ThemeChip themeId="culture" />);

      const chip = screen.getByTestId('theme-chip');
      expect(chip.className).toContain('text-[10px]');
      expect(chip.className).toContain('sm:text-xs');
    });
  });

  describe('Component Props', () => {
    it('should accept all expected props', () => {
      const props = {
        themeId: 'technology' as Battle['themeId'],
        className: 'test-class',
        variant: 'outline' as const,
        showName: false,
      };

      render(<ThemeChip {...props} />);

      const chip = screen.getByTestId('theme-chip');
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveClass('test-class');
      expect(screen.queryByText('Technology')).not.toBeInTheDocument();
    });

    it('should use default values for optional props', () => {
      render(<ThemeChip themeId="history" />);

      const chip = screen.getByTestId('theme-chip');
      expect(chip).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with all catalog themes', () => {
      battleThemeCatalog.forEach((theme) => {
        const { unmount } = render(
          <ThemeChip themeId={theme.id as Battle['themeId']} />,
        );

        const chip = screen.getByTestId('theme-chip');
        expect(chip).toBeInTheDocument();
        expect(screen.getByText(theme.name)).toBeInTheDocument();
        expect(screen.getByText(theme.icon)).toBeInTheDocument();

        unmount();
      });
    });

    it('should maintain consistency across rerenders', () => {
      const { rerender } = render(<ThemeChip themeId="technology" />);

      const initialChip = screen.getByTestId('theme-chip').cloneNode(true);

      rerender(<ThemeChip themeId="technology" />);

      const rerenderedChip = screen.getByTestId('theme-chip');
      expect(rerenderedChip.textContent).toBe(initialChip.textContent);
    });
  });
});
