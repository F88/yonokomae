import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';
import * as ReducedMotion from '@/lib/reduced-motion';

// Mock the dependencies
vi.mock('@/lib/reduced-motion', () => ({
  scrollToY: vi.fn(),
}));

vi.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

vi.mock('@/components/ReducedMotionModeToggle', () => ({
  ReducedMotionModeToggle: () => (
    <div data-testid="reduced-motion-toggle">Reduced Motion Toggle</div>
  ),
}));

vi.mock('@/components/FontSizeControl', () => ({
  FontSizeControl: () => (
    <div data-testid="font-size-control">Font Size Control</div>
  ),
}));

vi.mock('@/components/UserManual', () => ({
  UserManual: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="user-manual">
        User Manual
        <button data-testid="close-manual" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

describe('Header', () => {
  it('renders the main title', () => {
    render(<Header />);

    expect(screen.getByText('よのこまえ')).toBeInTheDocument();
  });

  it('renders scroll to top button', () => {
    render(<Header />);

    const scrollButton = screen.getByRole('button', { name: 'Scroll to top' });
    expect(scrollButton).toBeInTheDocument();
    expect(scrollButton).toHaveAttribute('title', 'Scroll to top');
  });

  it('calls scrollToY when scroll to top button is clicked', () => {
    render(<Header />);

    const scrollButton = screen.getByRole('button', { name: 'Scroll to top' });
    fireEvent.click(scrollButton);

    expect(ReducedMotion.scrollToY).toHaveBeenCalledWith(0);
  });

  it('renders mode badge when mode is provided', () => {
    const mockMode = {
      id: 'test-mode',
      title: 'Test Mode',
      description: 'Test mode description',
      enabled: true,
    };

    render(<Header mode={mockMode} />);

    const modeBadge = screen.getByText('Test Mode');
    expect(modeBadge).toBeInTheDocument();
    expect(modeBadge).toHaveAttribute('title', 'Test Mode');
    expect(modeBadge).toHaveAttribute('aria-label', 'Mode: Test Mode');
  });

  it('does not render mode badge when mode is not provided', () => {
    render(<Header />);

    expect(
      screen.queryByRole('generic', { name: /Mode:/ }),
    ).not.toBeInTheDocument();
  });

  it('renders user manual button', () => {
    render(<Header />);

    const manualButton = screen.getByRole('button', {
      name: 'Open user manual',
    });
    expect(manualButton).toBeInTheDocument();
    expect(manualButton).toHaveAttribute('title', '取扱説明書');
    expect(manualButton).toHaveAttribute('aria-haspopup', 'dialog');
    expect(manualButton).toHaveAttribute('aria-controls', 'user-manual-dialog');
  });

  it('opens user manual when button is clicked', () => {
    render(<Header />);

    const manualButton = screen.getByRole('button', {
      name: 'Open user manual',
    });
    fireEvent.click(manualButton);

    expect(screen.getByTestId('user-manual')).toBeInTheDocument();
  });

  it('closes user manual when close is called', () => {
    render(<Header />);

    // Open manual
    const manualButton = screen.getByRole('button', {
      name: 'Open user manual',
    });
    fireEvent.click(manualButton);
    expect(screen.getByTestId('user-manual')).toBeInTheDocument();

    // Close manual
    const closeButton = screen.getByTestId('close-manual');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('user-manual')).not.toBeInTheDocument();
  });

  it('renders all control components', () => {
    render(<Header />);

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('reduced-motion-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('font-size-control')).toBeInTheDocument();
  });

  it('has proper header structure and styling', () => {
    const { container } = render(<Header />);

    const headerDiv = container.firstElementChild;
    expect(headerDiv).toHaveClass(
      'flex',
      'w-full',
      'px-2',
      'items-center',
      'justify-between',
    );
  });

  it('has proper button styling for scroll to top', () => {
    render(<Header />);

    const scrollButton = screen.getByRole('button', { name: 'Scroll to top' });
    expect(scrollButton).toHaveClass(
      'inline-flex',
      'h-6',
      'w-6',
      'items-center',
      'justify-center',
      'rounded',
      'hover:bg-muted/50',
    );
  });

  it('has proper button styling for manual button', () => {
    render(<Header />);

    const manualButton = screen.getByRole('button', {
      name: 'Open user manual',
    });
    expect(manualButton).toHaveClass(
      'inline-flex',
      'h-9',
      'w-9',
      'items-center',
      'justify-center',
      'rounded-md',
    );
  });

  it('mode badge has responsive classes', () => {
    const mockMode = {
      id: 'test-mode',
      title: 'Test Mode',
      description: 'Test mode description',
      enabled: true,
    };

    render(<Header mode={mockMode} />);

    const modeBadge = screen.getByText('Test Mode');
    expect(modeBadge).toHaveClass(
      'inline-flex',
      'max-w-[45vw]',
      'truncate',
      'sm:max-w-none',
    );
  });

  describe('accessibility', () => {
    it('has proper ARIA attributes for manual button', () => {
      render(<Header />);

      const manualButton = screen.getByRole('button', {
        name: 'Open user manual',
      });
      expect(manualButton).toHaveAttribute('aria-haspopup', 'dialog');
      expect(manualButton).toHaveAttribute(
        'aria-controls',
        'user-manual-dialog',
      );
    });

    it('has proper title attributes for buttons', () => {
      render(<Header />);

      const scrollButton = screen.getByRole('button', {
        name: 'Scroll to top',
      });
      const manualButton = screen.getByRole('button', {
        name: 'Open user manual',
      });

      expect(scrollButton).toHaveAttribute('title', 'Scroll to top');
      expect(manualButton).toHaveAttribute('title', '取扱説明書');
    });
  });

  describe('component integration', () => {
    it('user manual receives correct props', () => {
      render(<Header />);

      // Open manual to check props
      const manualButton = screen.getByRole('button', {
        name: 'Open user manual',
      });
      fireEvent.click(manualButton);

      const userManual = screen.getByTestId('user-manual');
      expect(userManual).toBeInTheDocument();
    });

    it('manages manual open state correctly', () => {
      render(<Header />);

      const manualButton = screen.getByRole('button', {
        name: 'Open user manual',
      });

      // Initially closed
      expect(screen.queryByTestId('user-manual')).not.toBeInTheDocument();

      // Open
      fireEvent.click(manualButton);
      expect(screen.getByTestId('user-manual')).toBeInTheDocument();

      // Close
      const closeButton = screen.getByTestId('close-manual');
      fireEvent.click(closeButton);
      expect(screen.queryByTestId('user-manual')).not.toBeInTheDocument();
    });
  });
});
