#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.ts";
import { createSerphouseServer } from "./server.ts";

const config = loadConfig();
const server = createSerphouseServer(config);
const transport = new StdioServerTransport();

await server.connect(transport);

console.error(
  config.apiKey
    ? "Serphouse MCP server running on stdio with configured Serphouse API key."
    : "Serphouse MCP server running on stdio. Set SERPHOUSE_API_KEY or SERPHOUSE_API_TOKEN.",
);
