# @coloop-ai/recall-sdk

[![npm version](https://img.shields.io/npm/v/@coloop-ai/recall-sdk.svg)](https://www.npmjs.com/package/@coloop-ai/recall-sdk)
[![npm downloads](https://img.shields.io/npm/dm/@coloop-ai/recall-sdk.svg)](https://www.npmjs.com/package/@coloop-ai/recall-sdk)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@coloop-ai/recall-sdk)](https://bundlephobia.com/package/@coloop-ai/recall-sdk)
[![License: MIT](https://img.shields.io/npm/l/@coloop-ai/recall-sdk.svg)](https://github.com/Genei-Ltd/recall-sdk/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/Genei-Ltd/recall-sdk?style=social)](https://github.com/Genei-Ltd/recall-sdk)

Type-safe client bindings for the Recall.ai meeting bot API. Operations are generated from the provider's OpenAPI fragments and wrapped in an ergonomic SDK.

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

Once a recording finishes processing you can mirror what Recall surfaces in the dashboard:

```ts
const recording = await recall.recording.retrieve(bot.recording_id!)

if (recording.shortcuts?.video_mixed?.id) {
  const video = await recall.video.mixed.retrieve(
    recording.shortcuts.video_mixed.id,
  )
  console.log('Download mixed video from', video.data.download_url)
}

const audioSeparate = await recall.audio.separate.list({
  recording_id: recording.id,
})
const firstParticipantTrack = audioSeparate.results?.[0]
if (firstParticipantTrack) {
  await recall.audio.separate.update(firstParticipantTrack.id, {
    metadata: { exported_by: 'sample-app' },
  })
}
```

The `RecallSdk` automatically adds the `Token` prefix to your API key when missing, throws for non-success responses, and returns the typed response payload for each call.

## Idempotent requests

Methods that issue `POST`, `PUT`, or `PATCH` calls accept an optional `IdempotentRequestOptions` argument. Provide an `idempotencyKey` to send the `Idempotency-Key` header and safely retry requests as described in Recall's [idempotency guide](https://docs.recall.ai/reference/idempotency).

```ts
await recall.bot.create(
  {
    meeting_url: 'https://zoom.us/j/123456789',
    bot_name: 'Demo bot',
  },
  { idempotencyKey: 'my-idempotency-key' },
)
```

## High-level methods

`RecallSdk` mirrors the most common Recall.ai workflows and groups operations into modules:

- `recall.bot` – manage meeting bots (`list`, `create`, `retrieve`, `update`, `delete`, `deleteMedia`, `leaveCall`).
- `recall.calendar` – convenience entry point with methods:
  - Calendar events: `listEvents`, `retrieveEvent`, `scheduleBot`, `unscheduleBot`.
  - Calendar accounts: `listCalendars`, `createCalendar`, `retrieveCalendar`, `updateCalendar`, `deleteCalendar`, `createCalendarAccessToken`.
  - Nested modules (`recall.calendar.events` and `recall.calendar.accounts`) expose the same methods if you prefer an explicit namespace.
- `recall.recording` – work with meeting recordings (`list`, `retrieve`, `delete`, `createTranscript`).
- `recall.transcript` – inspect transcript artifacts (`list`, `retrieve`, `delete`, `update`).
- `recall.audio` – manage audio artifacts. Convenience helpers (`listMixed`, `retrieveMixed`, `updateMixed`, `deleteMixed`, `listSeparate`, `retrieveSeparate`, `updateSeparate`, `deleteSeparate`) delegate to nested modules (`recall.audio.mixed`, `recall.audio.separate`).
- `recall.video` – manage video artifacts via the same helper pattern used for audio.

Every method takes lightweight identifiers (`botId`, `eventId`, `calendarId`, etc.) with optional request bodies or query objects that match the generated TypeScript types.

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

All request/response types are exported from `@coloop-ai/recall-sdk`, while webhook schemas live under `@coloop-ai/recall-sdk/webhooks`, so you can statically type your integrations even when using the low-level surface.

## Webhooks

Recall's webhook payloads (bot lifecycle, Calendar v2 notifications, desktop upload lifecycle, etc.) are not included in the public OpenAPI definitions, so their schemas are hand-crafted in this SDK. The `@coloop-ai/recall-sdk/webhooks` entry point exports runtime validators and TypeScript types powered by Zod:

```ts
import {
  WebhookEvent,
  BotStatusCode,
  CallEndedSubCode,
} from '@coloop-ai/recall-sdk/webhooks'

export function handleWebhook(payload: unknown) {
  const parsed = WebhookEvent.safeParse(payload)
  if (!parsed.success) {
    console.warn('Unhandled webhook payload', parsed.error)
    return
  }

  const event = parsed.data
  switch (event.event) {
    case 'bot.status_change': {
      const { code, sub_code } = event.data.status
      if (code === BotStatusCode.enum.call_ended && sub_code) {
        const reason = CallEndedSubCode.safeParse(sub_code)
        if (reason.success) {
          console.log('Call ended with reason', reason.data)
        }
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

`WebhookEvent` doubles as the discriminated-union type (`import type { WebhookEvent }`) and the union validator (`WebhookEvent.safeParse`). Supporting enums such as `BotStatusCode`, `CallEndedSubCode`, `FatalSubCode`, `ZoomRecordingPermissionDeniedSubCode`, and others keep your matching logic aligned with Recall's surface, while the underlying payload fields still accept future string values so integrations keep compiling when Recall ships new codes.

## Scripts

- `npm run generate` – fetch merged specs and regenerate `src/generated/**`.
- `npm run tc` – type-check the project without emitting files.
- `npm run lint` – ESLint across the repository.
- `npm run test` – Vitest suite (if meaningful behavior changed, add coverage).
- `npm run build` – compile to dual ESM/CJS bundles in `dist/` using tsdown (runs `npm run generate` first).

## License

Released under the MIT License. See `LICENSE` for details.
