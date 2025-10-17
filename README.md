# @coloop-ai/recall-sdk

Type-safe client bindings for the Recall.ai meeting bot API. Operations are generated from the provider's OpenAPI fragments and wrapped in a small ergonomic helper.

> ⚠️ This project is maintained by Coloop and is not affiliated with or endorsed by Recall.ai — review their API terms before use.

## Installation

```bash
npm install @coloop-ai/recall-sdk
```

## Quick start

```ts
import { RecallSdk } from '@coloop-ai/recall-sdk'

const recall = new RecallSdk({
  apiKey: process.env.RECALL_API_KEY!,
  // baseUrl: 'https://eu-central-1.recall.ai', // optionally target a different region
})

const bot = await recall.bot.create({
  meeting_url: 'https://zoom.us/j/123456789',
  bot_name: 'Demo bot',
})

const bots = await recall.bot.list({
  status: ['ready', 'joining_call'],
})
console.log(bots.results?.map((entry) => entry.id))

await recall.bot.update(bot.id, {
  metadata: { source: 'docs-example' },
})

const events = await recall.calendar.listEvents({
  start_time__gte: new Date().toISOString(),
})

const nextEvent = events.results?.[0]
if (nextEvent) {
  await recall.calendar.scheduleBot(nextEvent.id, {
    deduplication_key: nextEvent.id,
    bot_config: {
      join_offset: 60,
    },
  })
}
```

The `RecallSdk` automatically adds the `Token` prefix to your API key when missing, throws for non-success responses, and returns the typed response payload for each call.

## High-level helpers

`RecallSdk` mirrors the most common Recall.ai workflows and groups operations into modules:

- `recall.bot` – manage meeting bots (`list`, `create`, `retrieve`, `update`, `delete`, `deleteMedia`).
- `recall.calendar` – convenience entry point with helpers:
  - Calendar events: `listEvents`, `retrieveEvent`, `scheduleBot`, `unscheduleBot`.
  - Calendar accounts: `listCalendars`, `createCalendar`, `retrieveCalendar`, `updateCalendar`, `deleteCalendar`, `createCalendarAccessToken`.
  - Nested modules (`recall.calendar.events` and `recall.calendar.accounts`) expose the same methods if you prefer an explicit namespace.

Every helper takes lightweight identifiers (`botId`, `eventId`, `calendarId`, etc.) with optional request bodies or query objects that match the generated TypeScript types.

## Generated client access

If you need full control over request options (custom headers, alternative response styles, retries), you can work with the generated client directly:

```ts
import { GeneratedRecallSdk, sdk } from '@coloop-ai/recall-sdk'

const client = sdk.createClient({
  baseUrl: 'https://us-east-1.recall.ai',
  auth: () => `Token ${process.env.RECALL_API_KEY}`,
  responseStyle: 'body',
})

const raw = new GeneratedRecallSdk({ client })
const response = await raw.botList({ query: { status: ['ready'] } })
```

All request/response types are exported from `@coloop-ai/recall-sdk` so you can statically type your integrations even when using the low-level surface.

## Webhooks

Recall's webhook payloads (bot lifecycle and Calendar v2 notifications) are not included in the public OpenAPI definitions, so their schemas are hand-crafted in this SDK. You can rely on the exported unions to drive type-safe handlers:

```ts
import type { RecallWebhookEvent } from '@coloop-ai/recall-sdk'

export function handleWebhook(event: RecallWebhookEvent) {
  switch (event.event) {
    case 'bot.status_change': {
      const { code, sub_code } = event.data.status
      if (code === 'call_ended') {
        // `sub_code` is narrowed to a CallEndedSubCode while still accepting future values.
        console.log(sub_code)
      }
      break
    }
    case 'calendar.sync_events': {
      const { calendar_id, last_updated_ts } = event.data
      console.log('Sync calendar', calendar_id, 'since', last_updated_ts)
      break
    }
  }
}
```

Helper constants such as `BOT_STATUS_CODES`, `CALL_ENDED_SUB_CODES`, and `RECALL_WEBHOOK_EVENT_NAMES` are exported to keep your own matching logic aligned with Recall's current surface, while the unions fall back to `string` so your code keeps compiling if new values ship.

## Scripts

- `npm run generate` – fetch merged specs and regenerate `src/generated/**`.
- `npm run tc` – type-check the project without emitting files.
- `npm run lint` – ESLint across the repository.
- `npm run test` – Vitest suite (if meaningful behavior changed, add coverage).
- `npm run build` – compile to dual ESM/CJS bundles in `dist/` using tsdown (runs `npm run generate` first).

## License

Released under the MIT License. See `LICENSE` for details.
