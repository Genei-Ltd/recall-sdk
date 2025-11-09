import { createClient } from './generated/client'
import { GeneratedRecallSdk } from './generated/sdk.gen'
import type {
  AudioMixedDestroyResponse,
  AudioMixedListData,
  AudioMixedListResponse,
  AudioMixedPartialUpdateData,
  AudioMixedPartialUpdateResponse,
  AudioMixedRetrieveResponse,
  AudioSeparateDestroyResponse,
  AudioSeparateListData,
  AudioSeparateListResponse,
  AudioSeparatePartialUpdateData,
  AudioSeparatePartialUpdateResponse,
  AudioSeparateRetrieveResponse,
  BotCreateData,
  BotCreateResponse,
  BotDeleteMediaCreateResponse,
  BotDestroyResponse,
  BotLeaveCallCreateResponse,
  BotListData,
  BotListResponse,
  BotPartialUpdateData,
  BotPartialUpdateResponse,
  BotRetrieveResponse,
  CalendarEventsBotCreateData,
  CalendarEventsBotCreateResponse,
  CalendarEventsBotDestroyResponse,
  CalendarEventsListData,
  CalendarEventsListResponse,
  CalendarEventsRetrieveResponse,
  CalendarsAccessTokenCreateResponse,
  CalendarsCreateData,
  CalendarsCreateResponse,
  CalendarsDestroyResponse,
  CalendarsListData,
  CalendarsListResponse,
  CalendarsPartialUpdateData,
  CalendarsPartialUpdateResponse,
  CalendarsRetrieveResponse,
  RecordingCreateTranscriptCreateData,
  RecordingCreateTranscriptCreateResponse,
  RecordingDestroyResponse,
  RecordingListData,
  RecordingListResponse,
  RecordingRetrieveResponse,
  TranscriptDestroyResponse,
  TranscriptListData,
  TranscriptListResponse,
  TranscriptPartialUpdateData,
  TranscriptPartialUpdateResponse,
  TranscriptRetrieveResponse,
  VideoMixedDestroyResponse,
  VideoMixedListData,
  VideoMixedListResponse,
  VideoMixedPartialUpdateData,
  VideoMixedPartialUpdateResponse,
  VideoMixedRetrieveResponse,
  VideoSeparateDestroyResponse,
  VideoSeparateListData,
  VideoSeparateListResponse,
  VideoSeparatePartialUpdateData,
  VideoSeparatePartialUpdateResponse,
  VideoSeparateRetrieveResponse,
} from './generated/types.gen'
import {
  RecallSdkError,
  RecallSdkTimeoutError,
  isRecallSdkError,
  isRecallSdkTimeoutError,
} from './errors'

const DEFAULT_BASE_URL = 'https://us-east-1.recall.ai'
const IDEMPOTENCY_HEADER_NAME = 'Idempotency-Key'

export type IdempotentRequestOptions = {
  /**
   * Optional idempotency token sent via the `Idempotency-Key` header.
   */
  idempotencyKey?: string
}

const withIdempotencyKey = (options?: IdempotentRequestOptions) =>
  options?.idempotencyKey
    ? ({
        headers: {
          [IDEMPOTENCY_HEADER_NAME]: options.idempotencyKey,
        },
      } as const)
    : {}

const toBearerToken = (apiKey: string) =>
  apiKey.startsWith('Token ') ? apiKey : `Token ${apiKey}`

const createAbortError = (message: string) => {
  if (typeof DOMException === 'function') {
    return new DOMException(message, 'AbortError')
  }

  const error = new Error(message)
  error.name = 'AbortError'
  return error
}

const createTimeoutAbortError = (
  timeoutMs: number,
  request?: Request,
): RecallSdkTimeoutError =>
  new RecallSdkTimeoutError({
    timeoutMs,
    request,
  })

export type RecallSdkOptions = {
  /**
   * Recall.ai API key. A `Bearer` prefix is added automatically when missing.
   */
  apiKey: string
  /**
   * Base URL for the Recall.ai API. Defaults to https://us-east-1.recall.ai
   */
  baseUrl?: string
  /**
   * Abort in-flight HTTP requests when they exceed this timeout (in milliseconds).
   */
  timeoutMs?: number
}

class BotModule {
  constructor(private readonly sdk: GeneratedRecallSdk) {}

