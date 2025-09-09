import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock React DOM's createRoot before importing main
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({ render: mockRender }));

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

// Mock the App component
vi.mock('@/App.tsx', () => ({
  default: () => 'App',
}));

// Mock the HistoricalSeedProvider
vi.mock('@/yk/repo/seed-system', () => ({
  HistoricalSeedProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('main.tsx', () => {
  beforeEach(() => {
    mockCreateRoot.mockClear();
    mockRender.mockClear();
    
    // Mock document.getElementById to return a mock element
    vi.spyOn(document, 'getElementById').mockReturnValue(
      document.createElement('div')
    );
  });

  it('should bootstrap the application and render to root element', async () => {
    // Import main.tsx to execute the bootstrap code
    await import('./main.tsx');

    // Verify the bootstrap process worked
    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});