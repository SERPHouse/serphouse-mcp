import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { HttpStatus, Messages } from "../constants.ts";
import type { SerphouseConfig } from "../config.ts";
import { createSerphouseServer } from "../server.ts";
import { errorForLog, jsonRpcError } from "./utils.ts";

const MAX_API_KEY_LENGTH = 2_048;

type HttpRequest = {
  headers?: {
    serphouse_api?: string | string[];
  };
  body?: unknown;
};

type HttpResponse = {
  headersSent: boolean;
  status(code: number): HttpResponse;
  json(body: unknown): HttpResponse;
  on(event: "close", listener: () => void): HttpResponse;
};

type HandleRequestArgs = Parameters<StreamableHTTPServerTransport["handleRequest"]>;

export async function handleMcpPostRequest(
  baseConfig: SerphouseConfig,
  req: HttpRequest,
  res: HttpResponse,
): Promise<void> {
  const apiKey = extractApiKey(baseConfig, req);

  if (!apiKey) {
    res.status(HttpStatus.BAD_REQUEST).json(jsonRpcError(Messages.MISSING_API_KEY_IN_PATH, null));
    return;
  }

  if (!isValidApiKey(apiKey)) {
    res.status(HttpStatus.BAD_REQUEST).json(jsonRpcError(Messages.INVALID_API_KEY, null));
    return;
  }

  const server = createSerphouseServer({ ...baseConfig, apiKey });
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  res.on("close", () => {
    void transport.close();
    void server.close();
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(
      req as unknown as HandleRequestArgs[0],
      res as unknown as HandleRequestArgs[1],
      req.body,
    );
  } catch (error) {
    console.error("Error handling MCP request:", errorForLog(error));
    if (!res.headersSent) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(jsonRpcError(Messages.INTERNAL_SERVER_ERROR, null));
    }
  }
}

function extractApiKey(baseConfig: SerphouseConfig, req: HttpRequest): string | undefined {
  const serphouseApiKey = firstHeader(req.headers?.serphouse_api)?.trim();

  return serphouseApiKey;
}

function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isValidApiKey(apiKey: string): boolean {
  return apiKey.length > 0 && apiKey.length <= MAX_API_KEY_LENGTH && !/[\r\n\t]/.test(apiKey);
}
