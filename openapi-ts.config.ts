import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './schemas/openapi.json',
  output: './src/generated',
  plugins: [
    '@hey-api/typescript',
    {
      name: '@hey-api/client-fetch',
    },
    {
      classStructure: 'off',
      client: '@hey-api/client-fetch',
      instance: 'GeneratedRecallSdk',
      name: '@hey-api/sdk',
    },
  ],
})
