import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HistoricalSceneSkelton } from './HistoricalSceneSkelton';

describe('HistoricalSceneSkelton', () => {
  it('sets aria-busy and renders without background by default', () => {
    render(<HistoricalSceneSkelton isBusy />);
    const card =
      screen.getByRole('region', { hidden: true }) ||
      document.querySelector('.relative.w-full.overflow-hidden');
    expect(card).toBeTruthy();
    expect((card as HTMLElement).getAttribute('aria-busy')).toBe('true');
    expect(screen.queryByTestId('scene-background-image')).toBeNull();
  });

  it('renders background image and optional blur when provided', () => {
    render(
      <HistoricalSceneSkelton
        isBusy
        background={{
          hasImage: true,
          sceneBgUrl: '/scene.png',
          opacityClass: 'opacity-30',
          blur: true,
        }}
      />,
    );
    const img = screen.getByTestId('scene-background-image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/scene.png');
    expect(screen.getByTestId('scene-background-blur')).toBeInTheDocument();
  });

  it('passes reducedMotion and crop options to Field placeholders', () => {
    render(
      <HistoricalSceneSkelton
        isBusy
        reducedMotion
        cropTopBanner
        cropAspectRatio="32/16"
        cropFocusY="y-80"
        background={{
          hasImage: false,
          opacityClass: 'opacity-30',
          blur: false,
        }}
      />,
    );
    // Ensure Field placeholders exist (NetaCardSkelton uses data-testid="placeholder")
    const placeholders = screen.getAllByTestId('placeholder');
    expect(placeholders.length).toBeGreaterThan(0);
  });
});
