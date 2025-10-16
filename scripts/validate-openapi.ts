import SwaggerParser from '@apidevtools/swagger-parser'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

type EndpointDocument = {
  data?: {
    api?: {
      schema?: unknown
    }
  }
}

async function loadSchema(filePath: string): Promise<unknown> {
  const absolutePath = resolve(filePath)
  const raw = await readFile(absolutePath, 'utf-8')
  const parsed: EndpointDocument = JSON.parse(raw)

  if (typeof (parsed as { openapi?: unknown }).openapi === 'string') {
    return parsed
  }

  const schema = parsed.data?.api?.schema
  if (!schema) {
    throw new Error(
      `Could not find OpenAPI schema at data.api.schema in ${absolutePath}`,
    )
  }

  return schema
}

async function validateSchema(filePath: string): Promise<void> {
  const schema = await loadSchema(filePath)
  await SwaggerParser.validate(schema as any)
  console.log(`${filePath}: valid OpenAPI schema`)
}

async function main(): Promise<void> {
  const targets = process.argv.slice(2)

  if (targets.length === 0) {
    console.error('Usage: bun run scripts/validate-openapi.ts <file> [...]')
    process.exitCode = 1
    return
  }

  const results = await Promise.allSettled(
    targets.map(async (target) => {
      await validateSchema(target)
      return target
    }),
  )

  let failures = 0
  for (const result of results) {
    if (result.status === 'rejected') {
      failures += 1
      console.error(
        result.reason instanceof Error ? result.reason.message : result.reason,
      )
    }
  }

  if (failures > 0) {
    process.exitCode = 1
  }
}

void main()
