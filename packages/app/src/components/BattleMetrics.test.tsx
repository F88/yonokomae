import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BattleMetrics } from './BattleMetrics';
import type { BattleReportMetrics } from '@yonokomae/types';

describe('BattleMetrics', () => {
  const defaultMetrics: BattleReportMetrics = {
    totalReports: 100,
    generatingCount: 5,
    generationSuccessCount: 80,
    generationErrorCount: 15,
  };

  it('should render all metric values', () => {
    render(<BattleMetrics metrics={defaultMetrics} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should render metric labels', () => {
    render(<BattleMetrics metrics={defaultMetrics} />);

    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('G')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('should have accessible label', () => {
    render(<BattleMetrics metrics={defaultMetrics} />);

    const container = screen.getByLabelText('Battle metrics');
    expect(container).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const customClass = 'custom-test-class';
    render(<BattleMetrics metrics={defaultMetrics} className={customClass} />);

    const container = screen.getByLabelText('Battle metrics');
    expect(container).toHaveClass(customClass);
  });

  it('should handle zero values', () => {
    const zeroMetrics: BattleReportMetrics = {
      totalReports: 0,
      generatingCount: 0,
      generationSuccessCount: 0,
      generationErrorCount: 0,
    };

    render(<BattleMetrics metrics={zeroMetrics} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(4);
  });

  it('should handle large values', () => {
    const largeMetrics: BattleReportMetrics = {
      totalReports: 999999,
      generatingCount: 10000,
      generationSuccessCount: 500000,
      generationErrorCount: 100000,
    };

    render(<BattleMetrics metrics={largeMetrics} />);

    expect(screen.getByText('999999')).toBeInTheDocument();
    expect(screen.getByText('10000')).toBeInTheDocument();
    expect(screen.getByText('500000')).toBeInTheDocument();
    expect(screen.getByText('100000')).toBeInTheDocument();
  });

  describe('Styling', () => {
    it('should apply correct color classes for each metric type', () => {
      render(<BattleMetrics metrics={defaultMetrics} />);

      const container = screen.getByLabelText('Battle metrics');

      // Check that the container has the expected base classes
      expect(container).toHaveClass(
        'flex',
        'flex-wrap',
        'items-center',
        'justify-center',
      );

      // Verify each metric item exists with its label and value
      const items = container.querySelectorAll('.flex.items-center.gap-2');
      expect(items).toHaveLength(4);

      // Check for specific color classes in the rendered output
      const htmlContent = container.innerHTML;
      expect(htmlContent).toContain('bg-amber');
      expect(htmlContent).toContain('bg-emerald');
      expect(htmlContent).toContain('bg-red');
    });

    it('should have proper spacing and layout classes', () => {
      render(<BattleMetrics metrics={defaultMetrics} />);

      const container = screen.getByLabelText('Battle metrics');
      expect(container).toHaveClass('gap-2', 'px-2', 'py-2', 'rounded-md');
    });
  });

  describe('Item Component', () => {
    it('should render each item with label and value', () => {
      render(<BattleMetrics metrics={defaultMetrics} />);

      const container = screen.getByLabelText('Battle metrics');
      const items = container.querySelectorAll('.flex.items-center.gap-2');

      expect(items).toHaveLength(4);

      items.forEach((item) => {
        const label = item.querySelector('.font-medium');
        const value = item.querySelector('.font-semibold');

        expect(label).toBeInTheDocument();
        expect(value).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative values gracefully', () => {
      const negativeMetrics: BattleReportMetrics = {
        totalReports: -1,
        generatingCount: -5,
        generationSuccessCount: -10,
        generationErrorCount: -2,
      };

      render(<BattleMetrics metrics={negativeMetrics} />);

      expect(screen.getByText('-1')).toBeInTheDocument();
      expect(screen.getByText('-5')).toBeInTheDocument();
      expect(screen.getByText('-10')).toBeInTheDocument();
      expect(screen.getByText('-2')).toBeInTheDocument();
    });

    it('should handle decimal values', () => {
      const decimalMetrics: BattleReportMetrics = {
        totalReports: 10.5,
        generatingCount: 2.7,
        generationSuccessCount: 8.3,
        generationErrorCount: 1.2,
      };

      render(<BattleMetrics metrics={decimalMetrics} />);

      expect(screen.getByText('10.5')).toBeInTheDocument();
      expect(screen.getByText('2.7')).toBeInTheDocument();
      expect(screen.getByText('8.3')).toBeInTheDocument();
      expect(screen.getByText('1.2')).toBeInTheDocument();
    });
  });
});
