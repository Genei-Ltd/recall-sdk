import { afterEach, describe, expect, it, vi } from 'vitest'
import { RecallSdk, RecallSdkError, isRecallSdkError } from '../src'

const realFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = realFetch
  vi.restoreAllMocks()
})

describe('RecallSdkError (mocked fetch)', () => {
  it('wraps non-2xx responses with structured metadata', async () => {
    const payload = {
      code: 'bot_initializing',
      error: 'Bad Request',
      detail: 'Bot is already initializing',
    }

    const mockFetch = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify(payload), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    globalThis.fetch = mockFetch as typeof fetch

    const sdk = new RecallSdk({
      apiKey: 'test-api-key',
      baseUrl: 'https://example.com',
    })

    await expect(
      sdk.bot.retrieve('bot-123').catch((error) => {
        expect(error).toBeInstanceOf(RecallSdkError)
        expect(isRecallSdkError(error)).toBe(true)
        if (isRecallSdkError(error)) {
          expect(error.status).toBe(400)
          expect(error.payload).toEqual(payload)
          expect(error.code).toBe('bot_initializing')
          expect(error.detail).toBe(payload.detail)
          expect(error.response).toBeInstanceOf(Response)
          expect(error.request).toBeInstanceOf(Request)
        }
        throw error
      }),
    ).rejects.toBeInstanceOf(RecallSdkError)
  })

  it('passes through successful payloads without wrapping', async () => {
    const mockResponse = { id: 'bot-123', bot_name: 'Demo' }

    const mockFetch = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    globalThis.fetch = mockFetch as typeof fetch

    const sdk = new RecallSdk({
      apiKey: 'test-api-key',
      baseUrl: 'https://example.com',
    })

    const result = await sdk.bot.retrieve('bot-123')

    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})

describe('RecallSdkError (live API)', () => {
  it('captures authentication failures from Recall', async () => {
    const sdk = new RecallSdk({
      apiKey: 'invalid-api-key',
      baseUrl: 'https://us-east-1.recall.ai',
    })

    await expect(
      sdk.bot.list().catch((error) => {
        expect(isRecallSdkError(error)).toBe(true)
        if (isRecallSdkError(error)) {
          expect(error.status).toBe(401)
          expect(error.payload).toBeDefined()
          expect(error.code).toBe('authentication_failed')
          expect(error.detail?.toLowerCase()).toContain('invalid api token')
        }
        throw error
      }),
    ).rejects.toBeInstanceOf(RecallSdkError)
  }, 30_000)
})
