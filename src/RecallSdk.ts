import { createClient, type Client, type Config } from "./generated/client";
import { GeneratedRecallSdk } from "./generated/sdk.gen";
import type { Options as GeneratedRequestOptions } from "./generated/sdk.gen";
import type {
  BotCreateData,
  BotCreateResponse,
  BotDeleteMediaCreateData,
  BotDeleteMediaCreateResponse,
  BotDestroyData,
  BotDestroyResponse,
  BotListData,
  BotListResponse,
  BotPartialUpdateData,
  BotPartialUpdateResponse,
  BotRetrieveData,
  BotRetrieveResponse,
  CalendarEventsBotCreateData,
  CalendarEventsBotCreateResponse,
  CalendarEventsBotDestroyData,
  CalendarEventsBotDestroyResponse,
  CalendarEventsListData,
  CalendarEventsListResponse,
  CalendarEventsRetrieveData,
  CalendarEventsRetrieveResponse,
  CalendarsAccessTokenCreateData,
  CalendarsAccessTokenCreateResponse,
  CalendarsCreateData,
  CalendarsCreateResponse,
  CalendarsDestroyData,
  CalendarsDestroyResponse,
  CalendarsListData,
  CalendarsListResponse,
  CalendarsPartialUpdateData,
  CalendarsPartialUpdateResponse,
  CalendarsRetrieveData,
  CalendarsRetrieveResponse,
} from "./generated/types.gen";

const toBearerToken = (apiKey: string) =>
  apiKey.startsWith("Bearer ") ? apiKey : `Bearer ${apiKey}`;

export type RecallSdkClientConfig = Partial<Omit<Config, "auth">>;

export interface RecallSdkOptions extends RecallSdkClientConfig {
  /**
   * Recall.ai API key. A `Bearer` prefix is added automatically when missing.
   */
  apiKey: string;
  /**
   * Provide an existing client instance if you need custom wiring.
   * When omitted, a new client will be created for this SDK instance.
   */
  client?: Client;
}

type RequestConfig<
  TData extends {
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    url: string;
  },
> = Omit<
  GeneratedRequestOptions<TData, true>,
  "body" | "path" | "query" | "throwOnError" | "responseStyle"
