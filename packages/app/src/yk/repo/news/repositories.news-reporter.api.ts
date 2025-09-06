import { ApiClient } from '@/lib/api-client';
import { uid } from '@/lib/id';
import type { Battle } from '@yonokomae/types';
import { applyDelay, type DelayOption } from '@/yk/repo/core/delay-utils';
import type { BattleReportRepository } from '@/yk/repo/core/repositories';

type OpenMeteoDailyArrays = {
  daily?: {
    time?: Array<string | number>;
    temperature_2m_max?: Array<number | string>;
    daylight_duration?: Array<number | string>;
    sunshine_duration?: Array<number | string>;
    rain_sum?: Array<number | string>;
    wind_speed_10m_max?: Array<number | string>;
  };
};

type DailyEntry = {
  time: string;
  temperature_2m_max: number;
  daylight_duration: number;
  sunshine_duration: number;
  rain_sum: number;
  wind_speed_10m_max: number;
};

// -------------------------
// Error Types (news reporter)
// -------------------------
export class NewsReporterError extends Error {
  readonly name = 'NewsReporterError';
  constructor(message: string) {
    super(message);
  }
}

export class NewsReporterHttpError extends NewsReporterError {
  readonly service: string;
  readonly status: number;
  constructor(service: string, status: number) {
    super(`${service} HTTP ${status}`);
    this.service = service;
    this.status = status;
  }
}

