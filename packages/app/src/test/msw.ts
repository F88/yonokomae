import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  http.get('/api/battle/report', () => {
    return HttpResponse.json({
      id: 'msw-battle-1',
      themeId: 'history',
      significance: 'low',
      title: 'MSW Battle',
      subtitle: 'Stubbed',
      narrative: { overview: 'From MSW', scenario: 'Stub path' },
      komae: {
        imageUrl: 'k',
        title: 'K',
        subtitle: 'k',
        description: 'k',
        power: 10,
      },
      yono: {
        imageUrl: 'y',
        title: 'Y',
        subtitle: 'y',
        description: 'y',
        power: 10,
      },
      status: 'success',
    });
  }),
  http.get('/api/battle/judgement', () => {
    return HttpResponse.json({
      winner: 'DRAW',
      reason: 'api',
      rng: 0.5,
      judgeCode: 'MSW',
      powerDiff: 0,
    });
  }),
  // Default handler for external ipify endpoint used by news reporter repo.
  // Tests can override per-case with server.use(...)
  http.get('https://api.ipify.org', () => {
    return HttpResponse.json({ ip: '198.51.100.1' });
  }),
  // Default handler for external Open-Meteo endpoint used by news reporter repo.
  http.get('https://api.open-meteo.com/v1/forecast', () => {
    // Return minimal daily payload for two locations
    return HttpResponse.json({
      daily: {
        time: ['2025-09-01', '2025-09-02'],
        temperature_2m_max: [23.1, 24.2],
        daylight_duration: [43_200, 43_500],
        sunshine_duration: [30_000, 31_000],
        rain_sum: [1.2, 0.0],
        wind_speed_10m_max: [4.2, 6.8],
      },
    });
  }),
];

export const server = setupServer(...handlers);
