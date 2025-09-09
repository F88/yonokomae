import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRotateHistoricalSeed } from './use-rotate-seed';

// Mock the useHistoricalSeedSelection hook
vi.mock('@/yk/repo/seed-system', () => ({
  useHistoricalSeedSelection: vi.fn(),
}));

// Import the mocked function after the mock
import { useHistoricalSeedSelection } from '@/yk/repo/seed-system';
const mockUseHistoricalSeedSelection = vi.mocked(useHistoricalSeedSelection);

describe('useRotateHistoricalSeed', () => {
  const mockRotateSeed = vi.fn();

  beforeEach(() => {
    mockRotateSeed.mockClear();
    mockUseHistoricalSeedSelection.mockClear();
  });

  it('returns a function that calls context rotateSeed', () => {
    // Mock context with rotateSeed function
    mockUseHistoricalSeedSelection.mockReturnValue({
      rotateSeed: mockRotateSeed,
    } as any);

    const { result } = renderHook(() => useRotateHistoricalSeed());

    // Should return a function
    expect(typeof result.current).toBe('function');

    // Call the returned function
    act(() => {
      result.current();
    });

    // Should call the context's rotateSeed function
    expect(mockRotateSeed).toHaveBeenCalledTimes(1);
  });

  it('handles null context gracefully', () => {
    // Mock context as null
    mockUseHistoricalSeedSelection.mockReturnValue(null);

    const { result } = renderHook(() => useRotateHistoricalSeed());

    // Should return a function even with null context
    expect(typeof result.current).toBe('function');

    // Calling the function should not throw with null context
    expect(() => {
      act(() => {
        result.current();
      });
    }).not.toThrow();

    // Should not call any function
    expect(mockRotateSeed).not.toHaveBeenCalled();
  });

  it('handles undefined context gracefully', () => {
    // Mock context as undefined
    mockUseHistoricalSeedSelection.mockReturnValue(undefined);

    const { result } = renderHook(() => useRotateHistoricalSeed());

    // Should return a function even with undefined context
    expect(typeof result.current).toBe('function');

    // Calling the function should not throw with undefined context
    expect(() => {
      act(() => {
        result.current();
      });
    }).not.toThrow();

    // Should not call any function
    expect(mockRotateSeed).not.toHaveBeenCalled();
  });

  it('returns stable callback reference', () => {
    // Mock context with rotateSeed function
    const mockContext = { rotateSeed: mockRotateSeed };
    mockUseHistoricalSeedSelection.mockReturnValue(mockContext as any);

    const { result, rerender } = renderHook(() => useRotateHistoricalSeed());
    const firstCallback = result.current;

    // Re-render with same context
    rerender();
    const secondCallback = result.current;

    // Should return the same reference when context hasn't changed
    expect(firstCallback).toBe(secondCallback);
  });

  it('can be called multiple times safely', () => {
    // Mock context with rotateSeed function
    mockUseHistoricalSeedSelection.mockReturnValue({
      rotateSeed: mockRotateSeed,
    } as any);

    const { result } = renderHook(() => useRotateHistoricalSeed());

    // Call the function multiple times
    act(() => {
      result.current();
      result.current();
      result.current();
    });

    // Should call rotateSeed for each invocation
    expect(mockRotateSeed).toHaveBeenCalledTimes(3);
  });
});