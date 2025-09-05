import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveAttribute('data-slot', 'button');
  });

  it('applies correct classes for different variants', () => {
    const variants = [
      'default',
      'blue',
      'destructive',
      'outline',
      'secondary',
      'ghost',
      'link',
    ] as const;

    variants.forEach((variant, index) => {
      const { rerender } = render(
        <Button variant={variant} data-testid={`button-${variant}`}>
          Button
        </Button>,
      );

      const button = screen.getByTestId(`button-${variant}`);
      expect(button).toBeInTheDocument();

      // Check that variant-specific classes are applied
      const classes = button.className;
      switch (variant) {
        case 'default':
          expect(classes).toContain('bg-primary');
          break;
        case 'blue':
          expect(classes).toContain('bg-blue-600');
          break;
        case 'destructive':
          expect(classes).toContain('bg-destructive');
          break;
        case 'outline':
          expect(classes).toContain('border');
          break;
        case 'secondary':
          expect(classes).toContain('bg-secondary');
          break;
        case 'ghost':
          expect(classes).toContain('hover:bg-accent');
          break;
        case 'link':
          expect(classes).toContain('underline-offset-4');
          break;
      }

      if (index < variants.length - 1) {
        rerender(<></>);
      }
    });
  });

  it('applies correct classes for different sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    sizes.forEach((size, index) => {
      const { rerender } = render(
        <Button size={size} data-testid={`button-${size}`}>
          Button
        </Button>,
      );

      const button = screen.getByTestId(`button-${size}`);
      expect(button).toBeInTheDocument();

      // Check that size-specific classes are applied
      const classes = button.className;
      switch (size) {
        case 'default':
          expect(classes).toContain('h-9');
          break;
        case 'sm':
          expect(classes).toContain('h-8');
          break;
        case 'lg':
          expect(classes).toContain('h-10');
          break;
        case 'icon':
          expect(classes).toContain('size-9');
          break;
      }

      if (index < sizes.length - 1) {
        rerender(<></>);
      }
    });
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is provided', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      'disabled:pointer-events-none',
      'disabled:opacity-50',
    );
  });

  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Link Button');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveAttribute('data-slot', 'button');
  });

  it('accepts and passes through other button props', () => {
    render(
      <Button
        type="submit"
        aria-label="Submit form"
        data-testid="submit-button"
      >
        Submit
      </Button>,
    );

    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });

  it('has proper focus-visible styling classes', () => {
    render(<Button>Focus me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[3px]',
    );
  });

  it('has proper aria-invalid styling classes', () => {
    render(<Button aria-invalid="true">Invalid button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'aria-invalid:ring-destructive/20',
      'aria-invalid:border-destructive',
    );
  });

  it('combines variant and size classes correctly', () => {
    render(
      <Button variant="destructive" size="lg">
        Large Destructive
      </Button>,
    );

    const button = screen.getByRole('button');
    const classes = button.className;

    // Should have both variant and size classes
    expect(classes).toContain('bg-destructive'); // variant
    expect(classes).toContain('h-10'); // size
  });

  it('has proper svg styling classes', () => {
    render(<Button>Button with icon</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      '[&_svg]:pointer-events-none',
      "[&_svg:not([class*='size-'])]:size-4",
      '[&_svg]:shrink-0',
    );
  });

  it('applies proper transition and base styling', () => {
    render(<Button>Styled button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'whitespace-nowrap',
      'rounded-md',
      'text-sm',
      'font-medium',
      'transition-all',
      'outline-none',
      'shrink-0',
    );
  });
});
