import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from './simple-marquee';

// Mock react-fast-marquee: expose received props as data-* attributes for assertions
vi.mock('react-fast-marquee', () => ({
  default: ({ children, ...props }: any) => {
    const toKebab = (s: string) =>
      s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    const dataProps: Record<string, string> = {};
    for (const [k, v] of Object.entries(props)) {
      if (k.startsWith('data-')) {
        dataProps[k] = String(v);
      } else {
        dataProps[`data-${toKebab(k)}`] = String(v);
      }
    }
    return (
      <div data-testid="fast-marquee" {...dataProps}>
        {children}
      </div>
    );
  },
}));

describe('Marquee Components', () => {
  describe('Marquee', () => {
    it('renders as a container div', () => {
      render(<Marquee data-testid="marquee">Content</Marquee>);

      const marquee = screen.getByTestId('marquee');
      expect(marquee).toBeInTheDocument();
      expect(marquee.tagName).toBe('DIV');
      expect(marquee).toHaveTextContent('Content');
    });

    it('applies default classes', () => {
      render(<Marquee data-testid="marquee" />);

      const marquee = screen.getByTestId('marquee');
      expect(marquee).toHaveClass('relative', 'w-full', 'overflow-hidden');
    });

    it('applies custom className', () => {
      render(<Marquee className="custom-marquee" data-testid="marquee" />);

      const marquee = screen.getByTestId('marquee');
      expect(marquee).toHaveClass('custom-marquee');
      expect(marquee).toHaveClass('relative', 'w-full', 'overflow-hidden');
    });

    it('passes through other props', () => {
      render(
        <Marquee
          data-testid="marquee"
          style={{ height: '200px' }}
          aria-label="Marquee container"
        />,
      );

      const marquee = screen.getByTestId('marquee');
      expect(marquee).toHaveStyle({ height: '200px' });
      expect(marquee).toHaveAttribute('aria-label', 'Marquee container');
    });
  });

  describe('MarqueeContent', () => {
    it('renders with default props', () => {
      render(<MarqueeContent>Scrolling content</MarqueeContent>);

      const content = screen.getByTestId('fast-marquee');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Scrolling content');
    });

    it('applies default props correctly', () => {
      render(<MarqueeContent>Content</MarqueeContent>);

      const content = screen.getByTestId('fast-marquee');
      expect(content).toHaveAttribute('data-loop', '0');
      expect(content).toHaveAttribute('data-auto-fill', 'true');
      expect(content).toHaveAttribute('data-pause-on-hover', 'true');
    });

    it('accepts custom props', () => {
      render(
        <MarqueeContent
          loop={5}
          autoFill={false}
          pauseOnHover={false}
          speed={50}
          direction="right"
        >
          Custom content
        </MarqueeContent>,
      );

      const content = screen.getByTestId('fast-marquee');
      expect(content).toHaveAttribute('data-loop', '5');
      expect(content).toHaveAttribute('data-auto-fill', 'false');
      expect(content).toHaveAttribute('data-pause-on-hover', 'false');
      expect(content).toHaveAttribute('data-speed', '50');
      expect(content).toHaveAttribute('data-direction', 'right');
    });

    it('passes through all FastMarquee props', () => {
      render(
        <MarqueeContent
          gradient={false}
          gradientColor="red"
          gradientWidth={100}
          play={false}
          delay={2000}
        >
          Advanced content
        </MarqueeContent>,
      );

      const content = screen.getByTestId('fast-marquee');
      expect(content).toHaveAttribute('data-gradient', 'false');
      expect(content).toHaveAttribute('data-gradient-color', 'red');
      expect(content).toHaveAttribute('data-gradient-width', '100');
      expect(content).toHaveAttribute('data-play', 'false');
      expect(content).toHaveAttribute('data-delay', '2000');
    });
  });

  describe('MarqueeFade', () => {
    it('renders with required side prop', () => {
      render(<MarqueeFade side="left" data-testid="fade" />);

      const fade = screen.getByTestId('fade');
      expect(fade).toBeInTheDocument();
      expect(fade.tagName).toBe('DIV');
    });

    it('applies correct classes for left side', () => {
      render(<MarqueeFade side="left" data-testid="fade" />);

      const fade = screen.getByTestId('fade');
      expect(fade).toHaveClass(
        'absolute',
        'top-0',
        'bottom-0',
        'z-10',
        'h-full',
        'from-background',
        'to-transparent',
        'left-0',
        'bg-gradient-to-r',
        'w-24', // default width
      );
    });

    it('applies correct classes for right side', () => {
      render(<MarqueeFade side="right" data-testid="fade" />);

      const fade = screen.getByTestId('fade');
      expect(fade).toHaveClass(
        'absolute',
        'top-0',
        'bottom-0',
        'z-10',
        'h-full',
        'from-background',
        'to-transparent',
        'right-0',
        'bg-gradient-to-l',
        'w-24', // default width
      );
    });

    it('applies custom width', () => {
      render(<MarqueeFade side="left" width="w-16" data-testid="fade" />);

      const fade = screen.getByTestId('fade');
      expect(fade).toHaveClass('w-16');
      expect(fade).not.toHaveClass('w-24');
    });

    it('applies custom className', () => {
      render(
        <MarqueeFade
          side="right"
          className="custom-fade opacity-75"
          data-testid="fade"
        />,
      );

      const fade = screen.getByTestId('fade');
      expect(fade).toHaveClass('custom-fade', 'opacity-75');
    });

    it('passes through other props', () => {
      render(
        <MarqueeFade
          side="left"
          data-testid="fade"
          style={{ zIndex: 20 }}
          aria-hidden="true"
        />,
      );

      const fade = screen.getByTestId('fade');
      expect(fade).toHaveStyle({ zIndex: 20 });
      expect(fade).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('MarqueeItem', () => {
    it('renders as a div', () => {
      render(<MarqueeItem data-testid="item">Item content</MarqueeItem>);

      const item = screen.getByTestId('item');
      expect(item).toBeInTheDocument();
      expect(item.tagName).toBe('DIV');
      expect(item).toHaveTextContent('Item content');
    });

    it('applies default classes', () => {
      render(<MarqueeItem data-testid="item" />);

      const item = screen.getByTestId('item');
      expect(item).toHaveClass('mx-2', 'flex-shrink-0', 'object-contain');
    });

    it('applies custom className', () => {
      render(<MarqueeItem className="custom-item p-4" data-testid="item" />);

      const item = screen.getByTestId('item');
      expect(item).toHaveClass('custom-item', 'p-4');
      expect(item).toHaveClass('mx-2', 'flex-shrink-0', 'object-contain');
    });

    it('passes through other props', () => {
      render(
        <MarqueeItem
          data-testid="item"
          onClick={() => {}}
          role="button"
          tabIndex={0}
        >
          Clickable item
        </MarqueeItem>,
      );

      const item = screen.getByTestId('item');
      expect(item).toHaveAttribute('role', 'button');
      expect(item).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Component Integration', () => {
    it('renders a complete marquee structure', () => {
      render(
        <Marquee data-testid="marquee">
          <MarqueeFade side="left" data-testid="left-fade" />
          <MarqueeContent data-testid="content">
            <MarqueeItem data-testid="item1">Item 1</MarqueeItem>
            <MarqueeItem data-testid="item2">Item 2</MarqueeItem>
            <MarqueeItem data-testid="item3">Item 3</MarqueeItem>
          </MarqueeContent>
          <MarqueeFade side="right" data-testid="right-fade" />
        </Marquee>,
      );

      expect(screen.getByTestId('marquee')).toBeInTheDocument();
      expect(screen.getByTestId('left-fade')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('right-fade')).toBeInTheDocument();
      expect(screen.getByTestId('item1')).toBeInTheDocument();
      expect(screen.getByTestId('item2')).toBeInTheDocument();
      expect(screen.getByTestId('item3')).toBeInTheDocument();
    });

    it('handles different fade configurations', () => {
      render(
        <Marquee>
          <MarqueeFade side="left" width="w-8" />
          <MarqueeFade side="right" width="w-12" />
        </Marquee>,
      );

      const fades = screen.getAllByRole('generic');
      // Find fade elements by their classes
      const leftFade = fades.find((el) => el.classList.contains('left-0'));
      const rightFade = fades.find((el) => el.classList.contains('right-0'));

      expect(leftFade).toHaveClass('w-8', 'bg-gradient-to-r');
      expect(rightFade).toHaveClass('w-12', 'bg-gradient-to-l');
    });
  });
});
