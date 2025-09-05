import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
    removeItem: vi.fn(),
    length: 0,
    key: vi.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    document.documentElement.classList.remove('dark', 'light');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should render with light theme by default', () => {
      localStorageMock.getItem.mockReturnValue(null);

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: 'Toggle theme' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('🌙');
      expect(button).toHaveAttribute('title', 'ダークモード');
    });

    it('should use saved theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: 'Toggle theme' });
      expect(button).toHaveTextContent('☀️');
      expect(button).toHaveAttribute('title', 'ライトモード');
    });

    it('should default to light theme for invalid localStorage value', () => {
      localStorageMock.getItem.mockReturnValue('invalid');

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: 'Toggle theme' });
      expect(button).toHaveTextContent('🌙');
    });
  });

  describe('Theme Toggling', () => {
    it('should toggle from light to dark', () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: 'Toggle theme' });
      expect(button).toHaveTextContent('🌙');

      fireEvent.click(button);

      expect(button).toHaveTextContent('☀️');
      expect(button).toHaveAttribute('title', 'ライトモード');
    });

    it('should toggle from dark to light', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: 'Toggle theme' });
      expect(button).toHaveTextContent('☀️');

      fireEvent.click(button);

      expect(button).toHaveTextContent('🌙');
      expect(button).toHaveAttribute('title', 'ダークモード');
    });

    it('should toggle multiple times', () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: 'Toggle theme' });

      // Initial state
      expect(button).toHaveTextContent('🌙');

      // First toggle
      fireEvent.click(button);
      expect(button).toHaveTextContent('☀️');

      // Second toggle
      fireEvent.click(button);
      expect(button).toHaveTextContent('🌙');

      // Third toggle
      fireEvent.click(button);
      expect(button).toHaveTextContent('☀️');
    });
  });

  describe('DOM Updates', () => {
    it('should add light class to documentElement', () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(<ThemeToggle />);

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should add dark class to documentElement', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(<ThemeToggle />);

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('should update documentElement classes on toggle', () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: 'Toggle theme' });

      expect(document.documentElement.classList.contains('light')).toBe(true);

      fireEvent.click(button);

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });
  });

  describe('LocalStorage', () => {
    it('should save theme to localStorage', () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(<ThemeToggle />);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');

      const button = screen.getByRole('button', { name: 'Toggle theme' });
      fireEvent.click(button);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('light');
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => render(<ThemeToggle />)).not.toThrow();

      const button = screen.getByRole('button', { name: 'Toggle theme' });
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button attributes', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: 'Toggle theme' });

      expect(button).toHaveAttribute('aria-label', 'Toggle theme');
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('title');
    });

    it('should have keyboard accessibility classes', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: 'Toggle theme' });

      expect(button.className).toContain('focus-visible:outline-none');
      expect(button.className).toContain('focus-visible:ring-2');
      expect(button.className).toContain('focus-visible:ring-ring');
    });
  });

  describe('Styling', () => {
    it('should have correct button classes', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: 'Toggle theme' });

      expect(button).toHaveClass(
        'inline-flex',
        'h-9',
        'w-9',
        'items-center',
        'justify-center',
      );
      expect(button).toHaveClass('rounded-md', 'text-sm', 'font-medium');
      expect(button).toHaveClass('transition-colors', 'hover:bg-accent');
    });

    it('should have emoji with correct text size', () => {
      render(<ThemeToggle />);

      const emojiSpan = screen.getByText('🌙').closest('span');
      expect(emojiSpan).toHaveClass('text-base');
    });
  });

  describe('SSR Compatibility', () => {
    it('should handle window access safely', () => {
      // Component should not throw during initialization
      expect(() => render(<ThemeToggle />)).not.toThrow();
    });
  });
});
