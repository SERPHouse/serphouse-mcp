import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { SerphouseConfig } from "./config.ts";
import { createSerphouseClient, type SerphouseClient } from "./client.ts";
import { capabilities, constraints, examples } from "./resources.ts";
import {
  emptyInputSchema,
  googleAdvancedInputSchema,
  googleAdvancedScheduledInputSchema,
  googleAutocompleteInputSchema,
  googleForumsInputSchema,
  googleJobsInputSchema,
  googleLocalInputSchema,
  googleShortVideosInputSchema,
  googleVideosInputSchema,
  idInputSchema,
  languageListInputSchema,
  locationSearchInputSchema,
  scheduleAndWaitInputSchema,
  scheduleSerpInputSchema,
  serpLiveInputSchema,
} from "./schemas.ts";
import { ErrorCode, Messages } from "./constants.ts";
import {
  errorToBody,
  extractTaskId,
  isCompletedStatus,
  runSerphouseTool,
  toolError,
  toolSuccess,
  upstreamErrorBody,
} from "./lib/tool-response.ts";
import { compact, redactSecrets, sleep } from "./lib/utils.ts";

/**
 * Create the MCP server and register every Serphouse tool.
 *
 * Request flow for a tool call:
 *   1. MCP client invokes a tool (e.g. serphouse_serp_live).
 *   2. Zod validates the input against the tool schema.
 *   3. The handler calls SerphouseClient (GET or POST).
 *   4. runSerphouseTool formats the API response as an MCP result.
 */
export function createSerphouseServer(config: SerphouseConfig): McpServer {
  const server = new McpServer({
    name: "serphouse-mcp",
    version: "0.1.0",
  });

  const client = createSerphouseClient(config);

  registerResources(server);
  registerTools(server, client);

  return server;
}

function registerTools(server: McpServer, client: SerphouseClient): void {
  server.registerTool(
    "serphouse_domain_list",
    {
      title: "Serphouse Domain List",
      description: "Get supported Google, Bing, and Yahoo search domains from Serphouse.",
      inputSchema: emptyInputSchema,
    },
    async () => runSerphouseTool("GET /domain/list", () => client.get("/domain/list")),
  );

  server.registerTool(
    "serphouse_language_list",
    {
      title: "Serphouse Language List",
      description: "Get supported language codes for google, bing, or yahoo.",
      inputSchema: languageListInputSchema,
    },
    async (args) => runSerphouseTool(`GET /language/list/${args.type}`, () => client.get(`/language/list/${args.type}`)),
  );

  server.registerTool(
    "serphouse_location_search",
    {
      title: "Serphouse Location Search",
      description: "Search Serphouse location ids and location strings for Google or Bing targeting.",
      inputSchema: locationSearchInputSchema,
    },
    async (args) => runSerphouseTool("GET /location/search", () => client.get("/location/search", args)),
  );

  server.registerTool(
    "serphouse_account_info",
    {
      title: "Serphouse Account Info",
      description: "Get Serphouse account plan and credit usage. Secret fields are redacted.",
      inputSchema: emptyInputSchema,
    },
    async () => runSerphouseTool("GET /account/info", () => client.get("/account/info")),
  );

  server.registerTool(
    "serphouse_serp_live",
    {
      title: "Serphouse Live SERP",
      description: "Run a realtime SERP query using the documented POST /serp/live endpoint.",
      inputSchema: serpLiveInputSchema,
    },
    async (args) => runSerphouseTool("POST /serp/live", () => client.postData("/serp/live", compact(args))),
  );

  server.registerTool(
    "serphouse_serp_live_get",
    {
      title: "Serphouse Live SERP GET",
      description: "Run a realtime SERP query using the documented GET /serp/live endpoint.",
      inputSchema: serpLiveInputSchema,
    },
    async (args) => runSerphouseTool("GET /serp/live", () => client.get("/serp/live", compact(args))),
  );

  server.registerTool(
    "serphouse_serp_schedule",
    {
      title: "Serphouse Schedule SERP",
      description: "Schedule one or more SERP tasks. The MCP input is tasks; the client sends Serphouse { data: tasks }.",
      inputSchema: scheduleSerpInputSchema,
    },
    async (args) => runSerphouseTool("POST /serp/schedule", () => client.postData("/serp/schedule", compact(args.tasks))),
  );

  server.registerTool(
    "serphouse_serp_google_advanced",
    {
      title: "Serphouse Google Advanced SERP",
      description: "Fetch up to 100 Google results using max_pages from 1 to 10.",
      inputSchema: googleAdvancedInputSchema,
    },
    async (args) => runSerphouseTool("POST /serp/google_advanced", () => client.postData("/serp/google_advanced", compact(args))),
  );

  server.registerTool(
    "serphouse_serp_google_advanced_scheduled",
    {
      title: "Serphouse Google Advanced Scheduled SERP",
      description: "Schedule Google advanced SERP tasks with max_pages from 1 to 10.",
      inputSchema: googleAdvancedScheduledInputSchema,
    },
    async (args) =>
      runSerphouseTool("POST /serp/google_advanced_scheduled", () =>
        client.postData("/serp/google_advanced_scheduled", compact(args.tasks)),
      ),
  );

  server.registerTool(
    "serphouse_task_check",
    {
      title: "Serphouse Task Check",
      description: "Check the status of a scheduled SERP task.",
      inputSchema: idInputSchema,
    },
    async (args) => runSerphouseTool("GET /serp/check", () => client.get("/serp/check", args)),
  );

  server.registerTool(
    "serphouse_task_get",
    {
      title: "Serphouse Task Get",
      description: "Fetch the result for a completed scheduled SERP task.",
      inputSchema: idInputSchema,
    },
    async (args) => runSerphouseTool("GET /serp/get", () => client.get("/serp/get", args)),
  );

  server.registerTool(
    "serphouse_schedule_and_wait",
    {
      title: "Serphouse Schedule And Wait",
      description: "Schedule one SERP task, poll until completion, then fetch the final result.",
      inputSchema: scheduleAndWaitInputSchema,
    },
    async (args) => runScheduleAndWait(client, args),
  );

  server.registerTool(
    "serphouse_google_jobs",
    {
      title: "Serphouse Google Jobs",
      description: "Run a realtime Google Jobs search.",
      inputSchema: googleJobsInputSchema,
    },
    async (args) => runSerphouseTool("POST /google-jobs-api", () => client.postData("/google-jobs-api", compact(args))),
  );

  server.registerTool(
    "serphouse_google_autocomplete",
    {
      title: "Serphouse Google Autocomplete",
      description: "Get realtime localized Google autocomplete suggestions.",
      inputSchema: googleAutocompleteInputSchema,
    },
    async (args) => runSerphouseTool("POST /google-autocomplete-api", () => client.postData("/google-autocomplete-api", compact(args))),
  );

  server.registerTool(
    "serphouse_google_videos",
    {
      title: "Serphouse Google Videos",
      description: "Run a realtime Google Videos search with optional video filters.",
      inputSchema: googleVideosInputSchema,
    },
    async (args) => runSerphouseTool("POST /google-videos-api", () => client.postData("/google-videos-api", compact(args))),
  );

  server.registerTool(
    "serphouse_google_short_videos",
    {
      title: "Serphouse Google Short Videos",
      description: "Run a realtime Google Short Videos search.",
      inputSchema: googleShortVideosInputSchema,
    },
    async (args) => runSerphouseTool("POST /google-short-videos-api", () => client.postData("/google-short-videos-api", compact(args))),
  );

  server.registerTool(
    "serphouse_google_forums",
    {
      title: "Serphouse Google Forums",
      description: "Run a realtime Google Forums search for discussions and community results.",
      inputSchema: googleForumsInputSchema,
    },
    async (args) => runSerphouseTool("POST /google-forums-api", () => client.postData("/google-forums-api", compact(args))),
  );

  server.registerTool(
    "serphouse_google_local",
    {
      title: "Serphouse Google Local",
      description: "Run a realtime Google Local search for local business results.",
      inputSchema: googleLocalInputSchema,
    },
    async (args) => runSerphouseTool("POST /google-local-api", () => client.postData("/google-local-api", compact(args))),
  );
}

