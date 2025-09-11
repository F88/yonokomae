import { render, screen } from '@testing-library/react';
import type { Neta } from '@yonokomae/types';
import { describe, expect, it } from 'vitest';
import { NetaCard, type Props as NetaProps } from './NetaCard';

describe('NetaCard', () => {
  const baseMockNeta: Neta = {
    title: 'Test Neta Title',
    subtitle: 'Test Subtitle',
    description: 'Test description text',
    power: 1500,
    imageUrl: 'https://example.com/test-image.jpg',
  };

  it('renders neta with all basic information', () => {
    render(<NetaCard {...baseMockNeta} />);

    expect(screen.getByText('Test Neta Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test description text')).toBeInTheDocument();
    expect(screen.getByText('Power: 1,500')).toBeInTheDocument();
  });

  it('renders image when imageUrl is provided', () => {
    render(<NetaCard {...baseMockNeta} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Neta Title');
  });

  it('does not render image when imageUrl is empty or missing', () => {
    render(<NetaCard {...baseMockNeta} imageUrl="" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('does not render image when imageUrl is whitespace only', () => {
    render(<NetaCard {...baseMockNeta} imageUrl="   " />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies fullHeight class when fullHeight is true', () => {
    const { container } = render(
      <NetaCard {...baseMockNeta} fullHeight={true} />,
    );

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass('h-full');
  });

  it('does not apply fullHeight class when fullHeight is false', () => {
    const { container } = render(
      <NetaCard {...baseMockNeta} fullHeight={false} />,
    );

    const card = container.querySelector('[data-slot="card"]');
    expect(card).not.toHaveClass('h-full');
  });

  it('applies crop aspect ratio when cropTopBanner is true', () => {
    render(
      <NetaCard
        {...baseMockNeta}
        cropTopBanner={true}
        cropAspectRatio="16/9"
      />,
    );

    const imageContainer = screen.getByRole('img').parentElement;
    expect(imageContainer).toHaveClass('aspect-[16/9]');
  });

  it('uses default aspect ratio when cropTopBanner is true but cropAspectRatio is not specified', () => {
    render(<NetaCard {...baseMockNeta} cropTopBanner={true} />);

    const imageContainer = screen.getByRole('img').parentElement;
    expect(imageContainer).toHaveClass('aspect-[16/7]');
  });

  it('applies correct focus positioning when cropFocusY is specified', () => {
    render(
      <NetaCard {...baseMockNeta} cropTopBanner={true} cropFocusY="top" />,
    );

    const image = screen.getByRole('img');
    expect(image).toHaveClass('object-top');
  });

  it('applies correct focus positioning for percentage values', () => {
    render(
      <NetaCard {...baseMockNeta} cropTopBanner={true} cropFocusY="y-80" />,
    );

    const image = screen.getByRole('img');
    expect(image).toHaveClass('object-[50%_80%]');
  });

  it('uses center focus by default when cropTopBanner is true', () => {
    render(<NetaCard {...baseMockNeta} cropTopBanner={true} />);

    const image = screen.getByRole('img');
    expect(image).toHaveClass('object-center');
  });

  it('does not apply aspect ratio or focus classes when cropTopBanner is false', () => {
    render(
      <NetaCard
        {...baseMockNeta}
        cropTopBanner={false}
        cropAspectRatio="16/9"
        cropFocusY="top"
      />,
    );

    const image = screen.getByRole('img');
    const imageContainer = image.parentElement!;

    expect(imageContainer).not.toHaveClass('aspect-[16/9]');
    expect(image).not.toHaveClass('object-top');
  });

  it('formats power number with thousands separators', () => {
    render(<NetaCard {...baseMockNeta} power={1234567} />);

    expect(screen.getByText('Power: 1,234,567')).toBeInTheDocument();
  });

  it('displays power badge with emoji and correct styling', () => {
    render(<NetaCard {...baseMockNeta} />);

    const powerBadge = screen.getByText('💥').parentElement;
    expect(powerBadge).toHaveClass('gap-1', 'px-3', 'py-1');
    expect(powerBadge?.getAttribute('data-slot')).toBe('badge');
  });

  it('has proper card structure and responsive classes', () => {
    const { container } = render(<NetaCard {...baseMockNeta} />);

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass('w-full', 'overflow-hidden', 'pt-0', 'max-w-none');
  });

  it('has proper content layout classes', () => {
    render(<NetaCard {...baseMockNeta} />);

    const content = screen
      .getByText('Test Neta Title')
      .closest('[data-slot="card-content"]');
    expect(content).toHaveClass(
      'px-2',
      'pt-2',
      'pb-0',
      'flex-1',
      'flex',
      'flex-col',
    );
  });

  it('supports transparent card background when cardBackground is provided', () => {
    const { container } = render(
      <NetaCard {...baseMockNeta} cardBackground={{}} />,
    );

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass('!bg-transparent');
  });

  it('renders optional decorative card background image when provided', () => {
    render(
      <NetaCard
        {...baseMockNeta}
        cardBackground={{ imageUrl: '/some/local/bg.png' }}
      />,
    );

    const bg = screen.getByTestId('card-background-image');
    expect(bg).toBeInTheDocument();
    const img = bg.querySelector('img');
    expect(img).toHaveAttribute('src', '/some/local/bg.png');
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveClass('opacity-30');
  });

  it('applies custom opacity to background image via cardBackground.opacity', () => {
    render(
      <NetaCard
        {...baseMockNeta}
        cardBackground={{ imageUrl: '/bg.png', opacity: 0.62 }}
      />,
    );
    const img = screen
      .getByTestId('card-background-image')
      .querySelector('img');
    // nearest from steps to 62% is 60
    expect(img).toHaveClass('opacity-60');
  });

  it('renders blur overlay when backdropBlur is true', () => {
    render(
      <NetaCard
        {...baseMockNeta}
        cardBackground={{ imageUrl: '/bg.png', backdropBlur: true }}
      />,
    );
    const blur = screen.getByTestId('card-background-blur');
    expect(blur).toBeInTheDocument();
  });

  describe('different aspect ratios', () => {
    const testAspectRatios: Array<{
      ratio: NonNullable<NetaProps['cropAspectRatio']>;
      expectedClass: string;
    }> = [
      { ratio: '16/1', expectedClass: 'aspect-[16/1]' },
      { ratio: '16/8', expectedClass: 'aspect-[16/8]' },
      { ratio: '32/16', expectedClass: 'aspect-[32/16]' },
      { ratio: '32/31', expectedClass: 'aspect-[32/31]' },
    ];

    testAspectRatios.forEach(({ ratio, expectedClass }) => {
      it(`applies correct class for aspect ratio ${ratio}`, () => {
        render(
          <NetaCard
            {...baseMockNeta}
            cropTopBanner={true}
            cropAspectRatio={ratio}
          />,
        );

        const imageContainer = screen.getByRole('img').parentElement;
        expect(imageContainer).toHaveClass(expectedClass);
      });
    });
  });

  describe('different focus positions', () => {
    const testFocusPositions: Array<{
      focus: NonNullable<NetaProps['cropFocusY']>;
      expectedClass: string;
    }> = [
      { focus: 'top', expectedClass: 'object-top' },
      { focus: 'center', expectedClass: 'object-center' },
      { focus: 'bottom', expectedClass: 'object-bottom' },
      { focus: 'y-0', expectedClass: 'object-[50%_0%]' },
      { focus: 'y-50', expectedClass: 'object-[50%_50%]' },
      { focus: 'y-100', expectedClass: 'object-[50%_100%]' },
    ];

    testFocusPositions.forEach(({ focus, expectedClass }) => {
      it(`applies correct class for focus position ${focus}`, () => {
        render(
          <NetaCard
            {...baseMockNeta}
            cropTopBanner={true}
            cropFocusY={focus}
          />,
        );

        const image = screen.getByRole('img');
        expect(image).toHaveClass(expectedClass);
      });
    });
  });
});
