import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./schemas/openapi.json",
  output: "./src/generated",
});
