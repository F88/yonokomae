import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { server } from '@/test/msw';
import { http, HttpResponse } from 'msw';
import { NewsReporterApiBattleReportRepository } from './repositories.news-reporter.api';
import type { Battle } from '@yonokomae/types';

describe('NewsReporterApiBattleReportRepository', () => {
  const restoreFetch: Array<() => void> = [];

  beforeEach(() => {
    // reset spies per test
  });

  afterEach(() => {
    // restore any fetch spies
    while (restoreFetch.length > 0) {
      const fn = restoreFetch.pop();
      try {
        if (fn) fn();
      } catch (e) {
        // ignore errors during restore in tests
        void e;
      }
    }
    vi.restoreAllMocks();
  });

  it('builds a Battle from ipify response (MSW)', async () => {
    const mockIp = '203.0.113.45';
    server.use(
      http.get('https://api.ipify.org', () =>
        HttpResponse.json({ ip: mockIp }),
      ),
    );

    // Minimal api client stub; should not be used on success path
    const apiStub = {
      get: vi.fn(),
    } as unknown as import('@/lib/api-client').ApiClient;
    const repo = new NewsReporterApiBattleReportRepository(apiStub, {
      chooser: () => 'ipify',
    });

    const battle = await repo.generateReport();
    expect(battle.status).toBe('success');
    expect(battle.title).toContain(mockIp);
    expect(apiStub.get).not.toHaveBeenCalled();
  });

  it('falls back to /news/battle/report when ipify fails (MSW)', async () => {
    // Simulate ipify network error via MSW
    server.use(http.get('https://api.ipify.org', () => HttpResponse.error()));

    const fallbackBattle: Battle = {
      id: 'battle-1',
      title: 'Fallback News',
      subtitle: 'Local API-like',
      overview: 'From app API fallback',
      scenario: 'Fallback path',
      yono: {
        title: 'Y',
        subtitle: 'y',
        description: 'y',
        imageUrl: 'about:blank',
        power: 50,
      },
      komae: {
        title: 'K',
        subtitle: 'k',
        description: 'k',
        imageUrl: 'about:blank',
        power: 49,
      },
      status: 'success',
    };

    const apiStub = {
      get: vi.fn().mockResolvedValue(fallbackBattle),
    } as unknown as import('@/lib/api-client').ApiClient;

    const repo = new NewsReporterApiBattleReportRepository(apiStub, {
      chooser: () => 'ipify',
    });
    const battle = await repo.generateReport();
    expect(apiStub.get).toHaveBeenCalledWith('/news/battle/report', undefined);
    expect(battle.title).toBe('Fallback News');
  });

  it('serves from cache within TTL when ipify succeeds (MSW)', async () => {
    const mockIp = '198.51.100.7';
    server.use(
      http.get('https://api.ipify.org', () =>
        HttpResponse.json({ ip: mockIp }),
      ),
    );

    const apiStub = {
      get: vi.fn(),
    } as unknown as import('@/lib/api-client').ApiClient;
    const repo = new NewsReporterApiBattleReportRepository(apiStub, {
      cacheTtlMs: 5_000,
      chooser: () => 'ipify',
    });

    const a = await repo.generateReport();
    const b = await repo.generateReport();
    expect(a.title).toContain(mockIp);
    expect(b.title).toContain(mockIp);
    expect(apiStub.get).not.toHaveBeenCalled();
  });

  it('expires cache after TTL and fetches again (MSW)', async () => {
    vi.useFakeTimers();
    const firstIp = '203.0.113.9';
    const secondIp = '203.0.113.10';
    restoreFetch.push(() => {
      vi.useRealTimers();
    });

    // First handler
    server.use(
      http.get('https://api.ipify.org', () =>
        HttpResponse.json({ ip: firstIp }),
      ),
    );

    const apiStub = {
      get: vi.fn(),
    } as unknown as import('@/lib/api-client').ApiClient;
    const repo = new NewsReporterApiBattleReportRepository(apiStub, {
      cacheTtlMs: 100,
      chooser: () => 'ipify',
    });

    const a = await repo.generateReport(); // initial fetch
    expect(a.title).toContain(firstIp);

    // within TTL -> cache hit (should still be firstIp)
    const b = await repo.generateReport();
    expect(b.title).toContain(firstIp);

    // advance beyond TTL and change handler to return a different IP
    vi.advanceTimersByTime(150);
    server.use(
      http.get('https://api.ipify.org', () =>
        HttpResponse.json({ ip: secondIp }),
      ),
    );
    const c = await repo.generateReport();
    expect(c.title).toContain(secondIp);
  });

  it.each([
    { status: 429, label: 'Too Many Requests' },
    { status: 500, label: 'Internal Server Error' },
    { status: 503, label: 'Service Unavailable' },
  ])(
    'falls back when ipify returns $status $label (MSW)',
    async ({ status }) => {
      // ensure the ipify branch is chosen
      server.use(
        http.get('https://api.ipify.org', () =>
          HttpResponse.json({ message: 'error' }, { status }),
        ),
      );

      const fallbackBattle: Battle = {
        id: 'battle-fallback',
        title: 'Fallback on 4xx/5xx',
        subtitle: 'Local API-like',
        overview: 'From app API fallback',
        scenario: 'Fallback path',
        yono: {
          title: 'Y',
          subtitle: 'y',
          description: 'y',
          imageUrl: 'about:blank',
          power: 51,
        },
        komae: {
          title: 'K',
          subtitle: 'k',
          description: 'k',
          imageUrl: 'about:blank',
          power: 49,
        },
        status: 'success',
      };

      const apiStub = {
        get: vi.fn().mockResolvedValue(fallbackBattle),
      } as unknown as import('@/lib/api-client').ApiClient;

      const repo = new NewsReporterApiBattleReportRepository(apiStub, {
        chooser: () => 'ipify',
      });
      const battle = await repo.generateReport();
      expect(apiStub.get).toHaveBeenCalledWith(
        '/news/battle/report',
        undefined,
      );
      expect(battle.title).toBe('Fallback on 4xx/5xx');
    },
  );

  it('builds a Battle from Open-Meteo (MSW)', async () => {
    server.use(
      http.get('https://api.open-meteo.com/v1/forecast', () =>
        HttpResponse.json([
          {
            daily: {
              time: ['2025-09-01', '2025-09-02'],
              temperature_2m_max: [19.9, 21.0],
              daylight_duration: [43200, 43300],
              sunshine_duration: [30000, 30500],
              rain_sum: [0.0, 0.5],
              wind_speed_10m_max: [3.2, 7.1],
            },
          },
          {
            daily: {
              time: ['2025-09-01', '2025-09-02'],
              temperature_2m_max: [22.5, 23.0],
              daylight_duration: [43100, 43250],
              sunshine_duration: [29800, 30200],
              rain_sum: [0.2, 0.0],
              wind_speed_10m_max: [4.5, 6.0],
            },
          },
        ]),
      ),
    );
    const apiStub = {
      get: vi.fn(),
    } as unknown as import('@/lib/api-client').ApiClient;
    const repo = new NewsReporterApiBattleReportRepository(apiStub, {
      chooser: () => 'weather',
    });
    const battle = await repo.generateReport();
    expect(battle.status).toBe('success');
    expect(battle.title).toContain('最高気温');
    expect(apiStub.get).not.toHaveBeenCalled();
  });

  it('falls back to /news/battle/report when weather fails (MSW)', async () => {
    server.use(
      http.get('https://api.open-meteo.com/v1/forecast', () =>
        HttpResponse.error(),
      ),
    );
    const fallbackBattle: Battle = {
      id: 'battle-weather-fallback',
      title: 'Weather Fallback',
      subtitle: 'Local API-like',
      overview: 'From app API fallback',
      scenario: 'Fallback path',
      yono: {
        title: 'Y',
        subtitle: 'y',
        description: 'y',
        imageUrl: 'about:blank',
        power: 50,
      },
      komae: {
        title: 'K',
        subtitle: 'k',
        description: 'k',
        imageUrl: 'about:blank',
        power: 49,
      },
      status: 'success',
    };
    const apiStub = {
      get: vi.fn().mockResolvedValue(fallbackBattle),
    } as unknown as import('@/lib/api-client').ApiClient;
    const repo = new NewsReporterApiBattleReportRepository(apiStub, {
      chooser: () => 'weather',
    });
    const battle = await repo.generateReport();
    expect(apiStub.get).toHaveBeenCalledWith('/news/battle/report', undefined);
    expect(battle.title).toBe('Weather Fallback');
  });
});