  /**
   * List Bots
   *
   * Get a list of all bots.
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  async list(query?: BotListData['query']): Promise<BotListResponse> {
    const result = await this.sdk.botList<true>({
      ...(query ? { query } : {}),
    })
    return result.data
  }

  /**
   * Create Bot
   *
   * Create a new bot.
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  async create(
    body: BotCreateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<BotCreateResponse> {
    const result = await this.sdk.botCreate<true>({
      body,
      ...withIdempotencyKey(options),
    })
    return result.data
  }

  /**
   * Retrieve Bot
   *
   * Get a bot instance.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async retrieve(
    input: string | { botId: string },
  ): Promise<BotRetrieveResponse> {
    const id = typeof input === 'string' ? input : input.botId
    const result = await this.sdk.botRetrieve<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Update Scheduled Bot
   *
   * Update a Scheduled Bot.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async update(
    input: string | { botId: string },
    body: BotPartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<BotPartialUpdateResponse> {
    const id = typeof input === 'string' ? input : input.botId
    const result = await this.sdk.botPartialUpdate<true>({
      path: { id },
      ...(body ? { body } : {}),
      ...withIdempotencyKey(options),
    })
    return result.data
  }

  /**
   * Delete Scheduled Bot
   *
   * Deletes a bot. This can only be done on scheduled bots that have not yet joined a call.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async delete(input: string | { botId: string }): Promise<BotDestroyResponse> {
    const id = typeof input === 'string' ? input : input.botId
    const result = await this.sdk.botDestroy<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Remove Bot From Call
   *
   * Removes the bot from the meeting. This is irreversable.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async leaveCall(
    input: string | { botId: string },
    options?: IdempotentRequestOptions,
  ): Promise<BotLeaveCallCreateResponse> {
    const id = typeof input === 'string' ? input : input.botId
    const result = await this.sdk.botLeaveCallCreate<true>({
      path: { id },
      ...withIdempotencyKey(options),
    })
    return result.data
  }

  /**
   * Delete Bot Media
   *
   * Deletes bot media stored by Recall. This is irreversable.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async deleteMedia(
    input: string | { botId: string },
    options?: IdempotentRequestOptions,
  ): Promise<BotDeleteMediaCreateResponse> {
    const id = typeof input === 'string' ? input : input.botId
    const result = await this.sdk.botDeleteMediaCreate<true>({
      path: { id },
      ...withIdempotencyKey(options),
    })
    return result.data
  }
}

class CalendarEventsModule {
  constructor(private readonly sdk: GeneratedRecallSdk) {}

  /**
   * List Calendar Events
   *
   * Get a list of calendar events.
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  async list(
    query?: CalendarEventsListData['query'],
  ): Promise<CalendarEventsListResponse> {
    const result = await this.sdk.calendarEventsList<true>({
      ...(query ? { query } : {}),
    })
    return result.data
  }

  /**
   * Retrieve Calendar Event
   *
   * Get a calendar event instance.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async retrieve(
    input: string | { eventId: string },
  ): Promise<CalendarEventsRetrieveResponse> {
    const id = typeof input === 'string' ? input : input.eventId
    const result = await this.sdk.calendarEventsRetrieve<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Schedule Bot For Calendar Event
   *
   * Schedule a bot for a calendar event. This endpoint will return the updated calendar event in response.
   *
   * This endpoint is rate limited to:
   * - 600 requests per min per workspace
   */
  async scheduleBot(
    input: string | { eventId: string },
    body: CalendarEventsBotCreateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<CalendarEventsBotCreateResponse> {
    const id = typeof input === 'string' ? input : input.eventId
    const result = await this.sdk.calendarEventsBotCreate<true>({
      path: { id },
      body,
      ...withIdempotencyKey(options),
    })
    return result.data
  }

  /**
   * Schedule Bot For Calendar Event
   *
   * Schedule a bot for a calendar event. This endpoint will return the updated calendar event in response.
   *
   * This endpoint is rate limited to:
   * - 600 requests per min per workspace
   */
  async unscheduleBot(
    input: string | { eventId: string },
  ): Promise<CalendarEventsBotDestroyResponse> {
    const id = typeof input === 'string' ? input : input.eventId
    const result = await this.sdk.calendarEventsBotDestroy<true>({
      path: { id },
    })
    return result.data
  }
}

class CalendarAccountsModule {
  constructor(private readonly sdk: GeneratedRecallSdk) {}

