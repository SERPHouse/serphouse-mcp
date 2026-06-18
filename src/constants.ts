/** HTTP status codes used by the MCP HTTP server. */
export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/** JSON-RPC error code for HTTP transport errors. */
export const JsonRpcErrorCode = {
  SERVER_ERROR: -32000,
} as const;

/** User-facing messages. */
export const Messages = {
  MISSING_API_KEY_IN_PATH:
    "Missing Serphouse API key. Send SERPHOUSE_API: <api_key> to /mcp.",
  INVALID_API_KEY: "Invalid Serphouse API key format.",
  INTERNAL_SERVER_ERROR: "Internal server error.",

  MISSING_API_KEY:
    "Missing Serphouse API key. Send SERPHOUSE_API: <api_key> to /mcp.",
} as const;

/** Service metadata shown on health checks and logs. */
export const ServiceInfo = {
  NAME: "serphouse-mcp",
  MCP_PATH: "/mcp",
} as const;
