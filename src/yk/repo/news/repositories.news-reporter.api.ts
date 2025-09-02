import { ApiClient } from '@/lib/api-client';
import { uid } from '@/lib/id';
import type { Battle } from '@/types/types';
import { applyDelay, type DelayOption } from '@/yk/repo/core/delay-utils';
import type { BattleReportRepository } from '@/yk/repo/core/repositories';

/**
 * API経由でニュースを集める BattleReportRepository
 */
export class NewsReporterApiBattleReportRepository
  implements BattleReportRepository
{
  private readonly api: ApiClient;
  private readonly delay?: DelayOption;
  private readonly cacheTtlMs: number;
  private cache: { value: Battle; expiresAt: number } | null = null;
  private readonly chooseSource: () => 'ipify' | 'weather';

  constructor(
    api: ApiClient,
    opts?: {
      delay?: DelayOption;
      cacheTtlMs?: number;
      chooser?: () => 'ipify' | 'weather';
    },
  ) {
    this.api = api;
    this.delay = opts?.delay;
    // Default TTL: 30s (0 to disable). Keep simple for repo-layer caching.
    this.cacheTtlMs = Math.max(0, opts?.cacheTtlMs ?? 30_000);
    this.chooseSource =
      opts?.chooser ?? (() => (Math.random() < 0.5 ? 'ipify' : 'weather'));
  }

  async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
    await applyDelay(this.delay, options?.signal);

    // Serve from cache if fresh
    const now = Date.now();
    if (this.cache && this.cache.expiresAt > now) {
      return this.cache.value;
    }

    // Choose one of the external sources randomly; on failure, fall back to local API
    const source = this.chooseSource();
    try {
      const battle =
        source === 'ipify'
          ? await this.generateFromIpify(options?.signal)
          : await this.generateWeatherForecast(options?.signal);
      this.maybeStoreCache(battle);
      return battle;
    } catch {
      const battle = await this.api.get<Battle>(
        '/news/battle/report',
        options?.signal,
      );
      this.maybeStoreCache(battle);
      return battle;
    }
  }

  private maybeStoreCache(value: Battle): void {
    if (this.cacheTtlMs === 0) return;
    this.cache = { value, expiresAt: Date.now() + this.cacheTtlMs };
  }

  /**
   * Build a Battle report from the public IP fetched via ipify.
   * GET https://api.ipify.org?format=json
   * If the fetch fails or is blocked by CORS, an error is thrown.
   */
  private async generateFromIpify(signal?: AbortSignal): Promise<Battle> {
    type Ipify = { ip: string };
    const res = await fetch('https://api.ipify.org?format=json', {
      headers: { Accept: 'application/json' },
      signal,
    });
    if (!res.ok) throw new Error(`ipify HTTP ${res.status}`);
    const data = (await res.json()) as Ipify;
    const ip = typeof data?.ip === 'string' && data.ip ? data.ip : '0.0.0.0';

    // Derive semi-stable powers from the IP digits
    const digits = ip.replace(/[^\d]/g, '');
    const seed = digits ? parseInt(digits.slice(-6), 10) : 42;
    const powerYono = (seed % 50) + 25; // 25..74
    const powerKomae = (Math.floor(seed / 7) % 50) + 25; // 25..74

    const battle: Battle = {
      id: uid('battle'),
      title: `IPアドレス ${ip}`,
      subtitle: 'Generated from ipify.org',
      overview:
        'A network-sourced battle report generated from your current public IP.',
      scenario:
        'Signal intelligence gathered from ipify inspires a spontaneous skirmish.',
      provenance: [
        {
          label: 'ipify - A Simple Public IP Address API',
          url: 'https://ipify.org',
          note: 'The public IP address used to generate this report.',
        },
      ],
      yono: {
        imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
        title: `Yono - IP Signal`,
        subtitle: 'Live network signal',
        description: `インターネット便利ねー`,
        power: powerYono,
      },
      komae: {
        imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
        title: `Komae - IP Signal`,
        subtitle: 'Live network signal',
        description: `インターネット便利なー`,
        power: powerKomae,
      },
      status: 'success',
    };
    return battle;
  }

  /**
   * Build a Battle report from current weather fetched via Open-Meteo.
   *
   * 🌦️ Docs | Open-Meteo.com
   * https://open-meteo.com/en/docs
   *
   *
   * City: Long, Lat
   * Yono: 35.88445483617253, 139.6262162096776
   * Komae: 35.63497080831211, 139.5789225059554
   */
  private async generateWeatherForecast(signal?: AbortSignal): Promise<Battle> {
    type OpenMeteo = {
      current_weather?: { temperature?: number; windspeed?: number };
    };
    const baseUrl = 'https://api.open-meteo.com/v1/forecast';
    const qs = new URLSearchParams({
      latitude: '35.88445483617253,35.63497080831211',
      longitude: '139.6262162096776,139.5789225059554',
      current_weather: 'true',
      timezone: 'Asia/Tokyo',
    });
    const res = await fetch(`${baseUrl}?${qs.toString()}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
    if (!res.ok) throw new Error(`open-meteo HTTP ${res.status}`);
    const data = (await res.json()) as OpenMeteo;
    const temp = Math.round(Number(data?.current_weather?.temperature ?? 20));
    const wind = Math.round(Number(data?.current_weather?.windspeed ?? 5));

    // Map weather to semi-stable powers
    const powerYono = Math.max(25, Math.min(90, 30 + temp)); // temp-biased
    const powerKomae = Math.max(25, Math.min(90, 25 + wind * 2)); // wind-biased

    const battle: Battle = {
      id: uid('battle'),
      title: `Weather Tokyo (temp ${temp}°C, wind ${wind} m/s)`,
      subtitle: 'Generated from open-meteo.com',
      overview:
        'A weather-sourced battle report generated from current Tokyo conditions.',
      scenario: 'Meteorological factors stir a sudden clash in the skies.',
      provenance: [
        {
          label: 'Open-Meteo - Free Weather API',
          url: 'https://open-meteo.com',
          note: 'Current weather used to generate this report.',
        },
      ],
      yono: {
        imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
        title: 'Yono - Temperature Front',
        subtitle: 'Warm front advance',
        description: '気温の上昇は士気を高める。',
        power: powerYono,
      },
      komae: {
        imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
        title: 'Komae - Wind Gust',
        subtitle: 'Gusty tailwinds',
        description: '風のうねりが戦況を揺さぶる。',
        power: powerKomae,
      },
      status: 'success',
    };
    return battle;
  }

  /**
   * 🌤️ Free Open-Source Weather API | Open-Meteo.com
   *  https://open-meteo.com/
   *
   * 🌦️ Docs | Open-Meteo.com
   * https://open-meteo.com/en/docs
   */
  // (legacy scratch impl removed)
}
