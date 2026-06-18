import type { Server } from "node:http";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { HttpStatus, Messages, ServiceInfo } from "./constants.ts";
import { getServerConfig } from "./config.ts";
import { handleMcpPostRequest } from "./lib/mcp-http-handler.ts";
import { jsonRpcError } from "./lib/utils.ts";

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

const config = getServerConfig();
const port = getPort();
const host = process.env.HOST ?? "0.0.0.0";
const app = createMcpExpressApp({ host });

app.get("/health", (_req: HttpRequest, res: HttpResponse) => {
  res.status(HttpStatus.OK).json({ ok: true, name: ServiceInfo.NAME });
});

app.post("/mcp", (req: HttpRequest, res: HttpResponse) =>
  handleMcpPostRequest(config, req, res),
);
app.get("/mcp", missingApiKey);
app.delete("/mcp", missingApiKey);

const listener = app.listen(port, () => {
  console.log(
    `Serphouse MCP HTTP server listening on http://${host}:${port}${ServiceInfo.MCP_PATH}`,
  );
}) as Server;

listener.on("error", (error) => {
  console.error("Failed to start Serphouse MCP HTTP server:", error);
  process.exit(1);
});

function missingApiKey(_req: HttpRequest, res: HttpResponse): void {
  res
    .status(HttpStatus.BAD_REQUEST)
    .json(jsonRpcError(Messages.MISSING_API_KEY_IN_PATH, null));
}

function getPort(): number {
  const rawPort = process.env.PORT ?? process.env.MCP_PORT ?? "3000";
  const parsed = Number(rawPort);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3000;
}
