import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
// Note: For edge-case tests that re-mock data module, use dynamic import
import { UsageExamplesMarquee } from './UsageExamplesMarquee';

// Mock the USAGE_EXAMPLES data
vi.mock('@/data/usage-examples', () => ({
  USAGE_EXAMPLES: [
    { title: 'Example 1', description: 'Description 1' },
    { title: 'Example 2', description: 'Description 2' },
    { title: 'Example 3', description: 'Description 3' },
  ],
}));

// Mock the simple-marquee components
vi.mock('@/components/ui/simple-marquee', () => ({
  Marquee: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={`marquee ${className || ''}`}>{children}</div>,
  MarqueeContent: ({
    children,
    speed,
    pauseOnHover,
  }: {
    children: React.ReactNode;
    speed: number;
    pauseOnHover: boolean;
  }) => (
    <div
      className="marquee-content"
      data-speed={speed}
      data-pause-on-hover={pauseOnHover}
    >
      {children}
    </div>
  ),
  MarqueeFade: ({ side }: { side: string }) => (
    <div className={`marquee-fade-${side}`} />
  ),
  MarqueeItem: ({ children }: { children: React.ReactNode }) => (
    <div className="marquee-item">{children}</div>
  ),
}));

// Mock CSS import
vi.mock('@/components/UsageExamplesMarquee.css', () => ({}));

