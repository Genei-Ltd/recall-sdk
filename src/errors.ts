export type RecallSdkErrorOptions<TPayload = unknown> = {
  payload: TPayload
  response: Response
  request: Request
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toNonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const extractMessage = (payload: unknown, response: Response): string => {
  const stringPayload = toNonEmptyString(payload)
  if (stringPayload) {
    return stringPayload
  }

  if (isRecord(payload)) {
    for (const key of ['error', 'detail', 'message']) {
      const candidate = toNonEmptyString(payload[key])
      if (candidate) {
        return candidate
      }
    }
  }

  const parts = ['Recall request failed']
  if (response.status) {
    parts.push(`with status ${response.status}`)
  }
  if (response.statusText) {
    parts.push(`(${response.statusText})`)
  }
  return parts.join(' ').trim()
}

type Fields = {
  code?: string
  detail?: string
}

const extractStructuredFields = (payload: unknown): Fields => {
  if (!isRecord(payload)) {
    return {}
  }

  const code = toNonEmptyString(payload.code)
  const detail = toNonEmptyString(payload.detail)

  const fields: Fields = {}

  if (code) {
    fields.code = code
  }

  if (detail) {
    fields.detail = detail
  }

  return fields
}

export class RecallSdkError<TPayload = unknown> extends Error {
  public readonly status: number
  public readonly statusText: string
  public readonly payload: TPayload
  public readonly response: Response
  public readonly request: Request
  public readonly code?: string
  public readonly detail?: string

  constructor(options: RecallSdkErrorOptions<TPayload>) {
    const { payload, response, request } = options
    super(extractMessage(payload, response))
    this.name = 'RecallSdkError'
    this.status = response.status
    this.statusText = response.statusText
    this.payload = payload
    this.response = response
    this.request = request

    const structured = extractStructuredFields(payload)
    this.code = structured.code
    this.detail = structured.detail

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, RecallSdkError)
    }
  }
}

export const isRecallSdkError = (
  error: unknown,
): error is RecallSdkError<unknown> => error instanceof RecallSdkError

export type RecallSdkTimeoutErrorOptions = {
  timeoutMs: number
  request?: Request
}

export class RecallSdkTimeoutError extends Error {
  public readonly timeoutMs: number
  public readonly request?: Request

  constructor({ timeoutMs, request }: RecallSdkTimeoutErrorOptions) {
    super(`Recall request aborted after exceeding timeout of ${timeoutMs}ms`)
    this.name = 'RecallSdkTimeoutError'
    this.timeoutMs = timeoutMs
    this.request = request

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, RecallSdkTimeoutError)
    }
  }
}

export const isRecallSdkTimeoutError = (
  error: unknown,
): error is RecallSdkTimeoutError => error instanceof RecallSdkTimeoutError
