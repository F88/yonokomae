import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserManual } from './UserManual';

// Mock USAGE_EXAMPLES data
vi.mock('@/data/usage-examples', () => ({
  USAGE_EXAMPLES: [
    { title: 'Example 1', description: 'Description 1' },
    { title: 'Example 2', description: 'Description 2' },
  ],
}));

// Mock UserVoicesCarousel component
vi.mock('./UserVoicesCarousel', () => ({
  default: ({
    intervalMs,
    pauseOnHover,
    orientation,
    containerHeight,
    showControls,
  }: {
    intervalMs: number;
    pauseOnHover: boolean;
    orientation: string;
    containerHeight: string;
    showControls: boolean;
  }) => (
    <div
      data-testid="user-voices-carousel"
      data-interval={intervalMs}
      data-pause-on-hover={pauseOnHover}
      data-orientation={orientation}
      data-container-height={containerHeight}
      data-show-controls={showControls}
    >
      User Voices Carousel
    </div>
  ),
}));

// Mock ReactDOM.createPortal (React 19 ESM compatible)
vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof import('react-dom')>('react-dom');
  return {
    ...actual,
    default: actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

describe('UserManual', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('Modal Visibility', () => {
    it('should render when isOpen is true', () => {
      render(<UserManual isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('取扱説明書')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<UserManual isOpen={false} onClose={mockOnClose} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should return null when closed', () => {
      const { container } = render(
        <UserManual isOpen={false} onClose={mockOnClose} />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Modal Structure', () => {
    beforeEach(() => {
      render(<UserManual isOpen={true} onClose={mockOnClose} />);
    });

    it('should have correct dialog attributes', () => {
      const dialog = screen.getByRole('dialog');

      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'user-manual-title');
      expect(dialog).toHaveAttribute('id', 'user-manual-dialog');
    });

    it('should render title with correct text', () => {
      const title = screen.getByRole('heading', {
        name: '取扱説明書',
        level: 2,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('id', 'user-manual-title');
    });

    it('should render close button with correct attributes', () => {
      const closeButton = screen.getByRole('button', { name: 'Close' });

      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('aria-label', 'Close');
      expect(closeButton).toHaveTextContent('✕');
    });

    it('should render user voices section', () => {
      expect(screen.getByText('個人の感想')).toBeInTheDocument();
      expect(screen.getByTestId('user-voices-carousel')).toBeInTheDocument();
    });

    it('should render usage examples section', () => {
      expect(screen.getByText('活用例')).toBeInTheDocument();
      expect(screen.getByText('Example 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Example 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    beforeEach(() => {
      render(<UserManual isOpen={true} onClose={mockOnClose} />);
    });

    it('should call onClose when close button is clicked', () => {
      const closeButton = screen.getByRole('button', { name: 'Close' });

      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      const backdrop = screen.getByRole('dialog').parentElement;

      fireEvent.click(backdrop!);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when modal content is clicked', () => {
      const dialog = screen.getByRole('dialog');

      fireEvent.click(dialog);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key is pressed', () => {
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose for other keys', () => {
      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Space' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Behavior', () => {
    it('should prevent body scroll when modal is open', () => {
      render(<UserManual isOpen={true} onClose={mockOnClose} />);

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when modal is closed', () => {
      const { rerender } = render(
        <UserManual isOpen={true} onClose={mockOnClose} />,
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(<UserManual isOpen={false} onClose={mockOnClose} />);

      expect(document.body.style.overflow).toBe('');
    });

    it('should restore body scroll on unmount', () => {
      const { unmount } = render(
        <UserManual isOpen={true} onClose={mockOnClose} />,
      );

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Event Listeners', () => {
    it('should add keydown listener when modal opens', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      render(<UserManual isOpen={true} onClose={mockOnClose} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
    });

    it('should remove keydown listener when modal closes', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { rerender } = render(
        <UserManual isOpen={true} onClose={mockOnClose} />,
      );

      rerender(<UserManual isOpen={false} onClose={mockOnClose} />);

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });

    it('should not add keydown listener when modal is initially closed', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      render(<UserManual isOpen={false} onClose={mockOnClose} />);

      expect(addEventListenerSpy).not.toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
    });
  });

  describe('UserVoicesCarousel Props', () => {
    it('should pass correct props to UserVoicesCarousel', () => {
      render(<UserManual isOpen={true} onClose={mockOnClose} />);

      const carousel = screen.getByTestId('user-voices-carousel');

      expect(carousel).toHaveAttribute('data-interval', '3000');
      expect(carousel).toHaveAttribute('data-pause-on-hover', 'true');
      expect(carousel).toHaveAttribute('data-orientation', 'vertical');
      expect(carousel).toHaveAttribute('data-container-height', '100px');
      expect(carousel).toHaveAttribute('data-show-controls', 'false');
    });
  });

  describe('Usage Examples Rendering', () => {
    beforeEach(() => {
      render(<UserManual isOpen={true} onClose={mockOnClose} />);
    });

    it('should render all usage examples', () => {
      const exampleTitles = screen.getAllByRole('heading', { level: 4 });
      expect(exampleTitles).toHaveLength(2);

      expect(screen.getByText('Example 1')).toBeInTheDocument();
      expect(screen.getByText('Example 2')).toBeInTheDocument();
    });

    it('should render usage examples with correct styling', () => {
      const examples = document.querySelectorAll('.p-4.bg-muted\\/50');
      expect(examples).toHaveLength(2);

      const borders = document.querySelectorAll('.border-l-blue-500');
      expect(borders).toHaveLength(2);
    });
  });

  describe('Modal Height Configuration', () => {
    it('should use default height of 80vh', () => {
      render(<UserManual isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveStyle('height: 80vh');
    });

    it('should use custom height when provided', () => {
      render(
        <UserManual isOpen={true} onClose={mockOnClose} modalHeight="60vh" />,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveStyle('height: 60vh');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(<UserManual isOpen={true} onClose={mockOnClose} />);
    });

    it('should have proper heading hierarchy', () => {
      const h2 = screen.getByRole('heading', { level: 2 });
      const h3 = screen.getByRole('heading', { level: 3 });
      const h4s = screen.getAllByRole('heading', { level: 4 });

      expect(h2).toHaveTextContent('取扱説明書');
      expect(h3).toHaveTextContent('活用例');
      expect(h4s).toHaveLength(2);
    });

    it('should have focusable content area', () => {
      const contentArea = screen.getByLabelText('User manual content');

      expect(contentArea).toHaveAttribute('tabindex', '0');
      expect(contentArea).toHaveAttribute('aria-label', 'User manual content');
    });

    it('should have proper aria relationships', () => {
      const dialog = screen.getByRole('dialog');
      const title = screen.getByRole('heading', { level: 2 });

      expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    });
  });

  describe('Styling Classes', () => {
    beforeEach(() => {
      render(<UserManual isOpen={true} onClose={mockOnClose} />);
    });

    it('should have proper backdrop styling', () => {
      const backdrop = screen.getByRole('dialog').parentElement;

      expect(backdrop).toHaveClass(
        'fixed',
        'inset-0',
        'bg-black/60',
        'backdrop-blur-sm',
        'z-[9999]',
        'flex',
        'items-center',
        'justify-center',
      );
    });

    it('should have proper modal styling', () => {
      const dialog = screen.getByRole('dialog');

      expect(dialog).toHaveClass(
        'relative',
        'bg-background',
        'border',
        'border-border',
        'rounded-2xl',
        'shadow-2xl',
        'w-full',
        'max-w-3xl',
      );
    });

    it('should have proper close button styling', () => {
      const closeButton = screen.getByRole('button', { name: 'Close' });

      expect(closeButton).toHaveClass(
        'absolute',
        'top-4',
        'right-4',
        'bg-background',
        'border-2',
        'border-border',
        'rounded-full',
        'text-xl',
        'cursor-pointer',
        'w-10',
        'h-10',
      );
    });
  });
});
