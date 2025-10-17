import type { BotWebhookEvent, BotWebhookEventName } from './bot'
import { BOT_WEBHOOK_EVENT_NAMES } from './bot'
import type { CalendarWebhookEvent, CalendarWebhookEventName } from './calendar'
import { CALENDAR_WEBHOOK_EVENT_NAMES } from './calendar'
import type { RecallWebhookEnvelope } from './shared'

export * from './shared'
export * from './bot'
export * from './calendar'

export type KnownRecallWebhookEvent = BotWebhookEvent | CalendarWebhookEvent
export type KnownRecallWebhookEventName =
  | BotWebhookEventName
  | CalendarWebhookEventName

export const RECALL_WEBHOOK_EVENT_NAMES = [
  ...BOT_WEBHOOK_EVENT_NAMES,
  ...CALENDAR_WEBHOOK_EVENT_NAMES,
] as const

export type RecallWebhookEventName = KnownRecallWebhookEventName

export type RecallWebhookEvent = KnownRecallWebhookEvent

export type UnknownRecallWebhookEvent = RecallWebhookEnvelope<
  string,
  Record<string, unknown>
>

export type AnyRecallWebhookEvent =
  | RecallWebhookEvent
  | UnknownRecallWebhookEvent
