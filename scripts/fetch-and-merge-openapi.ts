import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

type EndpointSlug = string

type EndpointConfig = {
  slug: EndpointSlug
  url: string
}

type EndpointDocument = {
  data?: {
    api?: {
      schema?: OpenAPIDocument
    }
  }
}

type OpenAPIDocument = {
  openapi: string
  info?: Record<string, unknown>
  paths?: Record<string, PathItemObject>
  components?: ComponentsObject
  [key: string]: unknown
}

type PathItemObject = Record<string, unknown>

type ComponentsObject = {
  schemas?: Record<string, unknown>
  responses?: Record<string, unknown>
  parameters?: Record<string, unknown>
  examples?: Record<string, unknown>
  requestBodies?: Record<string, unknown>
  headers?: Record<string, unknown>
  securitySchemes?: Record<string, unknown>
  links?: Record<string, unknown>
  callbacks?: Record<string, unknown>
  pathItems?: Record<string, unknown>
  [segment: string]: Record<string, unknown> | undefined
}

const ENDPOINTS: EndpointConfig[] = [
  {
    slug: 'bot_create',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/bot_create?dereference=false&reduce=true',
  },
  {
    slug: 'bot_retrieve',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/bot_retrieve?dereference=false&reduce=true',
  },
  {
    slug: 'calendar_events_list',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/calendar_events_list?dereference=false&reduce=true',
  },
  {
    slug: 'calendar_events_retrieve',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/calendar_events_retrieve?dereference=false&reduce=true',
  },
  {
    slug: 'calendar_events_bot_create',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/calendar_events_bot_create?dereference=false&reduce=true',
  },
  {
    slug: 'calendar_events_bot_destroy',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/calendar_events_bot_destroy?dereference=false&reduce=true',
  },
  {
    slug: 'calendars_list',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/calendars_list?dereference=false&reduce=true',
  },
  {
    slug: 'calendars_create',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/calendars_create?dereference=false&reduce=true',
  },
  {
    slug: 'calendars_retrieve',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/calendars_retrieve?dereference=false&reduce=true',
  },
  {
    slug: 'calendars_access_token_create',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/calendars_access_token_create?dereference=false&reduce=true',
  },
  {
    slug: 'calendars_partial_update',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/calendars_partial_update?dereference=false&reduce=true',
  },
  {
    slug: 'calendars_destroy',
    url: 'https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/calendars_destroy?dereference=false&reduce=true',
  },
]

const OUTPUT_DIR = resolve('schemas')
const MERGED_SCHEMA_PATH = resolve(OUTPUT_DIR, 'openapi.json')

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys)
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(
      ([left], [right]) => left.localeCompare(right),
    )
    return entries.reduce<Record<string, unknown>>(
      (accumulator, [key, entryValue]) => {
        accumulator[key] = sortKeys(entryValue)
        return accumulator
      },
      {},
    )
  }

  return value
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assertEqual<T>(
  left: T | undefined,
  right: T | undefined,
  context: string,
): void {
  if (left === undefined && right === undefined) {
    return
  }

  if (stableStringify(left) !== stableStringify(right)) {
    throw new Error(`Conflicting values encountered while merging: ${context}`)
  }
}

// Merge path definitions per HTTP method so multiple endpoint specs can safely
// contribute operations under the same route.
function mergePathItems(
  target: Record<string, PathItemObject>,
  source: Record<string, PathItemObject>,
): void {
  for (const [path, item] of Object.entries(source)) {
    if (!(path in target)) {
      target[path] = item
      continue
    }

    const targetItem = target[path]!
    for (const [key, value] of Object.entries(item)) {
      if (!(key in targetItem)) {
        targetItem[key] = value
        continue
      }

      assertEqual(targetItem[key], value, `paths["${path}"]["${key}"]`)
    }
  }
}

function mergeComponentSection(
  target: Record<string, unknown> | undefined,
  source: Record<string, unknown> | undefined,
  sectionName: string,
): Record<string, unknown> | undefined {
  if (!source) {
    return target
  }

  if (!target) {
    target = {}
  }

  for (const [key, value] of Object.entries(source)) {
    if (!(key in target)) {
      target[key] = value
      continue
    }

    assertEqual(target[key], value, `components.${sectionName}["${key}"]`)
  }

  return target
}

function mergeComponents(
  target: ComponentsObject | undefined,
  source: ComponentsObject | undefined,
): ComponentsObject | undefined {
  if (!source) {
    return target
  }

  if (!target) {
    target = {}
  }

  const sectionNames = new Set([
    ...Object.keys(source),
    ...Object.keys(target),
  ]) as Set<keyof ComponentsObject>

  for (const section of sectionNames) {
    const mergedSection = mergeComponentSection(
      target[section],
      source[section],
      typeof section === 'string' ? section : String(section),
    )
    if (mergedSection) {
      target[section] = mergedSection
    }
  }

  return target
}

