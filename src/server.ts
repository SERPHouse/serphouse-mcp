import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { SerphouseConfig } from "./config.ts";
import { get, post } from "./api.ts";
import { capabilities, constraints, examples } from "./resources.ts";
import {
  emptyInputSchema,
  googleAdvancedInputSchema,
  googleAutocompleteInputSchema,
  googleForumsInputSchema,
  googleJobsInputSchema,
  googleLocalInputSchema,
  googleShortVideosInputSchema,
  googleVideosInputSchema,
  languageListInputSchema,
  locationSearchInputSchema,
  serpLiveInputSchema,
} from "./schemas.ts";
import { compact } from "./lib/utils.ts";

export function createSerphouseServer(config: SerphouseConfig): McpServer {
  const server = new McpServer({
    name: "serphouse-mcp",
    version: "0.1.1",
  });

  registerResources(server);
  registerTools(server, config);

  return server;
}

async function handle(call: () => Promise<unknown>): Promise<CallToolResult> {
  try {
    const data = await call();
    const text = JSON.stringify(data, null, 2);
    return { content: [{ type: "text", text }] };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        { type: "text", text: JSON.stringify({ error: message }, null, 2) },
      ],
      isError: true,
    };
  }
}

function registerTools(server: McpServer, config: SerphouseConfig): void {
  server.registerTool(
    "serphouse_domain_list",
    {
      title: "Serphouse Domain List",
      description:
        "Get supported Google, Bing, and Yahoo search domains from Serphouse.",
      inputSchema: emptyInputSchema,
    },
    async () => handle(() => get(config, "/domain/list")),
  );

  server.registerTool(
    "serphouse_language_list",
    {
      title: "Serphouse Language List",
      description: "Get supported language codes for google, bing, or yahoo.",
      inputSchema: languageListInputSchema,
    },
    async (args) => handle(() => get(config, `/language/list/${args.type}`)),
  );

  server.registerTool(
    "serphouse_location_search",
    {
      title: "Serphouse Location Search",
      description:
        "Search Serphouse location ids and location strings for Google or Bing targeting.",
      inputSchema: locationSearchInputSchema,
    },
    async (args) => handle(() => get(config, "/location/search", args)),
  );

  server.registerTool(
    "serphouse_account_info",
    {
      title: "Serphouse Account Info",
      description: "Get Serphouse account plan and credit usage.",
      inputSchema: emptyInputSchema,
    },
    async () => handle(() => get(config, "/account/info")),
  );

  server.registerTool(
    "serphouse_serp_live",
    {
      title: "Serphouse Live SERP",
      description:
        "Run a realtime SERP query using the documented POST /serp/live endpoint.",
      inputSchema: serpLiveInputSchema,
    },
    async (args) => handle(() => post(config, "/serp/live", compact(args))),
  );

  server.registerTool(
    "serphouse_serp_live_get",
    {
      title: "Serphouse Live SERP GET",
      description:
        "Run a realtime SERP query using the documented GET /serp/live endpoint.",
      inputSchema: serpLiveInputSchema,
    },
    async (args) => handle(() => get(config, "/serp/live", compact(args))),
  );

  server.registerTool(
    "serphouse_serp_google_advanced",
    {
      title: "Serphouse Google Advanced SERP",
      description:
        "Fetch up to 100 Google results using max_pages from 1 to 10.",
      inputSchema: googleAdvancedInputSchema,
    },
    async (args) =>
      handle(() => post(config, "/serp/google_advanced", compact(args))),
  );

  server.registerTool(
    "serphouse_google_jobs",
    {
      title: "Serphouse Google Jobs",
      description: "Run a realtime Google Jobs search.",
      inputSchema: googleJobsInputSchema,
    },
    async (args) =>
      handle(() => post(config, "/google-jobs-api", compact(args))),
  );

  server.registerTool(
    "serphouse_google_autocomplete",
    {
      title: "Serphouse Google Autocomplete",
      description: "Get realtime localized Google autocomplete suggestions.",
      inputSchema: googleAutocompleteInputSchema,
    },
    async (args) =>
      handle(() => post(config, "/google-autocomplete-api", compact(args))),
  );

  server.registerTool(
    "serphouse_google_videos",
    {
      title: "Serphouse Google Videos",
      description:
        "Run a realtime Google Videos search with optional video filters.",
      inputSchema: googleVideosInputSchema,
    },
    async (args) =>
      handle(() => post(config, "/google-videos-api", compact(args))),
  );

  server.registerTool(
    "serphouse_google_short_videos",
    {
      title: "Serphouse Google Short Videos",
      description: "Run a realtime Google Short Videos search.",
      inputSchema: googleShortVideosInputSchema,
    },
    async (args) =>
      handle(() => post(config, "/google-short-videos-api", compact(args))),
  );

  server.registerTool(
    "serphouse_google_forums",
    {
      title: "Serphouse Google Forums",
      description:
        "Run a realtime Google Forums search for discussions and community results.",
      inputSchema: googleForumsInputSchema,
    },
    async (args) =>
      handle(() => post(config, "/google-forums-api", compact(args))),
  );

  server.registerTool(
    "serphouse_google_local",
    {
      title: "Serphouse Google Local",
      description:
        "Run a realtime Google Local search for local business results.",
      inputSchema: googleLocalInputSchema,
    },
    async (args) =>
      handle(() => post(config, "/google-local-api", compact(args))),
  );
}

function registerResources(server: McpServer): void {
  registerJsonResource(
    server,
    "serphouse_capabilities",
    "resource://serphouse/capabilities",
    capabilities,
  );
  registerJsonResource(
    server,
    "serphouse_constraints",
    "resource://serphouse/constraints",
    constraints,
  );
  registerJsonResource(
    server,
    "serphouse_examples",
    "resource://serphouse/examples",
    examples,
  );
}

function registerJsonResource(
  server: McpServer,
  name: string,
  uri: string,
  data: unknown,
): void {
  server.registerResource(
    name,
    uri,
    {
      title: name.replaceAll("_", " "),
      mimeType: "application/json",
    },
    async () => ({
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2),
        },
      ],
    }),
  );
}