>;

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
  async list(
    query?: BotListData["query"],
    options?: RequestConfig<BotListData>,
  ): Promise<BotListResponse> {
    const result = await this.sdk.botList<true>({
      ...(options ?? {}),
      ...(query ? { query } : {}),
      throwOnError: true,
    });
    return result.data;
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
    body: BotCreateData["body"],
    options?: RequestConfig<BotCreateData>,
  ): Promise<BotCreateResponse> {
    const result = await this.sdk.botCreate<true>({
      ...(options ?? {}),
      body,
      throwOnError: true,
    });
    return result.data;
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
    options?: RequestConfig<BotRetrieveData>,
  ): Promise<BotRetrieveResponse> {
    const id = typeof input === "string" ? input : input.botId;
    const result = await this.sdk.botRetrieve<true>({
      ...(options ?? {}),
      path: { id },
      throwOnError: true,
    });
    return result.data;
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
    body: BotPartialUpdateData["body"],
    options?: RequestConfig<BotPartialUpdateData>,
  ): Promise<BotPartialUpdateResponse> {
    const id = typeof input === "string" ? input : input.botId;
    const result = await this.sdk.botPartialUpdate<true>({
      ...(options ?? {}),
      path: { id },
      ...(body ? { body } : {}),
      throwOnError: true,
    });
    return result.data;
  }

  /**
   * Delete Scheduled Bot
   *
   * Deletes a bot. This can only be done on scheduled bots that have not yet joined a call.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  async delete(
    input: string | { botId: string },
    options?: RequestConfig<BotDestroyData>,
  ): Promise<BotDestroyResponse> {
    const id = typeof input === "string" ? input : input.botId;
    const result = await this.sdk.botDestroy<true>({
      ...(options ?? {}),
      path: { id },
      throwOnError: true,
    });
    return result.data;
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
    options?: RequestConfig<BotDeleteMediaCreateData>,
  ): Promise<BotDeleteMediaCreateResponse> {
    const id = typeof input === "string" ? input : input.botId;
    const result = await this.sdk.botDeleteMediaCreate<true>({
      ...(options ?? {}),
      path: { id },
      throwOnError: true,
    });
    return result.data;
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
    query?: CalendarEventsListData["query"],
    options?: RequestConfig<CalendarEventsListData>,
  ): Promise<CalendarEventsListResponse> {
    const result = await this.sdk.calendarEventsList<true>({
      ...(options ?? {}),
      ...(query ? { query } : {}),
      throwOnError: true,
    });
    return result.data;
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
    options?: RequestConfig<CalendarEventsRetrieveData>,
  ): Promise<CalendarEventsRetrieveResponse> {
    const id = typeof input === "string" ? input : input.eventId;
    const result = await this.sdk.calendarEventsRetrieve<true>({
      ...(options ?? {}),
      path: { id },
      throwOnError: true,
    });
    return result.data;
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
    body: CalendarEventsBotCreateData["body"],
    options?: RequestConfig<CalendarEventsBotCreateData>,
  ): Promise<CalendarEventsBotCreateResponse> {
    const id = typeof input === "string" ? input : input.eventId;
    const result = await this.sdk.calendarEventsBotCreate<true>({
      ...(options ?? {}),
      path: { id },
      body,
      throwOnError: true,
    });
    return result.data;
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
    options?: RequestConfig<CalendarEventsBotDestroyData>,
  ): Promise<CalendarEventsBotDestroyResponse> {
    const id = typeof input === "string" ? input : input.eventId;
    const result = await this.sdk.calendarEventsBotDestroy<true>({
      ...(options ?? {}),
      path: { id },
      throwOnError: true,
    });
    return result.data;
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
    query?: CalendarsListData["query"],
    options?: RequestConfig<CalendarsListData>,
  ): Promise<CalendarsListResponse> {
    const result = await this.sdk.calendarsList<true>({
      ...(options ?? {}),
      ...(query ? { query } : {}),
      throwOnError: true,
    });
    return result.data;
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
    body: CalendarsCreateData["body"],
    options?: RequestConfig<CalendarsCreateData>,
  ): Promise<CalendarsCreateResponse> {
    const result = await this.sdk.calendarsCreate<true>({
      ...(options ?? {}),
      body,
      throwOnError: true,
    });
    return result.data;
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
    options?: RequestConfig<CalendarsRetrieveData>,
  ): Promise<CalendarsRetrieveResponse> {
    const id = typeof input === "string" ? input : input.calendarId;
    const result = await this.sdk.calendarsRetrieve<true>({
      ...(options ?? {}),
      path: { id },
      throwOnError: true,
    });
    return result.data;
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
    body: CalendarsPartialUpdateData["body"],
    options?: RequestConfig<CalendarsPartialUpdateData>,
  ): Promise<CalendarsPartialUpdateResponse> {
    const id = typeof input === "string" ? input : input.calendarId;
    const result = await this.sdk.calendarsPartialUpdate<true>({
      ...(options ?? {}),
      path: { id },
      body,
      throwOnError: true,
    });
    return result.data;
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
    options?: RequestConfig<CalendarsDestroyData>,
  ): Promise<CalendarsDestroyResponse> {
    const id = typeof input === "string" ? input : input.calendarId;
    const result = await this.sdk.calendarsDestroy<true>({
      ...(options ?? {}),
      path: { id },
      throwOnError: true,
    });
    return result.data;
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
    options?: RequestConfig<CalendarsAccessTokenCreateData>,
  ): Promise<CalendarsAccessTokenCreateResponse> {
    const id = typeof input === "string" ? input : input.calendarId;
    const result = await this.sdk.calendarsAccessTokenCreate<true>({
      ...(options ?? {}),
      path: { id },
      throwOnError: true,
    });
    return result.data;
  }
}

class CalendarModule {
  public readonly events: CalendarEventsModule;
  public readonly accounts: CalendarAccountsModule;

  constructor(private readonly sdk: GeneratedRecallSdk) {
    this.events = new CalendarEventsModule(this.sdk);
    this.accounts = new CalendarAccountsModule(this.sdk);
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
    query?: CalendarEventsListData["query"],
    options?: RequestConfig<CalendarEventsListData>,
  ): Promise<CalendarEventsListResponse> {
    return this.events.list(query, options);
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
    options?: RequestConfig<CalendarEventsRetrieveData>,
  ): Promise<CalendarEventsRetrieveResponse> {
    return this.events.retrieve(input, options);
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
    body: CalendarEventsBotCreateData["body"],
    options?: RequestConfig<CalendarEventsBotCreateData>,
  ): Promise<CalendarEventsBotCreateResponse> {
    return this.events.scheduleBot(input, body, options);
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
    options?: RequestConfig<CalendarEventsBotDestroyData>,
  ): Promise<CalendarEventsBotDestroyResponse> {
    return this.events.unscheduleBot(input, options);
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
    query?: CalendarsListData["query"],
    options?: RequestConfig<CalendarsListData>,
  ): Promise<CalendarsListResponse> {
    return this.accounts.list(query, options);
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
    body: CalendarsCreateData["body"],
    options?: RequestConfig<CalendarsCreateData>,
  ): Promise<CalendarsCreateResponse> {
    return this.accounts.create(body, options);
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
    options?: RequestConfig<CalendarsRetrieveData>,
  ): Promise<CalendarsRetrieveResponse> {
    return this.accounts.retrieve(input, options);
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
    body: CalendarsPartialUpdateData["body"],
    options?: RequestConfig<CalendarsPartialUpdateData>,
  ): Promise<CalendarsPartialUpdateResponse> {
    return this.accounts.update(input, body, options);
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
    options?: RequestConfig<CalendarsDestroyData>,
  ): Promise<CalendarsDestroyResponse> {
    return this.accounts.delete(input, options);
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
    options?: RequestConfig<CalendarsAccessTokenCreateData>,
  ): Promise<CalendarsAccessTokenCreateResponse> {
    return this.accounts.createAccessToken(input, options);
  }
}

export class RecallSdk {
  private readonly _sdk: GeneratedRecallSdk;
  public readonly bot: BotModule;
  public readonly calendar: CalendarModule;

  constructor({ apiKey, client, ...options }: RecallSdkOptions) {
    const clientInstance = client ?? createClient();
    const authProvider = () => toBearerToken(apiKey);
    const { throwOnError, responseStyle, ...config } = options;

    clientInstance.setConfig({
      ...config,
      auth: authProvider,
      responseStyle: responseStyle ?? "fields",
      throwOnError: throwOnError ?? true,
    });

    this._sdk = new GeneratedRecallSdk({ client: clientInstance });
    this.bot = new BotModule(this._sdk);
    this.calendar = new CalendarModule(this._sdk);
  }
}
