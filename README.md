# @coloop-ai/recall-sdk

Type-safe client bindings for the Recall.ai meeting bot API. The SDK is generated from the individual endpoint specs that Recall.ai publishes in their reference documentation, merged into a single OpenAPI document, and bundled for npm distribution.

## Usage

Install the package from npm and import the generated helpers:

```bash
npm install @coloop-ai/recall-sdk
```

```ts
import { botCreate, botRetrieve } from '@coloop-ai/recall-sdk';
import { recallClient } from '@coloop-ai/recall-sdk';

const client = recallClient.createClient({
  baseUrl: 'https://api.recall.ai',
  headers: {
    Authorization: `Bearer ${process.env.RECALL_API_KEY!}`,
  },
});

const bot = await botCreate({ client, body: { meeting_url: 'https://zoom.us/j/123456789' } });
const refreshed = await botRetrieve({ client, path: { id: bot.id } });
```

All OpenAPI operations are available as functions exported from the root package. If you prefer to wire the HTTP client yourself, the lower-level helpers remain accessible via the `recallClient` namespace.

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
