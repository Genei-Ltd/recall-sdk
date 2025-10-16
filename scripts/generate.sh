#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "Fetching Recall API endpoint schemas and merging into a single OpenAPI document..."
bun run "${SCRIPT_DIR}/fetch-and-merge-openapi.ts"

echo
echo "Generating TypeScript client with OpenAPI-ts..."
bun openapi-ts

echo
echo "Done."
