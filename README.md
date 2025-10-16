# @coloop-ai/recall-sdk

Type-safe client bindings for the Recall.ai meeting bot API. The SDK is generated from the individual endpoint specs that Recall.ai publishes in their reference documentation, merged into a single OpenAPI document, and bundled for npm distribution. This library is community-maintained and not affiliated with or endorsed by Recall.ai—be sure to review their API terms before use.

## Usage

Install the package from npm and import the generated helpers:

```bash
npm install @coloop-ai/recall-sdk
```

```ts
import { RecallSdk } from '@coloop-ai/recall-sdk';

const recall = new RecallSdk({ apiKey: process.env.RECALL_API_KEY! });

const bot = await recall.bot.create({
  meeting_url: 'https://zoom.us/j/123456789',
  bot_name: 'My Bot',
});
const refreshed = await recall.bot.retrieve(bot.id);
const { data: bots } = await recall.bot.list({
  status: ['ready', 'joining_call'],
});

await recall.bot.update(bot.id, {
  metadata: { source: 'demo' },
});

const { data: events } = await recall.calendar.listEvents({
  start_time__gte: new Date().toISOString(),
});

if (events?.results?.length) {
  await recall.calendar.scheduleBot(events.results[0].id, {
    join_offset: 60,
  });
}
```

### High-level API

The `RecallSdk` class exposes grouped helpers:

- `recall.bot` handles bot lifecycle (`list`, `create`, `retrieve`, `update`, `delete`, `deleteMedia`).
- `recall.calendar` aggregates calendar operations and is further split into:
  - top-level conveniences (`listEvents`, `retrieveEvent`, `scheduleBot`, `unscheduleBot`, `listCalendars`, `createCalendar`, `retrieveCalendar`, `updateCalendar`, `deleteCalendar`, `createCalendarAccessToken`);
  - nested `recall.calendar.events` / `recall.calendar.accounts` for more granular control if you prefer explicit modules.

Each method accepts lightweight arguments (`botId`, `eventId`, etc.) and forwards them to the generated client. You can still pass advanced request options (headers, response style, and so on) via an optional second parameter.

### Generated helpers still available

All OpenAPI operations remain available as standalone functions from `src/generated/**` if you prefer the auto-generated surface. You can also reach the underlying low-level HTTP client via the `sdk` namespace export.

## Code generation workflow

- Requirements: `bun` on your PATH (used for fetching/merging specs and running codegen).
- Run `npm run generate` (or `bun run generate`) whenever you need to refresh API artifacts. The script:
  1. Downloads each endpoint schema listed in `scripts/fetch-and-merge-openapi.ts`.
  2. Produces `schemas/openapi.json`, a merged OpenAPI 3.0 spec.
  3. Invokes `@hey-api/openapi-ts` to regenerate the SDK under `src/generated/**`.
- Extend `scripts/fetch-and-merge-openapi.ts` with additional endpoints as Recall.ai exposes new operations, then re-run the generate script.
- Optional: validate any schema with `scripts/validate-openapi.ts`:

  ```bash
  bun run scripts/validate-openapi.ts schemas/bot_create.json schemas/openapi.json
  ```

## Building and publishing

- `npm run build` (or `bun run build`) compiles the SDK with **tsdown**, producing dual ESM/CJS bundles and type declarations in `dist/`. The build automatically regenerates API artifacts first.
- `npm publish` will run the build pipeline before packaging, ensuring the published tarball includes the latest generated code and OpenAPI snapshot.
- The package exposes the merged OpenAPI document at `schemas/openapi.json` for downstream tooling.
- To publish to npm under the `@coloop-ai` scope:
  1. Ensure you have publish rights for the `@coloop-ai` org on npm.
  2. Run `npm login --scope=@coloop-ai` (with 2FA if required) and `npm whoami` to confirm.
  3. Bump the version with `npm version <patch|minor|major>`.
  4. Regenerate/build one last time via `npm run build`.
  5. Publish with `npm publish --access public`.
     - The `--access public` flag is required the first time a scoped package is published.

## Scripts

- `bun run generate`
- `bun run build`
- `bun run lint`
- `bun run tc`
- `bun run test`

## License

Released under the MIT License. See `LICENSE` for details.