function mergeDocuments(documents: OpenAPIDocument[]): OpenAPIDocument {
  if (documents.length === 0) {
    throw new Error('No documents to merge.')
  }

  const [first, ...rest] = documents
  const merged = JSON.parse(JSON.stringify(first)) as unknown as OpenAPIDocument

  for (const document of rest) {
    if (document.openapi !== merged.openapi) {
      throw new Error(
        `Mismatched OpenAPI versions: ${document.openapi} vs ${merged.openapi}`,
      )
    }

    assertEqual(merged.info, document.info, 'info')

    if (document.paths) {
      merged.paths ??= {}
      mergePathItems(merged.paths, document.paths)
    }

    merged.components = mergeComponents(merged.components, document.components)
  }

  return merged
}

const NULL_ENUM_REF = '#/components/schemas/NullEnum'

function isNullEnumReference(value: unknown): boolean {
  if (isRecord(value)) {
    if ('$ref' in value) {
      return value.$ref === NULL_ENUM_REF
    }
    if ('enum' in value && Array.isArray(value.enum)) {
      return value.enum.length === 1 && value.enum[0] === null
    }
    if ('type' in value) {
      return value.type === 'null'
    }
  }
  return false
}

function removeNullEnumFromArray(array: unknown[]): {
  filtered: unknown[]
  removed: boolean
} {
  let removed = false
  const filtered = array.filter((item) => {
    const isNullEnum = isNullEnumReference(item)
    removed ||= isNullEnum
    return !isNullEnum
  })
  return { filtered, removed }
}

// Recall's OpenAPI snippets model nullability via a `NullEnum` reference.
// Collapse those constructs into the standard `nullable: true` form so client
// generators avoid emitting duplicate null helper types.
function normalizeNullEnumValues(value: unknown): boolean {
  let removedReference = false

  if (Array.isArray(value)) {
    for (const item of value) {
      removedReference ||= normalizeNullEnumValues(item)
    }
    return removedReference
  }

  if (!isRecord(value)) {
    return removedReference
  }

  const nullableCollections = ['oneOf', 'anyOf', 'allOf'] as const

  for (const key of nullableCollections) {
    const entry = value[key]
    if (!Array.isArray(entry)) {
      continue
    }

    const { filtered, removed } = removeNullEnumFromArray(entry)
    if (!removed) {
      continue
    }

    removedReference = true

    if (!('nullable' in value)) {
      value.nullable = true
    }

    if (filtered.length === 0) {
      delete value[key]
      continue
    }

    if (
      key === 'oneOf' &&
      filtered.length === 1 &&
      isRecord(filtered[0]) &&
      '$ref' in filtered[0] &&
      typeof filtered[0].$ref === 'string' &&
      !('$ref' in value)
    ) {
      value.$ref = filtered[0].$ref
      delete value.oneOf
      continue
    }

    value[key] = filtered
  }

  for (const item of Object.values(value)) {
    removedReference ||= normalizeNullEnumValues(item)
  }

  return removedReference
}

function removeNullEnumSchema(document: OpenAPIDocument): void {
  const schemas = document.components?.schemas
  if (!schemas || !('NullEnum' in schemas)) {
    return
  }

  delete schemas.NullEnum

  if (Object.keys(schemas).length === 0) {
    delete document.components?.schemas
  }
}

async function fetchEndpointPayload(
  config: EndpointConfig,
): Promise<EndpointDocument> {
  const response = await fetch(config.url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${config.slug}: ${response.status} ${response.statusText}`,
    )
  }

  return response.json() as Promise<EndpointDocument>
}

async function writeJsonFile(path: string, data: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(data)}\n`)
}

async function main(): Promise<void> {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const schemas = await Promise.all(
    ENDPOINTS.map(async (endpoint) => {
      const payload = await fetchEndpointPayload(endpoint)
      await writeJsonFile(resolve(OUTPUT_DIR, `${endpoint.slug}.json`), payload)

      const schema = payload.data?.api?.schema
      if (!schema) {
        throw new Error(`Missing schema for ${endpoint.slug}`)
      }

      return schema
    }),
  )

  const merged = mergeDocuments(schemas)
  const nullEnumRemoved = normalizeNullEnumValues(merged)
  if (nullEnumRemoved) {
    removeNullEnumSchema(merged)
  }
  await writeJsonFile(MERGED_SCHEMA_PATH, merged)
  console.log(`Merged schema written to ${MERGED_SCHEMA_PATH}`)
}

await main()