describe('UsageExamplesMarquee', () => {
  describe('Basic Rendering', () => {
    it('should render all usage examples', () => {
      render(<UsageExamplesMarquee />);

      expect(screen.getByText('Example 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Example 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
      expect(screen.getByText('Example 3')).toBeInTheDocument();
      expect(screen.getByText('Description 3')).toBeInTheDocument();
    });

    it('should render with correct structure', () => {
      render(<UsageExamplesMarquee />);

      const marquee = document.querySelector('.marquee');
      expect(marquee).toBeInTheDocument();

      const content = document.querySelector('.marquee-content');
      expect(content).toBeInTheDocument();

      const items = document.querySelectorAll('.marquee-item');
      expect(items).toHaveLength(3);
    });

    it('should render fade elements on both sides', () => {
      render(<UsageExamplesMarquee />);

      expect(document.querySelector('.marquee-fade-left')).toBeInTheDocument();
      expect(document.querySelector('.marquee-fade-right')).toBeInTheDocument();
    });

    it('should apply custom className to marquee', () => {
      const customClass = 'custom-marquee';
      render(<UsageExamplesMarquee className={customClass} />);

      const marquee = document.querySelector('.marquee');
      expect(marquee).toHaveClass(customClass);
    });
  });

  describe('Props Configuration', () => {
    it('should use default speed of 20', () => {
      render(<UsageExamplesMarquee />);

      const content = document.querySelector('.marquee-content');
      expect(content).toHaveAttribute('data-speed', '20');
    });

    it('should use custom speed when provided', () => {
      render(<UsageExamplesMarquee speed={50} />);

      const content = document.querySelector('.marquee-content');
      expect(content).toHaveAttribute('data-speed', '50');
    });

    it('should use default pauseOnHover of true', () => {
      render(<UsageExamplesMarquee />);

      const content = document.querySelector('.marquee-content');
      expect(content).toHaveAttribute('data-pause-on-hover', 'true');
    });

    it('should use custom pauseOnHover when provided', () => {
      render(<UsageExamplesMarquee pauseOnHover={false} />);

      const content = document.querySelector('.marquee-content');
      expect(content).toHaveAttribute('data-pause-on-hover', 'false');
    });
  });

  describe('Example Items Structure', () => {
    it('should render each example with correct CSS classes', () => {
      render(<UsageExamplesMarquee />);

      const articles = document.querySelectorAll('article.yk-uem-item');
      expect(articles).toHaveLength(3);

      const cards = document.querySelectorAll('.yk-uem-card');
      expect(cards).toHaveLength(3);

      const titles = document.querySelectorAll('.yk-uem-title');
      expect(titles).toHaveLength(3);

      const descriptions = document.querySelectorAll('.yk-uem-description');
      expect(descriptions).toHaveLength(3);
    });

    it('should render titles as h3 elements', () => {
      render(<UsageExamplesMarquee />);

      const titles = document.querySelectorAll('h3.yk-uem-title');
      expect(titles).toHaveLength(3);

      expect(titles[0]).toHaveTextContent('Example 1');
      expect(titles[1]).toHaveTextContent('Example 2');
      expect(titles[2]).toHaveTextContent('Example 3');
    });

    it('should render descriptions as paragraph elements', () => {
      render(<UsageExamplesMarquee />);

      const descriptions = document.querySelectorAll('p.yk-uem-description');
      expect(descriptions).toHaveLength(3);

      expect(descriptions[0]).toHaveTextContent('Description 1');
      expect(descriptions[1]).toHaveTextContent('Description 2');
      expect(descriptions[2]).toHaveTextContent('Description 3');
    });
  });

  describe('Shuffle Functionality', () => {
    it('should shuffle examples when shuffle is true', () => {
      // Mock Math.random to control shuffle
      const mockRandom = vi.spyOn(Math, 'random');
      mockRandom.mockReturnValueOnce(0.5);

      render(<UsageExamplesMarquee shuffle={true} />);

      // The shuffle function should have been called
      expect(mockRandom).toHaveBeenCalled();

      mockRandom.mockRestore();
    });

    it('should not shuffle examples when shuffle is false', () => {
      render(<UsageExamplesMarquee shuffle={false} />);

      // Should render examples in original order
      const items = document.querySelectorAll('.marquee-item');
      expect(items[0]).toHaveTextContent('Example 1');
      expect(items[1]).toHaveTextContent('Example 2');
      expect(items[2]).toHaveTextContent('Example 3');
    });

    it('should not shuffle by default', () => {
      render(<UsageExamplesMarquee />);

      // Should render examples in original order
      const items = document.querySelectorAll('.marquee-item');
      expect(items[0]).toHaveTextContent('Example 1');
      expect(items[1]).toHaveTextContent('Example 2');
      expect(items[2]).toHaveTextContent('Example 3');
    });
  });

  describe('Edge Cases', () => {
    it('should render null if no examples', async () => {
      vi.resetModules();
      vi.doMock('@/data/usage-examples', () => ({
        USAGE_EXAMPLES: [],
      }));
      const { UsageExamplesMarquee: Dynamic } = await import(
        './UsageExamplesMarquee'
      );
      const { container } = render(<Dynamic />);
      expect(container.firstChild).toBeNull();
    });

    it('should handle single example', async () => {
      vi.resetModules();
      vi.doMock('@/data/usage-examples', () => ({
        USAGE_EXAMPLES: [
          { title: 'Single Example', description: 'Single Description' },
        ],
      }));
      const { UsageExamplesMarquee: Dynamic } = await import(
        './UsageExamplesMarquee'
      );
      render(<Dynamic />);

      expect(screen.getByText('Single Example')).toBeInTheDocument();
      expect(screen.getByText('Single Description')).toBeInTheDocument();

      const items = document.querySelectorAll('.marquee-item');
      expect(items).toHaveLength(1);
    });
  });

  describe('Default Props', () => {
    it('should use default values for optional props', () => {
      render(<UsageExamplesMarquee />);

      const content = document.querySelector('.marquee-content');
      expect(content).toHaveAttribute('data-speed', '20');
      expect(content).toHaveAttribute('data-pause-on-hover', 'true');

      const marquee = document.querySelector('.marquee');
      expect(marquee).not.toHaveClass('undefined');
    });

    it('should accept all prop combinations', () => {
      render(
        <UsageExamplesMarquee
          shuffle={true}
          className="test-class"
          speed={100}
          pauseOnHover={false}
        />,
      );

      const marquee = document.querySelector('.marquee');
      expect(marquee).toHaveClass('test-class');

      const content = document.querySelector('.marquee-content');
      expect(content).toHaveAttribute('data-speed', '100');
      expect(content).toHaveAttribute('data-pause-on-hover', 'false');
    });
  });

  describe('Memoization', () => {
    it('should memoize examples based on shuffle prop', () => {
      const { rerender } = render(<UsageExamplesMarquee shuffle={false} />);

      const initialItems = Array.from(
        document.querySelectorAll('.marquee-item'),
      ).map((item) => item.textContent);

      // Rerender with same shuffle value
      rerender(<UsageExamplesMarquee shuffle={false} />);

      const rerenderedItems = Array.from(
        document.querySelectorAll('.marquee-item'),
      ).map((item) => item.textContent);

      expect(rerenderedItems).toEqual(initialItems);
    });
  });

  describe('Accessibility', () => {
    it('should use semantic HTML elements', () => {
      render(<UsageExamplesMarquee />);

      const articles = document.querySelectorAll('article');
      expect(articles).toHaveLength(3);

      const headings = document.querySelectorAll('h3');
      expect(headings).toHaveLength(3);

      const paragraphs = document.querySelectorAll('p');
      expect(paragraphs).toHaveLength(3);
    });
  });
});
