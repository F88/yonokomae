/** Custom HTTP error with status code for robust error handling */
export class HttpError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Lightweight fetch wrapper. Adapt as needed. */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly token?: string;
  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async get<T>(
    path: string,
    signal?: AbortSignal,
    headers?: Record<string, string>,
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : undefined),
        ...headers,
      },
      signal,
    });
    if (!res.ok) throw new HttpError(`HTTP ${res.status}`, res.status);
    return res.json() as Promise<T>;
  }
}
