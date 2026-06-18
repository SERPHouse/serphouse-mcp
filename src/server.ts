import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { SerphouseConfig } from "./config.ts";
import { get, post } from "./api.ts";
import { examples, guide } from "./resources.ts";
import {
  bingImageSearchInputSchema,
  bingNewsSearchInputSchema,
  bingWebSearchInputSchema,
  emptyInputSchema,
  googleAdvancedInputSchema,
  googleAutocompleteInputSchema,
  googleForumsInputSchema,
  googleImageSearchInputSchema,
  googleJobsInputSchema,
  googleLocalInputSchema,
  googleNewsSearchInputSchema,
  googleShopSearchInputSchema,
  googleShortVideosInputSchema,
  googleVideosInputSchema,
  googleWebSearchInputSchema,
  languageListInputSchema,
  locationSearchInputSchema,
  yahooImageSearchInputSchema,
  yahooNewsSearchInputSchema,
  yahooWebSearchInputSchema,
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
        "List supported search domains. Call this before Yahoo searches — yahoo.com is not valid; use regional domains like uk.yahoo.com from this list.",
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
    "serphouse_google_web",
    {
      title: "Serphouse Google Web Search",
      description: "Run a realtime Google web search via POST /google-web.",
      inputSchema: googleWebSearchInputSchema,
    },
    async (args) => handle(() => post(config, "/google-web", compact(args))),
  );

  server.registerTool(
    "serphouse_google_image",
    {
      title: "Serphouse Google Image Search",
      description:
        "Run a realtime Google image search via POST /google-image.",
      inputSchema: googleImageSearchInputSchema,
    },
    async (args) => handle(() => post(config, "/google-image", compact(args))),
  );

  server.registerTool(
    "serphouse_google_news",
    {
      title: "Serphouse Google News Search",
      description: "Run a realtime Google news search via POST /google-news.",
      inputSchema: googleNewsSearchInputSchema,
    },
    async (args) => handle(() => post(config, "/google-news", compact(args))),
  );

  server.registerTool(
    "serphouse_google_shop",
    {
      title: "Serphouse Google Shop Search",
      description:
        "Run a realtime Google shopping search via POST /google-shop.",
      inputSchema: googleShopSearchInputSchema,
    },
    async (args) => handle(() => post(config, "/google-shop", compact(args))),
  );

  server.registerTool(
    "serphouse_bing_web",
    {
      title: "Serphouse Bing Web Search",
      description: "Run a realtime Bing web search via POST /bing-web.",
      inputSchema: bingWebSearchInputSchema,
    },
    async (args) => handle(() => post(config, "/bing-web", compact(args))),
  );

  server.registerTool(
    "serphouse_bing_image",
    {
      title: "Serphouse Bing Image Search",
      description: "Run a realtime Bing image search via POST /bing-image.",
      inputSchema: bingImageSearchInputSchema,
    },
    async (args) => handle(() => post(config, "/bing-image", compact(args))),
  );

  server.registerTool(
    "serphouse_bing_news",
    {
      title: "Serphouse Bing News Search",
      description: "Run a realtime Bing news search via POST /bing-news.",
      inputSchema: bingNewsSearchInputSchema,
    },
    async (args) => handle(() => post(config, "/bing-news", compact(args))),
  );

  server.registerTool(
    "serphouse_yahoo_web",
    {
      title: "Serphouse Yahoo Web Search",
      description: "Run a realtime Yahoo web search via POST /yahoo-web.",
      inputSchema: yahooWebSearchInputSchema,
    },
    async (args) => handle(() => post(config, "/yahoo-web", compact(args))),
  );

  server.registerTool(
    "serphouse_yahoo_image",
    {
      title: "Serphouse Yahoo Image Search",
      description:
        "Run a realtime Yahoo image search via POST /yahoo-image.",
      inputSchema: yahooImageSearchInputSchema,
    },
    async (args) => handle(() => post(config, "/yahoo-image", compact(args))),
  );

  server.registerTool(
    "serphouse_yahoo_news",
    {
      title: "Serphouse Yahoo News Search",
      description: "Run a realtime Yahoo news search via POST /yahoo-news.",
      inputSchema: yahooNewsSearchInputSchema,
    },
    async (args) => handle(() => post(config, "/yahoo-news", compact(args))),
  );

  server.registerTool(
    "serphouse_serp_google_advanced",
    {
      title: "Serphouse Google Advanced SERP",
      description:
        "SEO ranking checks: fetch up to 100 Google results in one request. Use max_pages 1–10 (~10 results per page). Prefer this over serphouse_google_web when the user needs rank position beyond the top 10.",
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
    "serphouse_guide",
    "resource://serphouse/guide",
    guide,
    "Tool catalog, routing, location, and domain rules (compact).",
  );
  registerJsonResource(
    server,
    "serphouse_examples",
    "resource://serphouse/examples",
    examples,
    "Minimal example payloads per engine.",
  );
}

function registerJsonResource(
  server: McpServer,
  name: string,
  uri: string,
  data: unknown,
  description?: string,
): void {
  server.registerResource(
    name,
    uri,
    {
      title: name.replaceAll("_", " "),
      description,
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