function registerResources(server: McpServer): void {
  registerJsonResource(server, "serphouse_capabilities", "resource://serphouse/capabilities", capabilities);
  registerJsonResource(server, "serphouse_constraints", "resource://serphouse/constraints", constraints);
  registerJsonResource(server, "serphouse_examples", "resource://serphouse/examples", examples);
}

function registerJsonResource(server: McpServer, name: string, uri: string, data: unknown): void {
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

/** Composite tool: schedule → poll /serp/check → fetch /serp/get when complete. */
async function runScheduleAndWait(
  client: SerphouseClient,
  args: {
    task: Record<string, unknown>;
    poll_interval_ms: number;
    max_wait_ms: number;
  },
): Promise<CallToolResult> {
  const startedAt = Date.now();
  const statusChecks: unknown[] = [];

  try {
    const schedule = await client.postData("/serp/schedule", [compact(args.task)]);
    const scheduleError = upstreamErrorBody("POST /serp/schedule", schedule);
    if (scheduleError) {
      return toolError(scheduleError);
    }

    const taskId = extractTaskId(schedule);
    if (!taskId) {
      return toolSuccess({
        endpoint: "POST /serp/schedule",
        warning: Messages.SCHEDULE_NO_TASK_ID,
        schedule: redactSecrets(schedule),
      });
    }

    while (Date.now() - startedAt <= args.max_wait_ms) {
      const status = await client.get("/serp/check", { id: taskId });
      statusChecks.push(redactSecrets(status));

      const statusError = upstreamErrorBody("GET /serp/check", status);
      if (statusError) {
        return toolError(statusError);
      }

      if (isCompletedStatus(status)) {
        const result = await client.get("/serp/get", { id: taskId });
        const resultError = upstreamErrorBody("GET /serp/get", result);
        if (resultError) {
          return toolError(resultError);
        }

        return toolSuccess({
          task_id: taskId,
          elapsed_ms: Date.now() - startedAt,
          schedule: redactSecrets(schedule),
          status_checks: statusChecks,
          result: redactSecrets(result),
        });
      }

      await sleep(args.poll_interval_ms);
    }

    return toolError({
      ok: false,
      code: ErrorCode.TIMEOUT,
      message: Messages.timeoutWaitingForTask(taskId),
      details: {
        task_id: taskId,
        elapsed_ms: Date.now() - startedAt,
        status_checks: statusChecks,
      },
    });
  } catch (error) {
    return toolError(errorToBody("serphouse_schedule_and_wait", error));
  }
}
