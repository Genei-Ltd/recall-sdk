export type IsoDateTimeString = string

export type RecallWebhookEnvelope<EventName extends string, Data = unknown> = {
  event: EventName
  data: Data
}

/**
 * Expands a union of known string literals with support for future, unknown values.
 */
export type WithUnknown<T extends string> = T | (string & {})
