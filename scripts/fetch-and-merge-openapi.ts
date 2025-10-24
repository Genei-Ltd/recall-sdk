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

const ENDPOINT_SLUGS = [
  'bot_list',
  'bot_create',
  'bot_retrieve',
  'bot_partial_update',
  'bot_destroy',
  'bot_delete_media_create',
  'bot_leave_call_create',
  'calendar_events_list',
  'calendar_events_retrieve',
  'calendar_events_bot_create',
  'calendar_events_bot_destroy',
  'calendars_list',
  'calendars_create',
  'calendars_retrieve',
  'calendars_access_token_create',
  'calendars_partial_update',
  'calendars_destroy',
  'recording_list',
  'recording_retrieve',
  'recording_destroy',
  'recording_create_transcript_create',
  'transcript_list',
  'transcript_retrieve',
  'transcript_partial_update',
  'transcript_destroy',
  'audio_mixed_list',
  'audio_mixed_retrieve',
  'audio_mixed_partial_update',
  'audio_mixed_destroy',
  'audio_separate_list',
  'audio_separate_retrieve',
  'audio_separate_partial_update',
  'audio_separate_destroy',
  'video_mixed_list',
  'video_mixed_retrieve',
  'video_mixed_partial_update',
  'video_mixed_destroy',
  'video_separate_list',
  'video_separate_retrieve',
  'video_separate_partial_update',
  'video_separate_destroy',
]

const ENDPOINTS: EndpointConfig[] = ENDPOINT_SLUGS.map((slug) => ({
  slug,
  url: `https://docs.recall.ai/recallai/api-next/v2/branches/1.11/reference/${slug}?dereference=false&reduce=true`,
}))

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
const MEETING_URL_SCHEMA_REF = '#/components/schemas/MeetingUrl'

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
// Rewrite those helpers into the standard `nullable: true` form so the merged
// schema stays valid OpenAPI and downstream tooling doesn't need to special-case
// Recall-specific constructs.
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

