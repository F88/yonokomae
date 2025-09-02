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
   * City: Long, Lat
   * Yono: 35.88445483617253, 139.6262162096776
   * Komae: 35.63497080831211, 139.5789225059554
   */
  private async generateWeatherForecast(signal?: AbortSignal): Promise<Battle> {
    const snapshot = await this.fetchWeatherSnapshot(signal);
    const variants = this.buildBattlesFromWeatherSnapshot(snapshot);
    const index = this.chooseVariant(variants.length);
    return variants[index] ?? variants[0];
  }

  // Fetch a single weather snapshot (daily metrics for two locations)
  private async fetchWeatherSnapshot(signal?: AbortSignal): Promise<{
    tmax: number[];
    windMax: number[];
    sunshineSec: number[];
    daylightSec: number[];
    rainMm: number[];
    meta: { lat: number[]; lon: number[]; tz: string };
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

    type OpenMeteoDaily = {
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
    if (!res.ok) throw new Error(`open-meteo HTTP ${res.status}`);
    const data = (await res.json()) as OpenMeteoDaily;
    const day = data?.daily ?? {};

    const arr = <T>(a: T[] | undefined, fb: T[]): T[] =>
      Array.isArray(a) && a.length > 0 ? a : fb;

    const tmax = arr(day.temperature_2m_max, [20, 20]).map(Number) as number[];
    const windMax = arr(day.wind_speed_10m_max, [5, 5]).map(Number) as number[];
    const sunshineSec = arr(day.sunshine_duration, [28_800, 28_800]).map(
      Number,
    ) as number[];
    const daylightSec = arr(day.daylight_duration, [43_200, 43_200]).map(
      Number,
    ) as number[];
    const rainMm = arr(day.rain_sum, [0, 0]).map(Number) as number[];

    return {
      tmax,
      windMax,
      sunshineSec,
      daylightSec,
      rainMm,
      meta: {
        lat: [...params.latitude],
        lon: [...params.longitude],
        tz: params.timezone,
      },
    };
  }

  // Build multiple Battle variants from one snapshot
  private buildBattlesFromWeatherSnapshot(snap: {
    tmax: number[];
    windMax: number[];
    sunshineSec: number[];
    daylightSec: number[];
    rainMm: number[];
    meta: { lat: number[]; lon: number[]; tz: string };
  }): Battle[] {
    const [tY, tK] = [
      Math.round(snap.tmax[0] ?? 20),
      Math.round(snap.tmax[1] ?? snap.tmax[0] ?? 20),
    ];
    const [wY, wK] = [
      Math.round(snap.windMax[0] ?? 5),
      Math.round(snap.windMax[1] ?? snap.windMax[0] ?? 5),
    ];
    const [sunYh, sunKh] = [
      Math.round((snap.sunshineSec[0] ?? 28_800) / 3600),
      Math.round((snap.sunshineSec[1] ?? snap.sunshineSec[0] ?? 28_800) / 3600),
    ];
    const [dayYh, dayKh] = [
      Math.round((snap.daylightSec[0] ?? 43_200) / 3600),
      Math.round((snap.daylightSec[1] ?? snap.daylightSec[0] ?? 43_200) / 3600),
    ];
    const [rainY, rainK] = [
      Math.round(snap.rainMm[0] ?? 0),
      Math.round(snap.rainMm[1] ?? snap.rainMm[0] ?? 0),
    ];

    const clamp = (n: number, min: number, max: number) =>
      Math.max(min, Math.min(max, n));

    const v1: Battle = {
      id: uid('battle'),
      title: `Weather Tokyo (Tmax ${tY}°C, windmax ${wK} m/s)`,
      subtitle: 'Generated from open-meteo.com',
      overview:
        `Daily metrics: Yono Tmax ${tY}°C, Komae wind ${wK} m/s. ` +
        `Sunshine ${sunYh}h/${sunKh}h, Rain ${rainY}mm/${rainK}mm (TZ ${snap.meta.tz}).`,
      scenario: `穏やかな日照(${dayYh}h/${dayKh}h)の下、熱気と突風が衝突する。`,
      provenance: [
        {
          label: 'Open-Meteo - Free Weather API',
          url: 'https://open-meteo.com',
          note: 'Daily metrics used.',
        },
      ],
      yono: {
        imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
        title: 'Yono - Temperature Front',
        subtitle: 'Warm front advance',
        description: `日照 ${sunYh}h、降水 ${rainY}mm。熱が士気を押し上げる。`,
        power: clamp(30 + tY, 25, 90),
      },
      komae: {
        imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
        title: 'Komae - Wind Gust',
        subtitle: 'Gusty tailwinds',
        description: `日照 ${sunKh}h、降水 ${rainK}mm。風が戦況を揺さぶる。`,
        power: clamp(25 + wK * 2, 25, 90),
      },
      status: 'success',
    };

    const v2: Battle = {
      id: uid('battle'),
      title: `Weather Tokyo (Sunshine ${sunYh}h/${sunKh}h, Rain ${rainY}/${rainK}mm)`,
      subtitle: 'Sunshine duel',
      overview: `日照が士気を照らす。降水が足取りを重くする。 Tmax ${tY}°C / ${tK}°C`,
      scenario: `長い日照(${dayYh}h/${dayKh}h)が優勢を分ける光の攻防。`,
      provenance: [
        {
          label: 'Open-Meteo - Free Weather API',
          url: 'https://open-meteo.com',
          note: 'Daily sunshine/rain used.',
        },
      ],
      yono: {
        imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
        title: 'Yono - Solar Vanguard',
        subtitle: 'Sun-boosted morale',
        description: `日照 ${sunYh}h、降水 ${rainY}mm。陽光が背を押す。`,
        power: clamp(20 + sunYh * 3 - rainY, 25, 90),
      },
      komae: {
        imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
        title: 'Komae - Radiant Phalanx',
        subtitle: 'Sunlit formation',
        description: `日照 ${sunKh}h、降水 ${rainK}mm。光が隊列を固める。`,
        power: clamp(20 + sunKh * 3 - rainK, 25, 90),
      },
      status: 'success',
    };

    const v3: Battle = {
      id: uid('battle'),
      title: `Weather Tokyo (Rain ${rainY}/${rainK}mm, wind ${wY}/${wK} m/s)`,
      subtitle: 'Rainfall attrition',
      overview: `降りしきる雨が補給線を鈍らせる。日照 ${sunYh}h/${sunKh}h。`,
      scenario: `雨脚と風が兵站を削る持久戦。`,
      provenance: [
        {
          label: 'Open-Meteo - Free Weather API',
          url: 'https://open-meteo.com',
          note: 'Daily rain/wind used.',
        },
      ],
      yono: {
        imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
        title: 'Yono - Rain Guard',
        subtitle: 'Soggy advance',
        description: `降水 ${rainY}mm、風 ${wY} m/s。耐えの局面。`,
        power: clamp(80 - rainY * 2 + Math.round(wY / 2), 25, 90),
      },
      komae: {
        imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
        title: 'Komae - Gale Brigade',
        subtitle: 'Wind-hardened lines',
        description: `降水 ${rainK}mm、風 ${wK} m/s。風の利を掴む。`,
        power: clamp(80 - rainK * 2 + Math.round(wK / 2), 25, 90),
      },
      status: 'success',
    };

    return [v1, v2, v3];
  }

  /**
   * 🌤️ Free Open-Source Weather API | Open-Meteo.com
   *  https://open-meteo.com/
   *
   * 🌦️ Docs | Open-Meteo.com
   * https://open-meteo.com/en/docs
   */
}
