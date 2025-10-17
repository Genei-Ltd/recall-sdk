import type { IsoDateTimeString, RecallWebhookEnvelope } from './shared'

export const CALENDAR_WEBHOOK_EVENT_NAMES = [
  'calendar.update',
  'calendar.sync_events',
] as const

export type CalendarWebhookEventName =
  (typeof CALENDAR_WEBHOOK_EVENT_NAMES)[number]

export type CalendarUpdateData = {
  calendar_id: string
}

export type CalendarUpdateEvent = RecallWebhookEnvelope<
  'calendar.update',
  CalendarUpdateData
>

export type CalendarSyncEventsData = {
  calendar_id: string
  last_updated_ts: IsoDateTimeString
}

export type CalendarSyncEventsEvent = RecallWebhookEnvelope<
  'calendar.sync_events',
  CalendarSyncEventsData
>

export type CalendarWebhookEvent = CalendarUpdateEvent | CalendarSyncEventsEvent
