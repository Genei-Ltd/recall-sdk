# Maintainer Guide

Follow this workflow whenever the SDK surface changes or new endpoints are introduced:

1. Run `npm run generate` to refresh `schemas/openapi.json` and `src/generated/**`.
2. Launch Codex and let it know that new endpoints were added. Ask it to follow the checklist in `AGENTS.md` to update wrappers, docs, and tests.
3. Complete the build/version/publish steps:
   - `npm run build`
   - Update the package version as needed (`npm version <patch|minor|major>`).
   - Publish with `npm publish` when you're ready to release.
