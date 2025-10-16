import { createClient, type Client, type Config } from "./generated/client";
import { GeneratedRecallSdk } from "./generated/sdk.gen";
import type { Options as GeneratedRequestOptions } from "./generated/sdk.gen";
import type {
  BotCreateData,
  BotDeleteMediaCreateData,
  BotDestroyData,
  BotListData,
  BotPartialUpdateData,
  BotRetrieveData,
  CalendarEventsBotCreateData,
  CalendarEventsBotDestroyData,
  CalendarEventsListData,
  CalendarEventsRetrieveData,
  CalendarsAccessTokenCreateData,
  CalendarsCreateData,
  CalendarsDestroyData,
  CalendarsListData,
  CalendarsPartialUpdateData,
  CalendarsRetrieveData,
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
  ThrowOnError extends boolean,
> = Omit<GeneratedRequestOptions<TData, ThrowOnError>, "body" | "path" | "query">;

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
  list<ThrowOnError extends boolean = false>(
    query?: BotListData["query"],
    options?: RequestConfig<BotListData, ThrowOnError>,
  ) {
    return this.sdk.botList<ThrowOnError>({
      ...(options ?? {}),
      ...(query ? { query } : {}),
    });
  }

  /**
   * Create Bot
   *
   * Create a new bot.
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  create<ThrowOnError extends boolean = false>(
    body: BotCreateData["body"],
    options?: RequestConfig<BotCreateData, ThrowOnError>,
  ) {
    return this.sdk.botCreate<ThrowOnError>({
      ...(options ?? {}),
      body,
    });
  }

  /**
   * Retrieve Bot
   *
   * Get a bot instance.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  retrieve<ThrowOnError extends boolean = false>(
    input: string | { botId: string },
    options?: RequestConfig<BotRetrieveData, ThrowOnError>,
  ) {
    const id = typeof input === "string" ? input : input.botId;
    return this.sdk.botRetrieve<ThrowOnError>({
      ...(options ?? {}),
      path: { id },
    });
  }

  /**
   * Update Scheduled Bot
   *
   * Update a Scheduled Bot.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  update<ThrowOnError extends boolean = false>(
    input: string | { botId: string },
    body: BotPartialUpdateData["body"],
    options?: RequestConfig<BotPartialUpdateData, ThrowOnError>,
  ) {
    const id = typeof input === "string" ? input : input.botId;
    return this.sdk.botPartialUpdate<ThrowOnError>({
      ...(options ?? {}),
      path: { id },
      ...(body ? { body } : {}),
    });
  }

  /**
   * Delete Scheduled Bot
   *
   * Deletes a bot. This can only be done on scheduled bots that have not yet joined a call.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  delete<ThrowOnError extends boolean = false>(
    input: string | { botId: string },
    options?: RequestConfig<BotDestroyData, ThrowOnError>,
  ) {
    const id = typeof input === "string" ? input : input.botId;
    return this.sdk.botDestroy<ThrowOnError>({
      ...(options ?? {}),
      path: { id },
    });
  }

  /**
   * Delete Bot Media
   *
   * Deletes bot media stored by Recall. This is irreversable.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  deleteMedia<ThrowOnError extends boolean = false>(
    input: string | { botId: string },
    options?: RequestConfig<BotDeleteMediaCreateData, ThrowOnError>,
  ) {
    const id = typeof input === "string" ? input : input.botId;
    return this.sdk.botDeleteMediaCreate<ThrowOnError>({
      ...(options ?? {}),
      path: { id },
    });
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
  list<ThrowOnError extends boolean = false>(
    query?: CalendarEventsListData["query"],
    options?: RequestConfig<CalendarEventsListData, ThrowOnError>,
  ) {
    return this.sdk.calendarEventsList<ThrowOnError>({
      ...(options ?? {}),
      ...(query ? { query } : {}),
    });
  }

  /**
   * Retrieve Calendar Event
   *
   * Get a calendar event instance.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  retrieve<ThrowOnError extends boolean = false>(
    input: string | { eventId: string },
    options?: RequestConfig<CalendarEventsRetrieveData, ThrowOnError>,
  ) {
    const id = typeof input === "string" ? input : input.eventId;
    return this.sdk.calendarEventsRetrieve<ThrowOnError>({
      ...(options ?? {}),
      path: { id },
    });
  }

  /**
   * Schedule Bot For Calendar Event
   *
   * Schedule a bot for a calendar event. This endpoint will return the updated calendar event in response.
   *
   * This endpoint is rate limited to:
   * - 600 requests per min per workspace
   */
  scheduleBot<ThrowOnError extends boolean = false>(
    input: string | { eventId: string },
    body: CalendarEventsBotCreateData["body"],
    options?: RequestConfig<CalendarEventsBotCreateData, ThrowOnError>,
  ) {
    const id = typeof input === "string" ? input : input.eventId;
    return this.sdk.calendarEventsBotCreate<ThrowOnError>({
      ...(options ?? {}),
      path: { id },
      body,
    });
  }

  /**
   * Schedule Bot For Calendar Event
   *
   * Schedule a bot for a calendar event. This endpoint will return the updated calendar event in response.
   *
   * This endpoint is rate limited to:
   * - 600 requests per min per workspace
   */
  unscheduleBot<ThrowOnError extends boolean = false>(
    input: string | { eventId: string },
    options?: RequestConfig<CalendarEventsBotDestroyData, ThrowOnError>,
  ) {
    const id = typeof input === "string" ? input : input.eventId;
    return this.sdk.calendarEventsBotDestroy<ThrowOnError>({
      ...(options ?? {}),
      path: { id },
    });
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
  list<ThrowOnError extends boolean = false>(
    query?: CalendarsListData["query"],
    options?: RequestConfig<CalendarsListData, ThrowOnError>,
  ) {
    return this.sdk.calendarsList<ThrowOnError>({
      ...(options ?? {}),
      ...(query ? { query } : {}),
    });
  }

  /**
   * Create Calendar
   *
   * Create a new calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  create<ThrowOnError extends boolean = false>(
    body: CalendarsCreateData["body"],
    options?: RequestConfig<CalendarsCreateData, ThrowOnError>,
  ) {
    return this.sdk.calendarsCreate<ThrowOnError>({
      ...(options ?? {}),
      body,
    });
  }

  /**
   * Retrieve Calendar
   *
   * Get a calendar instance.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  retrieve<ThrowOnError extends boolean = false>(
    input: string | { calendarId: string },
    options?: RequestConfig<CalendarsRetrieveData, ThrowOnError>,
  ) {
    const id = typeof input === "string" ? input : input.calendarId;
    return this.sdk.calendarsRetrieve<ThrowOnError>({
      ...(options ?? {}),
      path: { id },
    });
  }

  /**
   * Update Calendar
   *
   * Update an existing calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  update<ThrowOnError extends boolean = false>(
    input: string | { calendarId: string },
    body: CalendarsPartialUpdateData["body"],
    options?: RequestConfig<CalendarsPartialUpdateData, ThrowOnError>,
  ) {
    const id = typeof input === "string" ? input : input.calendarId;
    return this.sdk.calendarsPartialUpdate<ThrowOnError>({
      ...(options ?? {}),
      path: { id },
      body,
    });
  }

  /**
   * Delete Calendar
   *
   * Deletes a calendar. This will disconnect the calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  delete<ThrowOnError extends boolean = false>(
    input: string | { calendarId: string },
    options?: RequestConfig<CalendarsDestroyData, ThrowOnError>,
  ) {
    const id = typeof input === "string" ? input : input.calendarId;
    return this.sdk.calendarsDestroy<ThrowOnError>({
      ...(options ?? {}),
      path: { id },
    });
  }

  /**
   * Get Access Token
   *
   * Get the OAuth access token for this calendar account.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  createAccessToken<ThrowOnError extends boolean = false>(
    input: string | { calendarId: string },
    options?: RequestConfig<CalendarsAccessTokenCreateData, ThrowOnError>,
  ) {
    const id = typeof input === "string" ? input : input.calendarId;
    return this.sdk.calendarsAccessTokenCreate<ThrowOnError>({
      ...(options ?? {}),
      path: { id },
    });
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
  listEvents<ThrowOnError extends boolean = false>(
    query?: CalendarEventsListData["query"],
    options?: RequestConfig<CalendarEventsListData, ThrowOnError>,
  ) {
    return this.events.list<ThrowOnError>(query, options);
  }

  /**
   * Retrieve Calendar Event
   *
   * Get a calendar event instance.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  retrieveEvent<ThrowOnError extends boolean = false>(
    input: string | { eventId: string },
    options?: RequestConfig<CalendarEventsRetrieveData, ThrowOnError>,
  ) {
    return this.events.retrieve<ThrowOnError>(input, options);
  }

  /**
   * Schedule Bot For Calendar Event
   *
   * Schedule a bot for a calendar event. This endpoint will return the updated calendar event in response.
   *
   * This endpoint is rate limited to:
   * - 600 requests per min per workspace
   */
  scheduleBot<ThrowOnError extends boolean = false>(
    input: string | { eventId: string },
    body: CalendarEventsBotCreateData["body"],
    options?: RequestConfig<CalendarEventsBotCreateData, ThrowOnError>,
  ) {
    return this.events.scheduleBot<ThrowOnError>(input, body, options);
  }

  /**
   * Schedule Bot For Calendar Event
   *
   * Schedule a bot for a calendar event. This endpoint will return the updated calendar event in response.
   *
   * This endpoint is rate limited to:
   * - 600 requests per min per workspace
   */
  unscheduleBot<ThrowOnError extends boolean = false>(
    input: string | { eventId: string },
    options?: RequestConfig<CalendarEventsBotDestroyData, ThrowOnError>,
  ) {
    return this.events.unscheduleBot<ThrowOnError>(input, options);
  }

  /**
   * List Calendars
   *
   * Get a list of calendars.
   *
   * This endpoint is rate limited to:
   * - 60 requests per min per workspace
   */
  listCalendars<ThrowOnError extends boolean = false>(
    query?: CalendarsListData["query"],
    options?: RequestConfig<CalendarsListData, ThrowOnError>,
  ) {
    return this.accounts.list<ThrowOnError>(query, options);
  }

  /**
   * Create Calendar
   *
   * Create a new calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  createCalendar<ThrowOnError extends boolean = false>(
    body: CalendarsCreateData["body"],
    options?: RequestConfig<CalendarsCreateData, ThrowOnError>,
  ) {
    return this.accounts.create<ThrowOnError>(body, options);
  }

  /**
   * Retrieve Calendar
   *
   * Get a calendar instance.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  retrieveCalendar<ThrowOnError extends boolean = false>(
    input: string | { calendarId: string },
    options?: RequestConfig<CalendarsRetrieveData, ThrowOnError>,
  ) {
    return this.accounts.retrieve<ThrowOnError>(input, options);
  }

  /**
   * Update Calendar
   *
   * Update an existing calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  updateCalendar<ThrowOnError extends boolean = false>(
    input: string | { calendarId: string },
    body: CalendarsPartialUpdateData["body"],
    options?: RequestConfig<CalendarsPartialUpdateData, ThrowOnError>,
  ) {
    return this.accounts.update<ThrowOnError>(input, body, options);
  }

  /**
   * Delete Calendar
   *
   * Deletes a calendar. This will disconnect the calendar.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  deleteCalendar<ThrowOnError extends boolean = false>(
    input: string | { calendarId: string },
    options?: RequestConfig<CalendarsDestroyData, ThrowOnError>,
  ) {
    return this.accounts.delete<ThrowOnError>(input, options);
  }

  /**
   * Get Access Token
   *
   * Get the OAuth access token for this calendar account.
   *
   * This endpoint is rate limited to:
   * - 300 requests per min per workspace
   */
  createCalendarAccessToken<ThrowOnError extends boolean = false>(
    input: string | { calendarId: string },
    options?: RequestConfig<CalendarsAccessTokenCreateData, ThrowOnError>,
  ) {
    return this.accounts.createAccessToken<ThrowOnError>(input, options);
  }
}

export class RecallSdk {
  private readonly _sdk: GeneratedRecallSdk;
  public readonly bot: BotModule;
  public readonly calendar: CalendarModule;

  constructor({ apiKey, client, ...config }: RecallSdkOptions) {
    const clientInstance = client ?? createClient();
    const authProvider = () => toBearerToken(apiKey);

    clientInstance.setConfig({
      ...config,
      auth: authProvider,
    });

    this._sdk = new GeneratedRecallSdk({ client: clientInstance });
    this.bot = new BotModule(this._sdk);
    this.calendar = new CalendarModule(this._sdk);
  }
}
