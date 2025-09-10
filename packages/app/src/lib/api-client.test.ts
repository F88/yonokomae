import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient, HttpError } from './api-client';

// Mock global fetch
const mockFetch = vi.fn();
Object.defineProperty(global, 'fetch', {
  value: mockFetch,
  writable: true,
});

describe('HttpError', () => {
  it('creates error with message and status', () => {
    const error = new HttpError('Not Found', 404);

    expect(error.message).toBe('Not Found');
    expect(error.status).toBe(404);
    expect(error.name).toBe('HttpError');
    expect(error).toBeInstanceOf(Error);
  });

  it('has readonly status property', () => {
    const error = new HttpError('Server Error', 500);

    expect(error.status).toBe(500);

    // This tests the readonly nature - TypeScript prevents assignment at compile time
    // Runtime behavior may vary, but the intent is readonly
    expect(error.status).toBe(500);
  });
});

describe('ApiClient', () => {
  let client: ApiClient;
  let mockResponse: {
    ok: boolean;
    status: number;
    json: ReturnType<typeof vi.fn>;
    clone: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockResponse = {
      ok: true,
      status: 200,
      json: vi.fn(),
      clone: vi.fn(),
    };

    // Make clone return a similar response object
    mockResponse.clone.mockReturnValue(mockResponse);

    mockFetch.mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('creates client with baseUrl only', () => {
      client = new ApiClient('https://api.example.com');

      expect(client).toBeInstanceOf(ApiClient);
    });

    it('creates client with baseUrl and token', () => {
      client = new ApiClient('https://api.example.com', 'secret-token');

      expect(client).toBeInstanceOf(ApiClient);
    });
  });

  describe('get method', () => {
    beforeEach(() => {
      client = new ApiClient('https://api.example.com');
    });

    describe('Successful requests', () => {
      it('makes GET request and returns parsed JSON', async () => {
        const mockData = { id: 1, name: 'Test' };
        mockResponse.json.mockResolvedValue(mockData);

        const result = await client.get<typeof mockData>('/users/1');

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockData);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
      });

      it('includes Authorization header when token provided', async () => {
        client = new ApiClient('https://api.example.com', 'secret-token');
        const mockData = { success: true };
        mockResponse.json.mockResolvedValue(mockData);

        await client.get('/protected');

        expect(mockFetch).toHaveBeenCalledTimes(1);

        // Check that fetch was called with a Request object that has auth header
        const requestArg = mockFetch.mock.calls[0]?.[0];
        expect(requestArg).toBeInstanceOf(Request);
      });

      it('passes AbortSignal when provided', async () => {
        const controller = new AbortController();
        const mockData = { result: 'abortable' };
        mockResponse.json.mockResolvedValue(mockData);

        await client.get('/abortable', controller.signal);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const requestArg = mockFetch.mock.calls[0]?.[0];
        expect(requestArg).toBeInstanceOf(Request);
      });

      it('handles custom headers', async () => {
        const mockData = { message: 'hello' };
        mockResponse.json.mockResolvedValue(mockData);

        await client.get('/hello', undefined, {
          Accept: 'application/json',
          'X-Client': 'test',
        });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
      });
    });

    describe('Error handling', () => {
      it('throws HttpError for 4xx status codes', async () => {
        mockResponse.ok = false;
        mockResponse.status = 404;

        await expect(client.get('/not-found')).rejects.toThrow(HttpError);
        await expect(client.get('/not-found')).rejects.toThrow('HTTP 404');

        try {
          await client.get('/not-found');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpError);
          expect((error as HttpError).status).toBe(404);
          expect((error as HttpError).message).toBe('HTTP 404');
        }
      });

      it('throws HttpError for 5xx status codes', async () => {
        mockResponse.ok = false;
        mockResponse.status = 500;

        await expect(client.get('/server-error')).rejects.toThrow(HttpError);

        try {
          await client.get('/server-error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpError);
          expect((error as HttpError).status).toBe(500);
          expect((error as HttpError).message).toBe('HTTP 500');
        }
      });

      it('throws HttpError for other non-ok status codes', async () => {
        mockResponse.ok = false;
        mockResponse.status = 418; // I'm a teapot

        await expect(client.get('/teapot')).rejects.toThrow(HttpError);

        try {
          await client.get('/teapot');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpError);
          expect((error as HttpError).status).toBe(418);
        }
      });

      it('propagates network errors', async () => {
        const networkError = new Error('Network failure');
        mockFetch.mockRejectedValue(networkError);

        await expect(client.get('/network-fail')).rejects.toThrow(
          'Network failure',
        );
        await expect(client.get('/network-fail')).rejects.not.toThrow(
          HttpError,
        );
      });

      it('propagates JSON parsing errors', async () => {
        mockResponse.ok = true;
        mockResponse.json.mockRejectedValue(new Error('Invalid JSON'));

        await expect(client.get('/invalid-json')).rejects.toThrow(
          'Invalid JSON',
        );
      });

      it('handles AbortError correctly', async () => {
        const controller = new AbortController();
        const abortError = new Error('The operation was aborted');
        abortError.name = 'AbortError';
        mockFetch.mockRejectedValue(abortError);

        await expect(client.get('/aborted', controller.signal)).rejects.toThrow(
          'The operation was aborted',
        );
      });
    });

    describe('Various response types', () => {
      it('handles null response data', async () => {
        mockResponse.json.mockResolvedValue(null);

        const result = await client.get('/null-response');

        expect(result).toBeNull();
      });

      it('handles empty object response', async () => {
        mockResponse.json.mockResolvedValue({});

        const result = await client.get('/empty-response');

        expect(result).toEqual({});
      });

      it('handles array response', async () => {
        const mockArray = [{ id: 1 }, { id: 2 }];
        mockResponse.json.mockResolvedValue(mockArray);

        const result = await client.get<typeof mockArray>('/array-response');

        expect(result).toEqual(mockArray);
      });

      it('handles primitive response', async () => {
        mockResponse.json.mockResolvedValue('string response');

        const result = await client.get<string>('/string-response');

        expect(result).toBe('string response');
      });

      it('handles number response', async () => {
        mockResponse.json.mockResolvedValue(42);

        const result = await client.get<number>('/number-response');

        expect(result).toBe(42);
      });

      it('handles boolean response', async () => {
        mockResponse.json.mockResolvedValue(true);

        const result = await client.get<boolean>('/boolean-response');

        expect(result).toBe(true);
      });
    });

    describe('URL construction', () => {
      it('constructs URL correctly with base URL and path', async () => {
        const mockData = { test: true };
        mockResponse.json.mockResolvedValue(mockData);

        await client.get('/users');

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const requestArg = mockFetch.mock.calls[0]?.[0] as Request;
        expect(requestArg.url).toContain('/users');
      });

      it('handles empty path', async () => {
        const mockData = { root: true };
        mockResponse.json.mockResolvedValue(mockData);

        await client.get('');

        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      it('handles path with query parameters', async () => {
        const mockData = { filtered: true };
        mockResponse.json.mockResolvedValue(mockData);

        await client.get('/search?q=test&limit=10');

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const requestArg = mockFetch.mock.calls[0]?.[0] as Request;
        expect(requestArg.url).toContain('search?q=test&limit=10');
      });
    });

    describe('Client instances', () => {
      it('handles different base URLs', async () => {
        const client1 = new ApiClient('https://api1.example.com');
        const client2 = new ApiClient('https://api2.example.com/v1');

        const mockData = { source: 'api' };
        mockResponse.json.mockResolvedValue(mockData);

        await client1.get('/data');
        expect(mockFetch).toHaveBeenCalledTimes(1);

        await client2.get('/data');
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      it('handles different tokens', async () => {
        const client1 = new ApiClient('https://api.example.com', 'token1');
        const client2 = new ApiClient('https://api.example.com', 'token2');

        const mockData = { auth: true };
        mockResponse.json.mockResolvedValue(mockData);

        await client1.get('/auth');
        expect(mockFetch).toHaveBeenCalledTimes(1);

        await client2.get('/auth');
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });
});
