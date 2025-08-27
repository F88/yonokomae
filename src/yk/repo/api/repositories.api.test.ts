import { describe, it, expect, beforeEach } from 'vitest';
import {
  getBattleReportRepository,
  getJudgementRepository,
} from '../core/repository-provider';
import type { PlayMode } from '@/yk/play-mode';

const apiMode: PlayMode = {
  id: 'api',
  title: 'API MODE',
  description: '',
  enabled: true,
};

describe('api mode repositories (msw)', () => {
  beforeEach(() => {
    // Ensure base URL points to our msw handlers (same-origin)
    const meta = import.meta as unknown as { env?: Record<string, string> };
    meta.env = { ...(meta.env ?? {}), VITE_API_BASE_URL: '/api' };
  });

  it('fetches battle report from API', async () => {
    const repo = await getBattleReportRepository(apiMode);
    const battle = await repo.generateReport();
    expect(battle.title).toBe('MSW Battle');
    expect(battle.status).toBe('success');
  });

  it('fetches judgement from API', async () => {
    const repo = await getJudgementRepository(apiMode);
    const winner = await repo.determineWinner({
      mode: apiMode,
      battle: {
        id: 'msw-battle-1',
        title: 't',
        subtitle: 's',
        overview: 'o',
        scenario: 'sc',
        yono: {
          imageUrl: '',
          title: '',
          subtitle: '',
          description: '',
          power: 1,
        },
        komae: {
          imageUrl: '',
          title: '',
          subtitle: '',
          description: '',
          power: 1,
        },
      },
    });
    expect(winner).toBe('DRAW');
  });
});