  /**
   * List Calendars
   *
   * Get a list of calendars.
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  async list(
    query?: CalendarsListData['query'],
  ): Promise<CalendarsListResponse> {
    const result = await this.sdk.calendarsList<true>({
      ...(query ? { query } : {}),
    })
    return result.data
  }

  /**
   * Create Calendar
   *
   * Create a new calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async create(
    body: CalendarsCreateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<CalendarsCreateResponse> {
    const result = await this.sdk.calendarsCreate<true>({
      body,
      ...withIdempotencyKey(options),
    })
    return result.data
  }

  /**
   * Retrieve Calendar
   *
   * Get a calendar instance.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async retrieve(
    input: string | { calendarId: string },
  ): Promise<CalendarsRetrieveResponse> {
    const id = typeof input === 'string' ? input : input.calendarId
    const result = await this.sdk.calendarsRetrieve<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Update Calendar
   *
   * Update an existing calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async update(
    input: string | { calendarId: string },
    body: CalendarsPartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<CalendarsPartialUpdateResponse> {
    const id = typeof input === 'string' ? input : input.calendarId
    const result = await this.sdk.calendarsPartialUpdate<true>({
      path: { id },
      body,
      ...withIdempotencyKey(options),
    })
    return result.data
  }

  /**
   * Delete Calendar
   *
   * Deletes a calendar. This will disconnect the calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async delete(
    input: string | { calendarId: string },
  ): Promise<CalendarsDestroyResponse> {
    const id = typeof input === 'string' ? input : input.calendarId
    const result = await this.sdk.calendarsDestroy<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Get Access Token
   *
   * Get the OAuth access token for this calendar account.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async createAccessToken(
    input: string | { calendarId: string },
    options?: IdempotentRequestOptions,
  ): Promise<CalendarsAccessTokenCreateResponse> {
    const id = typeof input === 'string' ? input : input.calendarId
    const result = await this.sdk.calendarsAccessTokenCreate<true>({
      path: { id },
      ...withIdempotencyKey(options),
    })
    return result.data
  }
}

class CalendarModule {
  public readonly events: CalendarEventsModule
  public readonly accounts: CalendarAccountsModule

  constructor(private readonly sdk: GeneratedRecallSdk) {
    this.events = new CalendarEventsModule(this.sdk)
    this.accounts = new CalendarAccountsModule(this.sdk)
  }

  /**
   * List Calendar Events
   *
   * Get a list of calendar events.
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  listEvents(
    query?: CalendarEventsListData['query'],
  ): Promise<CalendarEventsListResponse> {
    return this.events.list(query)
  }

  /**
   * Retrieve Calendar Event
   *
   * Get a calendar event instance.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  retrieveEvent(
    input: string | { eventId: string },
  ): Promise<CalendarEventsRetrieveResponse> {
    return this.events.retrieve(input)
  }

  /**
   * Schedule Bot For Calendar Event
   *
   * Schedule a bot for a calendar event. This endpoint will return the updated calendar event in response.
   *
   * This endpoint is rate limited to:
   * - 600 requests per min per workspace
   */
  scheduleBot(
    input: string | { eventId: string },
    body: CalendarEventsBotCreateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<CalendarEventsBotCreateResponse> {
    return this.events.scheduleBot(input, body, options)
  }

  /**
   * Schedule Bot For Calendar Event
   *
   * Schedule a bot for a calendar event. This endpoint will return the updated calendar event in response.
   *
   * This endpoint is rate limited to:
   * - 600 requests per min per workspace
   */
  unscheduleBot(
    input: string | { eventId: string },
  ): Promise<CalendarEventsBotDestroyResponse> {
    return this.events.unscheduleBot(input)
  }

  /**
   * List Calendars
   *
   * Get a list of calendars.
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  listCalendars(
    query?: CalendarsListData['query'],
  ): Promise<CalendarsListResponse> {
    return this.accounts.list(query)
  }

  /**
   * Create Calendar
   *
   * Create a new calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  createCalendar(
    body: CalendarsCreateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<CalendarsCreateResponse> {
    return this.accounts.create(body, options)
  }

  /**
   * Retrieve Calendar
   *
   * Get a calendar instance.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  retrieveCalendar(
    input: string | { calendarId: string },
  ): Promise<CalendarsRetrieveResponse> {
    return this.accounts.retrieve(input)
  }

  /**
   * Update Calendar
   *
   * Update an existing calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  updateCalendar(
    input: string | { calendarId: string },
    body: CalendarsPartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<CalendarsPartialUpdateResponse> {
    return this.accounts.update(input, body, options)
  }

  /**
   * Delete Calendar
   *
   * Deletes a calendar. This will disconnect the calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  deleteCalendar(
    input: string | { calendarId: string },
  ): Promise<CalendarsDestroyResponse> {
    return this.accounts.delete(input)
  }

  /**
   * Get Access Token
   *
   * Get the OAuth access token for this calendar account.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  createCalendarAccessToken(
    input: string | { calendarId: string },
    options?: IdempotentRequestOptions,
  ): Promise<CalendarsAccessTokenCreateResponse> {
    return this.accounts.createAccessToken(input, options)
  }
}

class RecordingModule {
  constructor(private readonly sdk: GeneratedRecallSdk) {}

  /**
   * List Recordings
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  async list(
    query?: RecordingListData['query'],
  ): Promise<RecordingListResponse> {
    const result = await this.sdk.recordingList<true>({
      ...(query ? { query } : {}),
    })
    return result.data
  }

  /**
   * Delete Recording
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async delete(
    input: string | { recordingId: string },
  ): Promise<RecordingDestroyResponse> {
    const id = typeof input === 'string' ? input : input.recordingId
    const result = await this.sdk.recordingDestroy<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Retrieve Recording
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async retrieve(
    input: string | { recordingId: string },
  ): Promise<RecordingRetrieveResponse> {
    const id = typeof input === 'string' ? input : input.recordingId
    const result = await this.sdk.recordingRetrieve<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Create Async Transcript
   *
   * This endpoint is rate limited to:
   * - 5 requests per min per bot
   */
  async createTranscript(
    input: string | { recordingId: string },
    body: RecordingCreateTranscriptCreateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<RecordingCreateTranscriptCreateResponse> {
    const id = typeof input === 'string' ? input : input.recordingId
    const result = await this.sdk.recordingCreateTranscriptCreate<true>({
      path: { id },
      body,
      ...withIdempotencyKey(options),
    })
    return result.data
  }
}

class TranscriptModule {
  constructor(private readonly sdk: GeneratedRecallSdk) {}

  /**
   * List Transcript
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  async list(
    query?: TranscriptListData['query'],
  ): Promise<TranscriptListResponse> {
    const result = await this.sdk.transcriptList<true>({
      ...(query ? { query } : {}),
    })
    return result.data
  }

  /**
   * Delete Transcript
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async delete(
    input: string | { transcriptId: string },
  ): Promise<TranscriptDestroyResponse> {
    const id = typeof input === 'string' ? input : input.transcriptId
    const result = await this.sdk.transcriptDestroy<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Retrieve Transcript
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async retrieve(
    input: string | { transcriptId: string },
  ): Promise<TranscriptRetrieveResponse> {
    const id = typeof input === 'string' ? input : input.transcriptId
    const result = await this.sdk.transcriptRetrieve<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Update Transcript
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async update(
    input: string | { transcriptId: string },
    body: TranscriptPartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<TranscriptPartialUpdateResponse> {
    const id = typeof input === 'string' ? input : input.transcriptId
    const result = await this.sdk.transcriptPartialUpdate<true>({
      path: { id },
      ...(body ? { body } : {}),
      ...withIdempotencyKey(options),
    })
    return result.data
  }
}

class AudioMixedModule {
  constructor(private readonly sdk: GeneratedRecallSdk) {}

  /**
   * List Audio Mixed
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  async list(
    query?: AudioMixedListData['query'],
  ): Promise<AudioMixedListResponse> {
    const result = await this.sdk.audioMixedList<true>({
      ...(query ? { query } : {}),
    })
    return result.data
  }

  /**
   * Retrieve Audio Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async retrieve(
    input: string | { audioMixedArtifactId: string },
  ): Promise<AudioMixedRetrieveResponse> {
    const id =
      typeof input === 'string' ? input : input.audioMixedArtifactId
    const result = await this.sdk.audioMixedRetrieve<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Update Audio Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async update(
    input: string | { audioMixedArtifactId: string },
    body: AudioMixedPartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<AudioMixedPartialUpdateResponse> {
    const id =
      typeof input === 'string' ? input : input.audioMixedArtifactId
    const result = await this.sdk.audioMixedPartialUpdate<true>({
      path: { id },
      ...(body ? { body } : {}),
      ...withIdempotencyKey(options),
    })
    return result.data
  }

  /**
   * Delete Audio Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async delete(
    input: string | { audioMixedArtifactId: string },
  ): Promise<AudioMixedDestroyResponse> {
    const id =
      typeof input === 'string' ? input : input.audioMixedArtifactId
    const result = await this.sdk.audioMixedDestroy<true>({
      path: { id },
    })
    return result.data
  }
}

class AudioSeparateModule {
  constructor(private readonly sdk: GeneratedRecallSdk) {}

  /**
   * List Audio Separate
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  async list(
    query?: AudioSeparateListData['query'],
  ): Promise<AudioSeparateListResponse> {
    const result = await this.sdk.audioSeparateList<true>({
      ...(query ? { query } : {}),
    })
    return result.data
  }

  /**
   * Retrieve Audio Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async retrieve(
    input: string | { audioSeparateArtifactId: string },
  ): Promise<AudioSeparateRetrieveResponse> {
    const id =
      typeof input === 'string' ? input : input.audioSeparateArtifactId
    const result = await this.sdk.audioSeparateRetrieve<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Update Audio Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async update(
    input: string | { audioSeparateArtifactId: string },
    body: AudioSeparatePartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<AudioSeparatePartialUpdateResponse> {
    const id =
      typeof input === 'string'
        ? input
        : input.audioSeparateArtifactId
    const result = await this.sdk.audioSeparatePartialUpdate<true>({
      path: { id },
      ...(body ? { body } : {}),
      ...withIdempotencyKey(options),
    })
    return result.data
  }

  /**
   * Delete Audio Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async delete(
    input: string | { audioSeparateArtifactId: string },
  ): Promise<AudioSeparateDestroyResponse> {
    const id =
      typeof input === 'string'
        ? input
        : input.audioSeparateArtifactId
    const result = await this.sdk.audioSeparateDestroy<true>({
      path: { id },
    })
    return result.data
  }
}

class AudioModule {
  public readonly mixed: AudioMixedModule
  public readonly separate: AudioSeparateModule

  constructor(private readonly sdk: GeneratedRecallSdk) {
    this.mixed = new AudioMixedModule(this.sdk)
    this.separate = new AudioSeparateModule(this.sdk)
  }

  /**
   * List Audio Mixed
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  listMixed(
    query?: AudioMixedListData['query'],
  ): Promise<AudioMixedListResponse> {
    return this.mixed.list(query)
  }

  /**
   * Retrieve Audio Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  retrieveMixed(
    input: string | { audioMixedArtifactId: string },
  ): Promise<AudioMixedRetrieveResponse> {
    return this.mixed.retrieve(input)
  }

  /**
   * Update Audio Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  updateMixed(
    input: string | { audioMixedArtifactId: string },
    body: AudioMixedPartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<AudioMixedPartialUpdateResponse> {
    return this.mixed.update(input, body, options)
  }

  /**
   * Delete Audio Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  deleteMixed(
    input: string | { audioMixedArtifactId: string },
  ): Promise<AudioMixedDestroyResponse> {
    return this.mixed.delete(input)
  }

  /**
   * List Audio Separate
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  listSeparate(
    query?: AudioSeparateListData['query'],
  ): Promise<AudioSeparateListResponse> {
    return this.separate.list(query)
  }

  /**
   * Retrieve Audio Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  retrieveSeparate(
    input: string | { audioSeparateArtifactId: string },
  ): Promise<AudioSeparateRetrieveResponse> {
    return this.separate.retrieve(input)
  }

  /**
   * Update Audio Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  updateSeparate(
    input: string | { audioSeparateArtifactId: string },
    body: AudioSeparatePartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<AudioSeparatePartialUpdateResponse> {
    return this.separate.update(input, body, options)
  }

  /**
   * Delete Audio Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  deleteSeparate(
    input: string | { audioSeparateArtifactId: string },
  ): Promise<AudioSeparateDestroyResponse> {
    return this.separate.delete(input)
  }
}

class VideoMixedModule {
  constructor(private readonly sdk: GeneratedRecallSdk) {}

  /**
   * List Video Mixed
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  async list(
    query?: VideoMixedListData['query'],
  ): Promise<VideoMixedListResponse> {
    const result = await this.sdk.videoMixedList<true>({
      ...(query ? { query } : {}),
    })
    return result.data
  }

  /**
   * Retrieve Video Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async retrieve(
    input: string | { videoMixedArtifactId: string },
  ): Promise<VideoMixedRetrieveResponse> {
    const id =
      typeof input === 'string' ? input : input.videoMixedArtifactId
    const result = await this.sdk.videoMixedRetrieve<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Update Video Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async update(
    input: string | { videoMixedArtifactId: string },
    body: VideoMixedPartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<VideoMixedPartialUpdateResponse> {
    const id =
      typeof input === 'string' ? input : input.videoMixedArtifactId
    const result = await this.sdk.videoMixedPartialUpdate<true>({
      path: { id },
      ...(body ? { body } : {}),
      ...withIdempotencyKey(options),
    })
    return result.data
  }

  /**
   * Delete Video Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async delete(
    input: string | { videoMixedArtifactId: string },
  ): Promise<VideoMixedDestroyResponse> {
    const id =
      typeof input === 'string' ? input : input.videoMixedArtifactId
    const result = await this.sdk.videoMixedDestroy<true>({
      path: { id },
    })
    return result.data
  }
}

class VideoSeparateModule {
  constructor(private readonly sdk: GeneratedRecallSdk) {}

  /**
   * List Video Separate
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  async list(
    query?: VideoSeparateListData['query'],
  ): Promise<VideoSeparateListResponse> {
    const result = await this.sdk.videoSeparateList<true>({
      ...(query ? { query } : {}),
    })
    return result.data
  }

  /**
   * Retrieve Video Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async retrieve(
    input: string | { videoSeparateArtifactId: string },
  ): Promise<VideoSeparateRetrieveResponse> {
    const id =
      typeof input === 'string' ? input : input.videoSeparateArtifactId
    const result = await this.sdk.videoSeparateRetrieve<true>({
      path: { id },
    })
    return result.data
  }

  /**
   * Update Video Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async update(
    input: string | { videoSeparateArtifactId: string },
    body: VideoSeparatePartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<VideoSeparatePartialUpdateResponse> {
    const id =
      typeof input === 'string'
        ? input
        : input.videoSeparateArtifactId
    const result = await this.sdk.videoSeparatePartialUpdate<true>({
      path: { id },
      ...(body ? { body } : {}),
      ...withIdempotencyKey(options),
    })
    return result.data
  }

  /**
   * Delete Video Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async delete(
    input: string | { videoSeparateArtifactId: string },
  ): Promise<VideoSeparateDestroyResponse> {
    const id =
      typeof input === 'string'
        ? input
        : input.videoSeparateArtifactId
    const result = await this.sdk.videoSeparateDestroy<true>({
      path: { id },
    })
    return result.data
  }
}

class VideoModule {
  public readonly mixed: VideoMixedModule
  public readonly separate: VideoSeparateModule

  constructor(private readonly sdk: GeneratedRecallSdk) {
    this.mixed = new VideoMixedModule(this.sdk)
    this.separate = new VideoSeparateModule(this.sdk)
  }

  /**
   * List Video Mixed
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  listMixed(
    query?: VideoMixedListData['query'],
  ): Promise<VideoMixedListResponse> {
    return this.mixed.list(query)
  }

  /**
   * Retrieve Video Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  retrieveMixed(
    input: string | { videoMixedArtifactId: string },
  ): Promise<VideoMixedRetrieveResponse> {
    return this.mixed.retrieve(input)
  }

  /**
   * Update Video Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  updateMixed(
    input: string | { videoMixedArtifactId: string },
    body: VideoMixedPartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<VideoMixedPartialUpdateResponse> {
    return this.mixed.update(input, body, options)
  }

  /**
   * Delete Video Mixed
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  deleteMixed(
    input: string | { videoMixedArtifactId: string },
  ): Promise<VideoMixedDestroyResponse> {
    return this.mixed.delete(input)
  }

  /**
   * List Video Separate
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  listSeparate(
    query?: VideoSeparateListData['query'],
  ): Promise<VideoSeparateListResponse> {
    return this.separate.list(query)
  }

  /**
   * Retrieve Video Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  retrieveSeparate(
    input: string | { videoSeparateArtifactId: string },
  ): Promise<VideoSeparateRetrieveResponse> {
    return this.separate.retrieve(input)
  }

  /**
   * Update Video Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  updateSeparate(
    input: string | { videoSeparateArtifactId: string },
    body: VideoSeparatePartialUpdateData['body'],
    options?: IdempotentRequestOptions,
  ): Promise<VideoSeparatePartialUpdateResponse> {
    return this.separate.update(input, body, options)
  }

  /**
   * Delete Video Separate
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  deleteSeparate(
    input: string | { videoSeparateArtifactId: string },
  ): Promise<VideoSeparateDestroyResponse> {
    return this.separate.delete(input)
  }
}

export class RecallSdk {
  private readonly _sdk: GeneratedRecallSdk
  public readonly bot: BotModule
  public readonly calendar: CalendarModule
  public readonly recording: RecordingModule
  public readonly transcript: TranscriptModule
  public readonly audio: AudioModule
  public readonly video: VideoModule

  constructor({ baseUrl, apiKey, timeoutMs }: RecallSdkOptions) {
    const authProvider = () => toBearerToken(apiKey)
    const resolvedTimeoutMs =
      timeoutMs === undefined ? undefined : Number(timeoutMs)

    if (
      resolvedTimeoutMs !== undefined &&
      (!Number.isFinite(resolvedTimeoutMs) || resolvedTimeoutMs <= 0)
    ) {
      throw new Error('RecallSdk timeoutMs must be a positive number')
    }

    const clientInstance = createClient({
      baseUrl: baseUrl ?? DEFAULT_BASE_URL,
      auth: authProvider,
      responseStyle: 'fields',
      throwOnError: true,
    })

    if (resolvedTimeoutMs !== undefined) {
      const inflightTimeouts = new WeakMap<Request, () => void>()

      const finalizeRequest = (request?: Request) => {
        if (!request) {
          return
        }
        const cleanup = inflightTimeouts.get(request)
        cleanup?.()
        inflightTimeouts.delete(request)
      }

      clientInstance.interceptors.request.use((request) => {
        const controller = new AbortController()
        const originalSignal = request.signal
        let abortForwarder: (() => void) | undefined
        let timeoutId: ReturnType<typeof setTimeout> | undefined
        let timedRequest: Request | undefined
        let cleanedUp = false

        const cleanup = () => {
          if (cleanedUp) {
            return
          }
          cleanedUp = true
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId)
          }
          if (originalSignal && abortForwarder) {
            originalSignal.removeEventListener('abort', abortForwarder)
          }
        }

        controller.signal.addEventListener('abort', cleanup, { once: true })

        if (originalSignal) {
          if (originalSignal.aborted) {
            controller.abort(
              originalSignal.reason ??
                createAbortError('Request aborted before timeout was applied'),
            )
          } else {
            abortForwarder = () =>
              controller.abort(
                originalSignal.reason ??
                  createAbortError(
                    'Request aborted before timeout elapsed',
                  ),
              )
            originalSignal.addEventListener('abort', abortForwarder, {
              once: true,
            })
          }
        }

        timeoutId = setTimeout(() => {
          controller.abort(
            createTimeoutAbortError(resolvedTimeoutMs, timedRequest ?? request),
          )
        }, resolvedTimeoutMs)

        timedRequest = new Request(request, {
          signal: controller.signal,
        })
        inflightTimeouts.set(timedRequest, cleanup)
        return timedRequest
      })

      clientInstance.interceptors.response.use((response, request) => {
        finalizeRequest(request)
        return response
      })

      clientInstance.interceptors.error.use((error, response, request) => {
        finalizeRequest(request)
        return error
      })
    }

    clientInstance.interceptors.error.use((error, response, request) => {
      if (isRecallSdkError(error) || isRecallSdkTimeoutError(error)) {
        return error
      }

      return new RecallSdkError({
        payload: error,
        response,
        request,
      })
    })

    this._sdk = new GeneratedRecallSdk({ client: clientInstance })
    this.bot = new BotModule(this._sdk)
    this.calendar = new CalendarModule(this._sdk)
    this.recording = new RecordingModule(this._sdk)
    this.transcript = new TranscriptModule(this._sdk)
    this.audio = new AudioModule(this._sdk)
    this.video = new VideoModule(this._sdk)
  }
}
