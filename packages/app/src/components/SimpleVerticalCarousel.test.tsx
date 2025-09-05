import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { SimpleVerticalCarousel } from './SimpleVerticalCarousel';

// Mock the USER_VOICES data
vi.mock('@/data/users-voice', () => ({
  USER_VOICES: [
    { voice: 'Test voice 1', name: 'User 1', age: '20s' },
    { voice: 'Test voice 2', name: 'User 2', age: '30s' },
    { voice: 'Test voice 3', name: 'User 3', age: '40s' },
  ],
}));

// Mock CSS import
vi.mock('@/components/UserVoicesMarquee.css', () => ({}));

describe('SimpleVerticalCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should render the first user voice initially', () => {
      render(<SimpleVerticalCarousel />);

      expect(screen.getByText('Test voice 1')).toBeInTheDocument();
      expect(screen.getByText('User 1（20s）')).toBeInTheDocument();
    });

    it('should render with custom height', () => {
      render(<SimpleVerticalCarousel height="200px" />);

      const container = screen
        .getByText('Test voice 1')
        .closest('div[style*="height"]');
      expect(container).toHaveStyle('height: 200px');
    });

    it('should apply custom className', () => {
      const customClass = 'custom-carousel';
      render(<SimpleVerticalCarousel className={customClass} />);

      const container = screen
        .getByText('Test voice 1')
        .closest('.custom-carousel');
      expect(container).toHaveClass(customClass);
    });

    it('should render null if no voices', async () => {
      vi.resetModules();
      vi.doMock('@/data/users-voice', () => ({
        USER_VOICES: [],
      }));
      const { SimpleVerticalCarousel: Dynamic } = await import(
        './SimpleVerticalCarousel'
      );
      const { container } = render(<Dynamic />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Carousel Functionality', () => {
    it('should advance to next voice after interval', () => {
      render(<SimpleVerticalCarousel intervalMs={1000} />);

      expect(screen.getByText('Test voice 1')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText('Test voice 2')).toBeInTheDocument();
    });

    it('should cycle back to first voice after last voice', () => {
      render(<SimpleVerticalCarousel intervalMs={1000} />);

      // Advance through all voices
      act(() => {
        vi.advanceTimersByTime(1000); // Voice 2
      });
      act(() => {
        vi.advanceTimersByTime(1000); // Voice 3
      });
      act(() => {
        vi.advanceTimersByTime(1000); // Back to Voice 1
      });

      expect(screen.getByText('Test voice 1')).toBeInTheDocument();
    });

    it('should use default interval of 3000ms', () => {
      render(<SimpleVerticalCarousel />);

      expect(screen.getByText('Test voice 1')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(2999);
      });
      expect(screen.getByText('Test voice 1')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByText('Test voice 2')).toBeInTheDocument();
    });
  });

  describe('Hover Behavior', () => {
    it('should pause on hover when pauseOnHover is true', () => {
      render(<SimpleVerticalCarousel intervalMs={1000} pauseOnHover={true} />);

      const container = screen
        .getByText('Test voice 1')
        .closest('div[style*="height"]');

      act(() => {
        container?.dispatchEvent(
          new MouseEvent('mouseenter', { bubbles: true }),
        );
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Should still be on first voice due to hover
      expect(screen.getByText('Test voice 1')).toBeInTheDocument();
    });

    it('should resume on mouse leave', () => {
      render(<SimpleVerticalCarousel intervalMs={1000} pauseOnHover={true} />);

      const container = screen
        .getByText('Test voice 1')
        .closest('div[style*="height"]');

      act(() => {
        container?.dispatchEvent(
          new MouseEvent('mouseenter', { bubbles: true }),
        );
      });

      act(() => {
        container?.dispatchEvent(
          new MouseEvent('mouseleave', { bubbles: true }),
        );
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText('Test voice 2')).toBeInTheDocument();
    });

    it('should not pause on hover when pauseOnHover is false', () => {
      render(<SimpleVerticalCarousel intervalMs={1000} pauseOnHover={false} />);

      const container = screen
        .getByText('Test voice 1')
        .closest('div[style*="height"]');

      act(() => {
        container?.dispatchEvent(
          new MouseEvent('mouseenter', { bubbles: true }),
        );
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText('Test voice 2')).toBeInTheDocument();
    });
  });

  describe('Shuffle Functionality', () => {
    it('should shuffle voices when shuffle is true', () => {
      // Mock Math.random to control shuffle
      const mockRandom = vi.spyOn(Math, 'random');
      mockRandom.mockReturnValueOnce(0.5);

      render(<SimpleVerticalCarousel shuffle={true} />);

      // The shuffle function should have been called
      expect(mockRandom).toHaveBeenCalled();

      mockRandom.mockRestore();
    });

    it('should not shuffle voices when shuffle is false', () => {
      render(<SimpleVerticalCarousel shuffle={false} />);

      // Should render first voice in original order
      expect(screen.getByText('Test voice 1')).toBeInTheDocument();
    });
  });

  describe('Transform Styles', () => {
    it('should apply correct transform for current index', () => {
      render(<SimpleVerticalCarousel intervalMs={1000} />);

      const transformContainer = screen
        .getByText('Test voice 1')
        .closest('.transition-transform');
      expect(transformContainer).toHaveStyle('transform: translateY(-0%)');

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(transformContainer).toHaveStyle('transform: translateY(-100%)');
    });

    it('should have transition classes', () => {
      render(<SimpleVerticalCarousel />);

      const transformContainer = screen
        .getByText('Test voice 1')
        .closest('.transition-transform');
      expect(transformContainer).toHaveClass(
        'transition-transform',
        'duration-500',
        'ease-in-out',
      );
    });
  });

  describe('Voice Item Structure', () => {
    it('should render all voice items', () => {
      render(<SimpleVerticalCarousel />);

      expect(screen.getByText('Test voice 1')).toBeInTheDocument();
      expect(screen.getByText('Test voice 2')).toBeInTheDocument();
      expect(screen.getByText('Test voice 3')).toBeInTheDocument();
    });

    it('should have correct CSS classes for voice items', () => {
      render(<SimpleVerticalCarousel />);

      const figure = screen.getByText('Test voice 1').closest('figure');
      expect(figure).toHaveClass('yk-uvm-item', 'max-w-full');

      const blockquote = screen.getByText('Test voice 1').closest('blockquote');
      expect(blockquote).toHaveClass(
        'yk-uvm-blockquote',
        'text-center',
        'text-sm',
      );
    });

    it('should render voice metadata with correct styling', () => {
      render(<SimpleVerticalCarousel />);

      const metadata = screen.getByText('User 1（20s）');
      expect(metadata).toHaveClass('yk-uvm-meta', 'block', 'mt-2', 'text-xs');
    });
  });

  describe('Default Props', () => {
    it('should use default values for optional props', () => {
      render(<SimpleVerticalCarousel />);

      const container = screen
        .getByText('Test voice 1')
        .closest('div[style*="height"]');
      expect(container).toHaveStyle('height: 120px');

      // Should advance after default 3000ms interval
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByText('Test voice 2')).toBeInTheDocument();
    });
  });

  describe('Memory Management', () => {
    it('should cleanup interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

      const { unmount } = render(<SimpleVerticalCarousel intervalMs={1000} />);

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();

      clearIntervalSpy.mockRestore();
    });

    it('should reset interval when props change', () => {
      const { rerender } = render(<SimpleVerticalCarousel intervalMs={1000} />);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      rerender(<SimpleVerticalCarousel intervalMs={2000} />);

      act(() => {
        vi.advanceTimersByTime(1500); // Should not advance yet with new interval
      });

      expect(screen.getByText('Test voice 1')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(500); // Now it should advance
      });

      expect(screen.getByText('Test voice 2')).toBeInTheDocument();
    });
  });
});
