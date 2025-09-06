import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-slot', 'badge');
  });

  it('applies correct classes for different variants', () => {
    const variants = [
      'default',
      'secondary',
      'destructive',
      'outline',
    ] as const;

    variants.forEach((variant, index) => {
      const { rerender } = render(
        <Badge variant={variant} data-testid={`badge-${variant}`}>
          Badge
        </Badge>,
      );

      const badge = screen.getByTestId(`badge-${variant}`);
      expect(badge).toBeInTheDocument();

      // Check that variant-specific classes are applied
      const classes = badge.className;
      switch (variant) {
        case 'default':
          expect(classes).toContain('bg-primary');
          expect(classes).toContain('text-primary-foreground');
          break;
        case 'secondary':
          expect(classes).toContain('bg-secondary');
          expect(classes).toContain('text-secondary-foreground');
          break;
        case 'destructive':
          expect(classes).toContain('bg-destructive');
          expect(classes).toContain('text-white');
          break;
        case 'outline':
          expect(classes).toContain('text-foreground');
          break;
      }

      // All variants should have border-transparent except outline
      if (variant !== 'outline') {
        expect(classes).toContain('border-transparent');
      }

      if (index < variants.length - 1) {
        rerender(<></>);
      }
    });
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge-class">Custom Badge</Badge>);

    const badge = screen.getByText('Custom Badge');
    expect(badge).toHaveClass('custom-badge-class');
  });

  it('renders as span by default', () => {
    render(<Badge>Span Badge</Badge>);

    const badge = screen.getByText('Span Badge');
    expect(badge.tagName).toBe('SPAN');
  });

  it('renders as child component when asChild is true', () => {
    render(
      <Badge asChild>
        <a href="/badge-link">Link Badge</a>
      </Badge>,
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Link Badge');
    expect(link).toHaveAttribute('href', '/badge-link');
    expect(link).toHaveAttribute('data-slot', 'badge');
  });

  it('accepts and passes through other span props', () => {
    render(
      <Badge
        title="Badge tooltip"
        aria-label="Status badge"
        data-testid="custom-badge"
      >
        Status
      </Badge>,
    );

    const badge = screen.getByTestId('custom-badge');
    expect(badge).toHaveAttribute('title', 'Badge tooltip');
    expect(badge).toHaveAttribute('aria-label', 'Status badge');
  });

  it('has proper base styling classes', () => {
    render(<Badge>Styled badge</Badge>);

    const badge = screen.getByText('Styled badge');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md',
      'border',
      'px-2',
      'py-0.5',
      'text-xs',
      'font-medium',
      'w-fit',
      'whitespace-nowrap',
      'shrink-0',
      'gap-1',
      'overflow-hidden',
    );
  });

  it('has proper focus-visible styling classes', () => {
    render(<Badge>Focus badge</Badge>);

    const badge = screen.getByText('Focus badge');
    expect(badge).toHaveClass(
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[3px]',
    );
  });

  it('has proper aria-invalid styling classes', () => {
    render(<Badge aria-invalid="true">Invalid badge</Badge>);

    const badge = screen.getByText('Invalid badge');
    expect(badge).toHaveClass(
      'aria-invalid:ring-destructive/20',
      'aria-invalid:border-destructive',
    );
  });

  it('has proper svg styling classes', () => {
    render(<Badge>Badge with icon</Badge>);

    const badge = screen.getByText('Badge with icon');
    expect(badge).toHaveClass('[&>svg]:size-3', '[&>svg]:pointer-events-none');
  });

  it('has proper hover styling for links', () => {
    render(<Badge>Hoverable badge</Badge>);

    const badge = screen.getByText('Hoverable badge');
    expect(badge).toHaveClass('transition-[color,box-shadow]');
  });

  it('applies destructive variant focus styling', () => {
    render(<Badge variant="destructive">Destructive badge</Badge>);

    const badge = screen.getByText('Destructive badge');
    expect(badge).toHaveClass(
      'focus-visible:ring-destructive/20',
      'dark:focus-visible:ring-destructive/40',
      'dark:bg-destructive/60',
    );
  });

  it('renders with icon content', () => {
    render(
      <Badge>
        <svg data-testid="badge-icon" />
        Badge with icon
      </Badge>,
    );

    const badge = screen.getByText('Badge with icon');
    const icon = screen.getByTestId('badge-icon');

    expect(badge).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(badge).toContainElement(icon);
  });

  it('handles empty content', () => {
    render(<Badge data-testid="empty-badge"></Badge>);

    const badge = screen.getByTestId('empty-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toBeEmptyDOMElement();
  });
});
