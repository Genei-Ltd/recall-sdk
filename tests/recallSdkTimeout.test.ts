import { afterEach, describe, expect, it, vi } from 'vitest'
import { RecallSdk, RecallSdkTimeoutError } from '../src'

const realFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = realFetch
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('RecallSdk request timeouts', () => {
  it('aborts long-running requests once the configured timeout elapses', async () => {
    vi.useFakeTimers()

    const fetchMock = vi
      .fn<(request: Request) => Promise<Response>>()
      .mockImplementation(
        (request) =>
          new Promise((_resolve, reject) => {
            request.signal.addEventListener(
              'abort',
              () => {
                const reason = request.signal.reason as unknown
                if (reason instanceof Error) {
                  reject(reason)
                  return
                }
                reject(new Error('Request aborted before mock resolved'))
              },
              { once: true },
            )
          }),
      )

    globalThis.fetch = fetchMock as typeof fetch

    const sdk = new RecallSdk({
      apiKey: 'test-api-key',
      baseUrl: 'https://example.com',
      timeoutMs: 100,
    })

    const pending = sdk.bot.list()
    const expectInstance = expect(pending).rejects.toBeInstanceOf(
      RecallSdkTimeoutError,
    )
    const expectTimeoutField = expect(pending).rejects.toMatchObject({
      timeoutMs: 100,
    })
    const expectMessage = expect(pending).rejects.toThrow(/timeout/i)

    await vi.advanceTimersByTimeAsync(150)

    await expectInstance
    await expectTimeoutField
    await expectMessage
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('lets in-flight requests finish when they complete before the timeout', async () => {
    vi.useFakeTimers()

    const fetchMock = vi
      .fn<(request: Request) => Promise<Response>>()
      .mockImplementation(
        (request) =>
          new Promise((resolve, reject) => {
            request.signal.addEventListener(
              'abort',
              () => {
                const reason = request.signal.reason as unknown
                reject(
                  reason instanceof Error
                    ? reason
                    : new Error('Unexpected abort'),
                )
              },
              { once: true },
            )

            setTimeout(() => {
              resolve(
                new Response(JSON.stringify({ results: [] }), {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' },
                }),
              )
            }, 50)
          }),
      )

    globalThis.fetch = fetchMock as typeof fetch

    const sdk = new RecallSdk({
      apiKey: 'test-api-key',
      baseUrl: 'https://example.com',
      timeoutMs: 100,
    })

    const pending = sdk.bot.list()
    await vi.advanceTimersByTimeAsync(50)

    await expect(pending).resolves.toEqual({ results: [] })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const request = fetchMock.mock.calls[0]?.[0]
    expect(request).toBeInstanceOf(Request)
    expect(request?.signal.aborted).toBe(false)
  })
})