export class NewsReporterDataError extends NewsReporterError {
  constructor(message: string) {
    super(message);
  }
}

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
  private readonly chooseVariant: (count: number) => number;

  constructor(
    api: ApiClient,
    opts?: {
      delay?: DelayOption;
      cacheTtlMs?: number;
      chooser?: () => 'ipify' | 'weather';
      variantChooser?: (count: number) => number;
    },
  ) {
    this.api = api;
    this.delay = opts?.delay;
    // Default TTL: 30s (0 to disable). Keep simple for repo-layer caching.
    this.cacheTtlMs = Math.max(0, opts?.cacheTtlMs ?? 30_000);
    // Default source ratio: ipify 20%, weather 80%
    this.chooseSource =
      opts?.chooser ?? (() => (Math.random() < 0.2 ? 'ipify' : 'weather'));
    this.chooseVariant =
      opts?.variantChooser ??
      ((count) => {
        const r = Math.random();
        const idx = Math.floor(r * count);
        return idx >= 0 && idx < count ? idx : 0;
      });
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
  if (!res.ok) throw new NewsReporterHttpError('ipify', res.status);
    const data = (await res.json()) as Ipify;
    const ip = typeof data?.ip === 'string' && data.ip ? data.ip : '0.0.0.0';

    // Derive semi-stable powers from the IP digits
    const digits = ip.replace(/[^\d]/g, '');
    const seed = digits ? parseInt(digits.slice(-6), 10) : 42;
    const powerYono = (seed % 50) + 25; // 25..74
    const powerKomae = (Math.floor(seed / 7) % 50) + 25; // 25..74

    const battle: Battle = {
      id: uid('battle'),
      themeId: 'information',
      significance: 'low',
      title: `IPアドレス ${ip}`,
      subtitle: 'Generated from ipify.org',
      narrative: {
        overview:
          'A network-sourced battle report generated from your current public IP.',
        scenario:
          'Signal intelligence gathered from ipify inspires a spontaneous skirmish.',
      },
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
   * City: Long, Lat
   * Yono: 35.88445483617253, 139.6262162096776
   * Komae: 35.63497080831211, 139.5789225059554
   */
  private async generateWeatherForecast(signal?: AbortSignal): Promise<Battle> {
    const snapshot = await this.fetchWeatherSnapshot(signal);
    const variants = this.buildBattlesFromWeatherSnapshot(snapshot);
    if (variants.length === 0) {
      throw new NewsReporterDataError(
        'No weather-based battle variants generated',
      );
    }
    const index = this.chooseVariant(variants.length);
    const chosen = variants[index] ?? variants[0];
    if (!chosen) {
      throw new NewsReporterDataError(
        'Failed to choose a weather battle variant',
      );
    }
    return chosen;
  }

  /**
  *  Fetch a single weather snapshot (daily metrics for two locations)
  *
  * 🌦️ Docs | Open-Meteo.com
   * https://open-meteo.com/en/docs
   *
   * City: Long, Lat
   * Yono: 35.88445483617253, 139.6262162096776
   * Komae: 35.63497080831211, 139.5789225059554
   *
   * Example of API response
   *
   * ```
   * [
    {
        "latitude": 35.9,
        "longitude": 139.625,
        "generationtime_ms": 0.06794929504394531,
        "utc_offset_seconds": 32400,
        "timezone": "Asia/Tokyo",
        "timezone_abbreviation": "GMT+9",
        "elevation": 10.0,
        "daily_units": {
            "time": "iso8601",
            "temperature_2m_max": "°C",
            "daylight_duration": "s",
            "sunshine_duration": "s",
            "rain_sum": "mm",
            "wind_speed_10m_max": "km/h"
        },
        "daily": {
            "time": [
                "2025-09-02",
                "2025-09-03"
            ],
            "temperature_2m_max": [
                34.8,
                33.7
            ],
            "daylight_duration": [
                46447.76,
                46318.27
            ],
            "sunshine_duration": [
                36886.38,
                31456.52
            ],
            "rain_sum": [
                0.00,
                0.00
            ],
            "wind_speed_10m_max": [
                9.9,
                8.3
            ]
        }
    },
    {
        "latitude": 35.65,
        "longitude": 139.5625,
        "generationtime_ms": 0.040411949157714844,
        "utc_offset_seconds": 32400,
        "timezone": "Asia/Tokyo",
        "timezone_abbreviation": "GMT+9",
        "elevation": 29.0,
        "location_id": 1,
        "daily_units": {
            "time": "iso8601",
            "temperature_2m_max": "°C",
            "daylight_duration": "s",
            "sunshine_duration": "s",
            "rain_sum": "mm",
            "wind_speed_10m_max": "km/h"
        },
        "daily": {
            "time": [
                "2025-09-02",
                "2025-09-03"
            ],
            "temperature_2m_max": [
                33.5,
                33.2
            ],
            "daylight_duration": [
                46420.90,
                46292.61
            ],
            "sunshine_duration": [
                39600.00,
                36276.96
            ],
            "rain_sum": [
                0.80,
                0.00
            ],
            "wind_speed_10m_max": [
                10.4,
                7.9
            ]
        }
    }
]
    ```
   */
  private async fetchWeatherSnapshot(signal?: AbortSignal): Promise<{
    yono: DailyEntry;
    komae: DailyEntry;
  }> {
    const params = {
      latitude: [35.88445483617253, 35.63497080831211],
      longitude: [139.6262162096776, 139.5789225059554],
      daily: [
        'temperature_2m_max',
        'daylight_duration',
        'sunshine_duration',
        'rain_sum',
        'wind_speed_10m_max',
      ],
      timezone: 'Asia/Tokyo',
      past_days: 1,
      forecast_days: 1,
    } as const;

    type OpenMeteoItem = {
      daily?: {
        time?: string[];
        temperature_2m_max?: number[];
        daylight_duration?: number[];
        sunshine_duration?: number[];
        rain_sum?: number[];
        wind_speed_10m_max?: number[];
      };
    };
    const baseUrl = 'https://api.open-meteo.com/v1/forecast';
    const qs = new URLSearchParams({
      latitude: params.latitude.join(','),
      longitude: params.longitude.join(','),
      daily: params.daily.join(','),
      timezone: params.timezone,
      past_days: String(params.past_days),
      forecast_days: String(params.forecast_days),
    });
    const res = await fetch(`${baseUrl}?${qs.toString()}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
  if (!res.ok) throw new NewsReporterHttpError('open-meteo', res.status);
    const data = (await res.json()) as OpenMeteoItem[];

    const first = Array.isArray(data) && data.length > 0 ? data[0] : undefined;
    const second = Array.isArray(data) && data.length > 1 ? data[1] : undefined;
    const yono = this.pivotDailyFirstTwo({ daily: first?.daily }); // first element
    const komae = this.pivotDailyFirstTwo({ daily: second?.daily }); // second element

    // console.debug('yono', yono);
    // console.debug('komae', komae);

    if (!yono[1] || !komae[1]) {
      throw new NewsReporterDataError(
        'Incomplete weather snapshot: missing daily entries',
      );
    }
    return { yono: yono[1], komae: komae[1] };
  }

  // Build multiple Battle variants from one snapshot
  private buildBattlesFromWeatherSnapshot(snap: {
    yono: DailyEntry;
    komae: DailyEntry;
  }): Battle[] {
    const clamp = (n: number, min: number, max: number) =>
      Math.max(min, Math.min(max, n));
    const dailyTemperature: Battle = {
      id: uid('battle'),
      themeId: 'information',
      significance: 'low',
      title: `最高気温`,
      subtitle: 'あついね',
      narrative: {
        overview: '',
        scenario: `くまがややふちゅうにだって負けてない!!`,
      },
      provenance: [
        {
          label: 'Open-Meteo - Free Weather API',
          url: 'https://open-meteo.com',
          note: 'Daily metrics used.',
        },
      ],
      yono: {
        imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
        title: `${snap.yono.temperature_2m_max}°C`,
        subtitle: 'あついー',
        description: '',
        power: clamp(30 + snap.yono.temperature_2m_max, 25, 90),
      },
      komae: {
        imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
        title: `${snap.komae.temperature_2m_max}°C`,
        subtitle: 'あついー',
        description: '',
        power: clamp(25 + snap.komae.wind_speed_10m_max * 2, 25, 90),
      },
      status: 'success',
    };

    return [
      // v1,
      // v2,
      // v3,
      dailyTemperature,
    ];
  }

  /**
   * Convert Open-Meteo daily arrays into first and second row objects.
   * Always returns up to two entries (index 0 and 1). Missing values fallback to 0 or "".
   */
  private pivotDailyFirstTwo(input: OpenMeteoDailyArrays): DailyEntry[] {
    const d = input.daily ?? {};
    const toNum = (v: unknown): number => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    const at = <T>(arr: T[] | undefined, i: number): T | undefined =>
      Array.isArray(arr) ? arr[i] : undefined;

    const build = (i: number): DailyEntry => ({
      time: String(at(d.time, i) ?? ''),
      temperature_2m_max: toNum(at(d.temperature_2m_max, i)),
      daylight_duration: toNum(at(d.daylight_duration, i)),
      sunshine_duration: toNum(at(d.sunshine_duration, i)),
      rain_sum: toNum(at(d.rain_sum, i)),
      wind_speed_10m_max: toNum(at(d.wind_speed_10m_max, i)),
    });

    const result: DailyEntry[] = [];
    result.push(build(0));
    result.push(build(1));
    return result;
  }
}