function applyMeetingUrlPatch(document: OpenAPIDocument): void {
  const components = (document.components ??= {})
  const schemas = (components.schemas ??= {})

  const meetingUrlVariants: Record<string, unknown>[] = [
    {
      description: 'Zoom meeting URL metadata.',
      type: 'object',
      required: ['meeting_id', 'platform'],
      properties: {
        meeting_id: {
          type: 'string',
          description: 'Zoom meeting ID extracted from the meeting URL.',
        },
        meeting_password: {
          type: 'string',
          nullable: true,
          description:
            'Zoom meeting password component, if the meeting URL includes one.',
        },
        platform: {
          type: 'string',
          enum: ['zoom'],
          description: 'Constant identifier for Zoom meetings.',
        },
      },
      additionalProperties: false,
    },
    {
      description: 'Google Meet meeting URL metadata.',
      type: 'object',
      required: ['meeting_id', 'platform'],
      properties: {
        meeting_id: {
          type: 'string',
          description: 'Google Meet meeting ID.',
        },
        platform: {
          type: 'string',
          enum: ['google_meet'],
          description: 'Constant identifier for Google Meet meetings.',
        },
      },
      additionalProperties: false,
    },
    {
      description: 'Microsoft Teams meeting URL metadata.',
      type: 'object',
      required: [
        'meeting_id',
        'meeting_password',
        'organizer_id',
        'tenant_id',
        'message_id',
        'thread_id',
        'business_meeting_id',
        'business_meeting_password',
        'platform',
      ],
      properties: {
        meeting_id: {
          type: 'string',
          nullable: true,
          description:
            'Teams meeting identifier. Certain Teams variants do not supply this field.',
        },
        meeting_password: {
          type: 'string',
          nullable: true,
          description: 'Meeting password if included in the Teams URL.',
        },
        organizer_id: {
          type: 'string',
          nullable: true,
          description: 'Organizer identifier embedded in the Teams URL.',
        },
        tenant_id: {
          type: 'string',
          nullable: true,
          description: 'Tenant identifier embedded in the Teams URL.',
        },
        message_id: {
          type: 'string',
          nullable: true,
          description: 'Message identifier embedded in the Teams URL.',
        },
        thread_id: {
          type: 'string',
          nullable: true,
          description: 'Thread identifier embedded in the Teams URL.',
        },
        business_meeting_id: {
          type: 'string',
          nullable: true,
          description: 'Business meeting identifier for Teams for Business URLs.',
        },
        business_meeting_password: {
          type: 'string',
          nullable: true,
          description:
            'Business meeting password for Teams for Business URLs when present.',
        },
        platform: {
          type: 'string',
          enum: ['microsoft_teams', 'microsoft_teams_live'],
          description:
            'Distinguishes between Teams (business) and Teams Live meetings.',
        },
      },
      additionalProperties: false,
    },
    {
      description: 'Webex meeting URL metadata (standard room).',
      type: 'object',
      required: ['meeting_subdomain', 'meeting_mtid', 'meeting_path', 'platform'],
      properties: {
        meeting_subdomain: {
          type: 'string',
          description: 'Customer subdomain extracted from the Webex URL.',
        },
        meeting_mtid: {
          type: 'string',
          description: 'Webex meeting identifier (mtid).',
        },
        meeting_path: {
          type: 'string',
          description: 'Webex meeting resource path.',
        },
        platform: {
          type: 'string',
          enum: ['webex'],
          description: 'Constant identifier for Webex meetings.',
        },
      },
      additionalProperties: false,
    },
    {
      description: 'Webex meeting URL metadata (personal room).',
      type: 'object',
      required: ['meeting_subdomain', 'meeting_personal_room_id', 'platform'],
      properties: {
        meeting_subdomain: {
          type: 'string',
          description: 'Customer subdomain extracted from the Webex URL.',
        },
        meeting_personal_room_id: {
          type: 'string',
          description: 'Personal room identifier embedded in the Webex URL.',
        },
        platform: {
          type: 'string',
          enum: ['webex'],
          description: 'Constant identifier for Webex meetings.',
        },
      },
      additionalProperties: false,
    },
    {
      description: 'GoTo meeting URL metadata.',
      type: 'object',
      required: ['meeting_id', 'platform'],
      properties: {
        meeting_id: {
          type: 'string',
          description: 'GoTo meeting identifier.',
        },
        platform: {
          type: 'string',
          enum: ['goto_meeting'],
          description: 'Constant identifier for GoTo meetings.',
        },
      },
      additionalProperties: false,
    },
  ]

  schemas.MeetingUrl = {
    description:
      'Structured meeting URL metadata. The available fields depend on the meeting platform.',
    oneOf: meetingUrlVariants,
  }

  const targets = [
    {
      schemaName: 'Bot',
      readOnly: false,
      nullable: false,
      acceptsRawStringInput: true,
    },
    {
      schemaName: 'PatchedBot',
      readOnly: false,
      nullable: false,
      acceptsRawStringInput: true,
    },
  ] as const

  for (const target of targets) {
    const schema = schemas[target.schemaName]
    if (!isRecord(schema) || !('properties' in schema) || !isRecord(schema.properties)) {
      continue
    }

    const properties = schema.properties as Record<string, unknown>
    const property: Record<string, unknown> = {
      description:
        'Structured meeting URL metadata for the associated platform.',
    }

    if (target.acceptsRawStringInput) {
      property.oneOf = [
        {
          type: 'string',
          description:
            'Canonical meeting URL string accepted when scheduling or updating bots.',
          writeOnly: true,
        },
        {
          allOf: [{ $ref: MEETING_URL_SCHEMA_REF }],
          readOnly: true,
        },
      ]
    } else {
      property.$ref = MEETING_URL_SCHEMA_REF
    }

    if (target.readOnly) {
      property.readOnly = true
    }

    if (target.nullable) {
      property.nullable = true
    }

    properties.meeting_url = property
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
  applyMeetingUrlPatch(merged)
  await writeJsonFile(MERGED_SCHEMA_PATH, merged)
  console.log(`Merged schema written to ${MERGED_SCHEMA_PATH}`)
}

await main()
