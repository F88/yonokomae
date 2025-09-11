import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NetaCard, type Props as NetaProps } from './NetaCard';

describe('NetaCard', () => {
  const baseProps: NetaProps = {
    title: 'Test Neta Title',
    subtitle: 'Test Subtitle',
    description: 'Test description text',
    power: 1500,
    cardImage: { imageUrl: 'https://example.com/test-image.jpg' },
  };

  it('renders neta with all basic information', () => {
    render(<NetaCard {...baseProps} />);

    expect(screen.getByText('Test Neta Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test description text')).toBeInTheDocument();
    expect(screen.getByText('Power: 1,500')).toBeInTheDocument();
  });

  it('renders image when cardImage.imageUrl is provided', () => {
    render(<NetaCard {...baseProps} />);

    const image = screen.getByTestId('card-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Neta Title');
  });

  it('does not render image when imageUrl is empty or missing', () => {
    render(<NetaCard {...baseProps} cardImage={{ imageUrl: '' }} />);
    expect(screen.queryByTestId('card-image')).not.toBeInTheDocument();
  });

  it('does not render image when imageUrl is whitespace only', () => {
    render(<NetaCard {...baseProps} cardImage={{ imageUrl: '   ' }} />);
    expect(screen.queryByTestId('card-image')).not.toBeInTheDocument();
  });

  it('applies fullHeight class when fullHeight is true', () => {
    const { container } = render(<NetaCard {...baseProps} fullHeight={true} />);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveClass('h-full');
  });

  it('does not apply fullHeight class when fullHeight is false', () => {
    const { container } = render(
      <NetaCard {...baseProps} fullHeight={false} />,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card).not.toHaveClass('h-full');
  });

  it('applies crop aspect ratio when cropTopBanner is true', () => {
    render(
      <NetaCard {...baseProps} cropTopBanner={true} cropAspectRatio="16/9" />,
    );
    const imageContainer = screen.getByTestId('card-image-container');
    expect(imageContainer).toHaveClass('aspect-[16/9]');
  });

  it('uses default aspect ratio when cropTopBanner is true but cropAspectRatio is not specified', () => {
    render(<NetaCard {...baseProps} cropTopBanner={true} />);
    const imageContainer = screen.getByTestId('card-image-container');
    expect(imageContainer).toHaveClass('aspect-[16/7]');
  });

  it('applies correct focus positioning when cropFocusY is specified', () => {
    render(<NetaCard {...baseProps} cropTopBanner={true} cropFocusY="top" />);
    const image = screen.getByTestId('card-image');
    expect(image).toHaveClass('object-top');
  });

  it('applies correct focus positioning for percentage values', () => {
    render(<NetaCard {...baseProps} cropTopBanner={true} cropFocusY="y-80" />);
    const image = screen.getByTestId('card-image');
    expect(image).toHaveClass('object-[50%_80%]');
  });

  it('uses center focus by default when cropTopBanner is true', () => {
    render(<NetaCard {...baseProps} cropTopBanner={true} />);
    const image = screen.getByTestId('card-image');
    expect(image).toHaveClass('object-center');
  });

  it('does not apply aspect ratio or focus classes when cropTopBanner is false', () => {
    render(
      <NetaCard
        {...baseProps}
        cropTopBanner={false}
        cropAspectRatio="16/9"
        cropFocusY="top"
      />,
    );
    const image = screen.getByTestId('card-image');
    const imageContainer = image.parentElement as HTMLElement;
    expect(imageContainer).not.toHaveClass('aspect-[16/9]');
    expect(image).not.toHaveClass('object-top');
  });

  it('formats power number with thousands separators', () => {
    render(<NetaCard {...baseProps} power={1234567} />);
    expect(screen.getByText('Power: 1,234,567')).toBeInTheDocument();
  });

  it('displays power badge with emoji and correct styling', () => {
    render(<NetaCard {...baseProps} />);
    const powerBadge = screen.getByText('💥').parentElement as HTMLElement;
    expect(powerBadge).toHaveClass('gap-1', 'px-3', 'py-1');
  });

  it('has proper card structure and responsive classes', () => {
    const { container } = render(<NetaCard {...baseProps} />);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveClass('w-full', 'overflow-hidden', 'pt-0', 'max-w-none');
  });

  it('has proper content layout classes', () => {
    render(<NetaCard {...baseProps} />);
    const content = screen
      .getByText('Test Neta Title')
      .closest('.px-2.pt-2.pb-0.flex-1.flex.flex-col') as HTMLElement;
    expect(content).toBeInTheDocument();
  });

  it('supports transparent card background when cardBackground is provided', () => {
    const { container } = render(
      <NetaCard {...baseProps} cardBackground={{}} />,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveClass('!bg-transparent');
  });

  it('renders optional decorative card background image when provided', () => {
    render(
      <NetaCard
        {...baseProps}
        cardBackground={{ imageUrl: '/some/local/bg.png' }}
      />,
    );
    const bg = screen.getByTestId('card-background-image');
    expect(bg).toBeInTheDocument();
    const img = bg.querySelector('img') as HTMLImageElement;
    expect(img).toHaveAttribute('src', '/some/local/bg.png');
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveClass('opacity-30');
  });

  it('applies custom opacity class to background image via cardBackground.opacityClass', () => {
    render(
      <NetaCard
        {...baseProps}
        cardBackground={{ imageUrl: '/bg.png', opacityClass: 'opacity-60' }}
      />,
    );
    const img = screen
      .getByTestId('card-background-image')
      .querySelector('img') as HTMLImageElement;
    expect(img).toHaveClass('opacity-60');
  });

  it('renders blur overlay when backdropBlur is true', () => {
    render(
      <NetaCard
        {...baseProps}
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
            {...baseProps}
            cropTopBanner={true}
            cropAspectRatio={ratio}
          />,
        );
        const imageContainer = screen.getByTestId('card-image-container');
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
          <NetaCard {...baseProps} cropTopBanner={true} cropFocusY={focus} />,
        );
        const image = screen.getByTestId('card-image');
        expect(image).toHaveClass(expectedClass);
      });
    });
  });
});
