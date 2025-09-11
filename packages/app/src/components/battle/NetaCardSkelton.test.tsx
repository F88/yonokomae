import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NetaCardSkelton } from './NetaCardSkelton';

describe('NetaCardSkelton', () => {
  it('renders basic skeleton structure', () => {
    render(<NetaCardSkelton />);
    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
  });

  it('applies fullHeight when true', () => {
    const { container } = render(<NetaCardSkelton fullHeight />);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveClass('h-full');
  });

  it('renders decorative background image when imageUrl provided', () => {
    render(<NetaCardSkelton cardBackground={{ imageUrl: '/bg.png' }} />);
    const bg = screen.getByTestId('placeholder').querySelector('img');
    expect(bg).toBeTruthy();
    expect((bg as HTMLImageElement).src).toContain('/bg.png');
  });

  it('applies opacity class to background image', () => {
    render(
      <NetaCardSkelton
        cardBackground={{ imageUrl: '/bg.png', opacityClass: 'opacity-60' }}
      />,
    );
    const img = screen
      .getByTestId('placeholder')
      .querySelector('img') as HTMLImageElement;
    expect(img).toHaveClass('opacity-60');
  });

  it('renders blur overlay when backdropBlur is true', () => {
    render(
      <NetaCardSkelton
        cardBackground={{ imageUrl: '/bg.png', backdropBlur: true }}
      />,
    );
    const blur = screen
      .getByTestId('placeholder')
      .querySelector('.backdrop-blur-sm');
    expect(blur).toBeTruthy();
  });

  it('renders banner placeholder when cropTopBanner=true with default ratio', () => {
    render(<NetaCardSkelton cropTopBanner />);
    const hasAspect = Array.from(
      screen.getByTestId('placeholder').querySelectorAll('*'),
    ).some((el) => (el as HTMLElement).classList?.contains('aspect-[16/7]'));
    expect(hasAspect).toBe(true);
  });

  it('supports multiple aspect ratios', () => {
    const ratios = ['16/9', '16/5', '32/16', '32/31'] as const;
    ratios.forEach((r) => {
      const { unmount } = render(
        <NetaCardSkelton cropTopBanner cropAspectRatio={r} />,
      );
      const hasAspect = Array.from(
        screen.getByTestId('placeholder').querySelectorAll('*'),
      ).some((el) => (el as HTMLElement).classList?.contains(`aspect-[${r}]`));
      expect(hasAspect, `missing class for ${r}`).toBe(true);
      unmount();
    });
  });

  it('disables shimmer when reducedMotion=true', () => {
    render(<NetaCardSkelton cropTopBanner reducedMotion />);
    const anySkeleton = screen
      .getByTestId('placeholder')
      .querySelector('.animate-none');
    expect(anySkeleton).toBeTruthy();
  });
});
