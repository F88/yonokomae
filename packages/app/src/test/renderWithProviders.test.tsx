import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './renderWithProviders';

// Simple test component
function TestComponent() {
  return <div data-testid="test-component">Test Content</div>;
}

describe('renderWithProviders', () => {
  it('renders component with default options', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('renders component with mode option', () => {
    const mockMode = {
      id: 'test-mode' as const,
      title: 'Test Mode',
      description: 'Test description',
      enabled: true,
    };
    
    renderWithProviders(<TestComponent />, { mode: mockMode });
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('renders component with undefined mode', () => {
    renderWithProviders(<TestComponent />, { mode: undefined });
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('renders component with empty options', () => {
    renderWithProviders(<TestComponent />, {});
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});