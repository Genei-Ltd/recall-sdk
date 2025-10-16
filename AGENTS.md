This document keeps track of the manual steps we expect every agent to perform after the Recall SDK client is regenerated (for example, when schemas change or new endpoints are added). Follow the checklist to keep the repository consistent.

## After regenerating the client

- **Review generated diff**
  - Inspect `src/generated/**` to understand new/renamed/removed endpoints or types.
  - Note any breaking changes (signature changes, removed fields) so downstream wrappers can be updated.

- **Update the `RecallSdk` wrapper**
  - Ensure the high-level modules (`bot`, `calendar.events`, `calendar.accounts`, etc.) expose any newly generated operations.
  - Adjust method signatures to mirror schema updates (e.g., new required properties, renamed path params).
  - Run `npm run tc` to confirm TypeScript stays happy. If meaningful behavior changed, add/update tests.

- **Refresh documentation**
  - Sync `README.md` usage examples and API descriptions with the latest wrapper surface.
  - Mention new concepts (new endpoints, parameters) so users have an up-to-date reference.
  - If breaking changes occurred, record them in any CHANGELOG or release notes workflow (create/update as needed).

- **Regenerate distribution artifacts**
  - Run `npm run build` to refresh `dist/**` after you finish manual edits.
  - Verify the merged spec in `schemas/openapi.json` was updated if new endpoints were added.

- **Pre-publish checks**
  - Execute `npm run lint` and `npm run test` when applicable.
  - Confirm package metadata (version, exports) still aligns with expectations before publishing.

- **Communicate**
  - Leave a concise summary in the PR or commit message describing what changed and why, especially highlighting SDK surface changes.

Keep this file updated whenever the workflow changes so future agents know the latest expectations.
