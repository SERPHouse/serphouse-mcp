/** HTTP status codes used by the MCP HTTP server and upstream error classification. */
export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  REQUEST_TIMEOUT: 408,
  UNPROCESSABLE_ENTITY: 422,
  GATEWAY_TIMEOUT: 504,
} as const;

/** Error codes returned in MCP tool responses. */
export const ErrorCode = {
  CONFIG_ERROR: "CONFIG_ERROR",
  AUTH_ERROR: "AUTH_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CREDIT_EXHAUSTED: "CREDIT_EXHAUSTED",
  TIMEOUT: "TIMEOUT",
  UPSTREAM_ERROR: "UPSTREAM_ERROR",
} as const;

/** JSON-RPC error code for HTTP transport errors. */
export const JsonRpcErrorCode = {
  SERVER_ERROR: -32000,
} as const;

/** User-facing messages. */
export const Messages = {
  MISSING_API_KEY_IN_PATH: "Missing Serphouse API key. Send SERPHOUSE_API: <api_key> to /mcp.",
  INVALID_API_KEY: "Invalid Serphouse API key format.",
  INTERNAL_SERVER_ERROR: "Internal server error.",

  MISSING_API_KEY:
    "Missing Serphouse API key. For HTTP, send SERPHOUSE_API: <api_key> to /mcp. For stdio, set SERPHOUSE_API_KEY or SERPHOUSE_API_TOKEN.",
  INVALID_BASE_URL: "SERPHOUSE_BASE_URL must be a valid http(s) URL without embedded credentials.",

  UPSTREAM_ERROR_RESPONSE: "Serphouse returned an error response.",
  UNKNOWN_UPSTREAM_ERROR: "Unknown error while calling Serphouse.",
  SCHEDULE_NO_TASK_ID: "Scheduled response did not include a task id to poll.",

  httpError: (status: number, endpoint: string) => `Serphouse returned HTTP ${status} for ${endpoint}`,
  timeoutCalling: (endpoint: string) => `Timed out while calling ${endpoint}`,
  timeoutWaitingForTask: (taskId: string | number) => `Timed out waiting for task ${taskId}.`,
} as const;

/** Service metadata shown on health checks and logs. */
export const ServiceInfo = {
  NAME: "serphouse-mcp",
  MCP_PATH: "/mcp",
} as const;
