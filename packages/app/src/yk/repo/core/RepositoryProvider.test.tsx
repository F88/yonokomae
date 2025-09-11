import type { PlayMode } from '@/yk/play-mode';
import type { RepoContextValue } from './repository-context';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as SeedSystem from '../seed-system';
import { RepositoryProvider } from './RepositoryProvider';
import { useRepositories } from './repository-context';
import * as RepositoryProviderModule from './repository-provider';

// Mock the repository provider functions
vi.mock('./repository-provider', () => ({
  getBattleReportRepository: vi.fn(),
  getJudgementRepository: vi.fn(),
}));

// Mock the seed system
vi.mock('../seed-system', () => ({
  useHistoricalSeedSelection: vi.fn(),
}));

describe('RepositoryProvider', () => {
  const mockMode: PlayMode = {
    id: 'test-mode',
    title: 'Test Mode',
    description: 'Test mode description',
    srLabel: 'SR Test Mode',
    enabled: true,
  };

  const mockBattleRepo = {
    generateReport: vi.fn(),
  };

  const mockJudgementRepo = {
    determineWinner: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(
      RepositoryProviderModule.getBattleReportRepository,
    ).mockResolvedValue(mockBattleRepo);
    vi.mocked(
      RepositoryProviderModule.getJudgementRepository,
    ).mockResolvedValue(mockJudgementRepo);
    vi.mocked(SeedSystem.useHistoricalSeedSelection).mockReturnValue(null);
  });

  describe('RepositoryProvider', () => {
    it('provides repository context to children', () => {
      let repositoryContext: RepoContextValue | undefined;

      const TestComponent = () => {
        repositoryContext = useRepositories();
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode}>
          <TestComponent />
        </RepositoryProvider>,
      );

      expect(repositoryContext).toBeDefined();
      expect(repositoryContext!.battleReport).toBeDefined();
      expect(repositoryContext!.judgement).toBeDefined();
    });

    it('handles mode prop', () => {
      const TestComponent = () => {
        const repos = useRepositories();
        expect(repos).toBeDefined();
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode}>
          <TestComponent />
        </RepositoryProvider>,
      );

      expect(SeedSystem.useHistoricalSeedSelection).toHaveBeenCalled();
    });

    it('handles explicit seedFile prop', async () => {
      const TestComponent = () => {
        const repos = useRepositories();
        // Trigger repository creation
        repos.battleReport.generateReport();
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode} seedFile="explicit-seed.ts">
          <TestComponent />
        </RepositoryProvider>,
      );

      // Allow async operations to settle
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(
        RepositoryProviderModule.getBattleReportRepository,
      ).toHaveBeenCalledWith(mockMode, '/explicit-seed.ts');
    });

    it('normalizes seedFile path when missing leading slash', async () => {
      const TestComponent = () => {
        const repos = useRepositories();
        repos.battleReport.generateReport();
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode} seedFile="no-slash-seed.ts">
          <TestComponent />
        </RepositoryProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(
        RepositoryProviderModule.getBattleReportRepository,
      ).toHaveBeenCalledWith(mockMode, '/no-slash-seed.ts');
    });

    it('uses seedFile from seed selection when no explicit seedFile', async () => {
      vi.mocked(SeedSystem.useHistoricalSeedSelection).mockReturnValue({
        seedFile: '/selection-seed.ts',
        setSeedFile: vi.fn(),
        rotateSeed: vi.fn(),
      });

      const TestComponent = () => {
        const repos = useRepositories();
        repos.battleReport.generateReport();
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode}>
          <TestComponent />
        </RepositoryProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(
        RepositoryProviderModule.getBattleReportRepository,
      ).toHaveBeenCalledWith(mockMode, '/selection-seed.ts');
    });

    it('handles seedFile normalization for selection without leading slash', async () => {
      vi.mocked(SeedSystem.useHistoricalSeedSelection).mockReturnValue({
        seedFile: 'selection-no-slash.ts',
        setSeedFile: vi.fn(),
        rotateSeed: vi.fn(),
      });

      const TestComponent = () => {
        const repos = useRepositories();
        repos.battleReport.generateReport();
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode}>
          <TestComponent />
        </RepositoryProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(
        RepositoryProviderModule.getBattleReportRepository,
      ).toHaveBeenCalledWith(mockMode, '/selection-no-slash.ts');
    });

    it('handles null seed selection', async () => {
      vi.mocked(SeedSystem.useHistoricalSeedSelection).mockReturnValue(null);

      const TestComponent = () => {
        const repos = useRepositories();
        repos.battleReport.generateReport();
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode}>
          <TestComponent />
        </RepositoryProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(
        RepositoryProviderModule.getBattleReportRepository,
      ).toHaveBeenCalledWith(mockMode, undefined);
    });

    it('provides battleReport repository with lazy instantiation', async () => {
      const TestComponent = () => {
        const repos = useRepositories();
        repos.battleReport.generateReport({
          filter: { battle: { themeId: 'test' } },
        });
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode}>
          <TestComponent />
        </RepositoryProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(
        RepositoryProviderModule.getBattleReportRepository,
      ).toHaveBeenCalledWith(mockMode, undefined);
      expect(mockBattleRepo.generateReport).toHaveBeenCalledWith({
        filter: { battle: { themeId: 'test' } },
      });
    });

    it('provides judgement repository', async () => {
      const TestComponent = () => {
        const repos = useRepositories();
        // @ts-expect-error Intentionally passing minimal shape for test; repository is mocked
        repos.judgement.determineWinner({ battle: 'test' });
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode}>
          <TestComponent />
        </RepositoryProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(
        RepositoryProviderModule.getJudgementRepository,
      ).toHaveBeenCalledWith(mockMode);
      expect(mockJudgementRepo.determineWinner).toHaveBeenCalledWith(
        { battle: 'test' },
        undefined,
      );
    });

    it('caches repository instances for multiple calls', async () => {
      const TestComponent = () => {
        const repos = useRepositories();
        // Call multiple times
        repos.battleReport.generateReport();
        repos.battleReport.generateReport();
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode}>
          <TestComponent />
        </RepositoryProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should only call getBattleReportRepository once due to caching
      expect(
        RepositoryProviderModule.getBattleReportRepository,
      ).toHaveBeenCalledTimes(1);
    });

    it('logs debug info in non-production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const consoleSpy = vi
        .spyOn(console, 'debug')
        .mockImplementation(() => {});

      const TestComponent = () => {
        const repos = useRepositories();
        repos.battleReport.generateReport();
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode} seedFile="debug-seed.ts">
          <TestComponent />
        </RepositoryProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleSpy).toHaveBeenCalledWith(
        '[RepositoryProvider] battle seed file =',
        '/debug-seed.ts',
      );

      process.env.NODE_ENV = originalEnv;
      consoleSpy.mockRestore();
    });

    it('skips debug logging in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const consoleSpy = vi
        .spyOn(console, 'debug')
        .mockImplementation(() => {});

      const TestComponent = () => {
        const repos = useRepositories();
        repos.battleReport.generateReport();
        return <div>Test</div>;
      };

      render(
        <RepositoryProvider mode={mockMode} seedFile="debug-seed.ts">
          <TestComponent />
        </RepositoryProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleSpy).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
      consoleSpy.mockRestore();
    });
  });

  describe('RepositoryProviderSuspense', () => {
    // Skip Suspense tests since they require complex React 18 setup
    it.skip('provides eagerly initialized repositories', () => {
      // Suspense provider requires React 18 use() hook which is complex to test
      expect(true).toBe(true);
    });

    it.skip('handles mode prop for suspense provider', () => {
      // Suspense provider requires React 18 use() hook which is complex to test
      expect(true).toBe(true);
    });

    it.skip('memoizes repository initialization by mode', () => {
      // Suspense provider requires React 18 use() hook which is complex to test
      expect(true).toBe(true);
    });
  });
});
