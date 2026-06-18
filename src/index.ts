#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getServerConfig } from "./config.ts";
import { createSerphouseServer } from "./server.ts";

const apiKey =
  process.env.SERPHOUSE_API_KEY?.trim() ||
  process.env.SERPHOUSE_API_TOKEN?.trim() ||
  "";
const server = createSerphouseServer({ ...getServerConfig(), apiKey });
const transport = new StdioServerTransport();

await server.connect(transport);

console.error(
  apiKey
    ? "Serphouse MCP server running on stdio with configured Serphouse API key."
    : "Serphouse MCP server running on stdio. Pass SERPHOUSE_API_KEY via inspector -e for tool calls.",
);
