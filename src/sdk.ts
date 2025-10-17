import { createClient } from './generated/client'
import { GeneratedRecallSdk } from './generated/sdk.gen'
import type {
  BotCreateData,
  BotCreateResponse,
  BotDeleteMediaCreateResponse,
  BotDestroyResponse,
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
  TranscriptRetrieveResponse,
} from './generated/types.gen'

const DEFAULT_BASE_URL = 'https://us-east-1.recall.ai'

const toBearerToken = (apiKey: string) =>
  apiKey.startsWith('Token ') ? apiKey : `Token ${apiKey}`

export type RecallSdkOptions = {
  /**
   * Recall.ai API key. A `Bearer` prefix is added automatically when missing.
   */
  apiKey: string
  /**
   * Base URL for the Recall.ai API. Defaults to https://us-east-1.recall.ai
   */
  baseUrl?: string
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
  async create(body: BotCreateData['body']): Promise<BotCreateResponse> {
    const result = await this.sdk.botCreate<true>({
      body,
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
  ): Promise<BotPartialUpdateResponse> {
    const id = typeof input === 'string' ? input : input.botId
    const result = await this.sdk.botPartialUpdate<true>({
      path: { id },
      ...(body ? { body } : {}),
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
   * Delete Bot Media
   *
   * Deletes bot media stored by Recall. This is irreversable.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async deleteMedia(
    input: string | { botId: string },
  ): Promise<BotDeleteMediaCreateResponse> {
    const id = typeof input === 'string' ? input : input.botId
    const result = await this.sdk.botDeleteMediaCreate<true>({
      path: { id },
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
  ): Promise<CalendarEventsBotCreateResponse> {
    const id = typeof input === 'string' ? input : input.eventId
    const result = await this.sdk.calendarEventsBotCreate<true>({
      path: { id },
      body,
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
  ): Promise<CalendarsCreateResponse> {
    const result = await this.sdk.calendarsCreate<true>({
      body,
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
  ): Promise<CalendarsPartialUpdateResponse> {
    const id = typeof input === 'string' ? input : input.calendarId
    const result = await this.sdk.calendarsPartialUpdate<true>({
      path: { id },
      body,
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
  ): Promise<CalendarsAccessTokenCreateResponse> {
    const id = typeof input === 'string' ? input : input.calendarId
    const result = await this.sdk.calendarsAccessTokenCreate<true>({
      path: { id },
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
  ): Promise<CalendarEventsBotCreateResponse> {
    return this.events.scheduleBot(input, body)
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
  ): Promise<CalendarsCreateResponse> {
    return this.accounts.create(body)
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
  ): Promise<CalendarsPartialUpdateResponse> {
    return this.accounts.update(input, body)
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
  ): Promise<CalendarsAccessTokenCreateResponse> {
    return this.accounts.createAccessToken(input)
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
  ): Promise<RecordingCreateTranscriptCreateResponse> {
    const id = typeof input === 'string' ? input : input.recordingId
    const result = await this.sdk.recordingCreateTranscriptCreate<true>({
      path: { id },
      body,
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
}

export class RecallSdk {
  private readonly _sdk: GeneratedRecallSdk
  public readonly bot: BotModule
  public readonly calendar: CalendarModule
  public readonly recording: RecordingModule
  public readonly transcript: TranscriptModule

  constructor({ baseUrl, apiKey }: RecallSdkOptions) {
    const authProvider = () => toBearerToken(apiKey)

    const clientInstance = createClient({
      baseUrl: baseUrl ?? DEFAULT_BASE_URL,
      auth: authProvider,
      responseStyle: 'fields',
      throwOnError: true,
    })

    this._sdk = new GeneratedRecallSdk({ client: clientInstance })
    this.bot = new BotModule(this._sdk)
    this.calendar = new CalendarModule(this._sdk)
    this.recording = new RecordingModule(this._sdk)
    this.transcript = new TranscriptModule(this._sdk)
  }
}
