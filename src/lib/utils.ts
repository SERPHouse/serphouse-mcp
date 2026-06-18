import { JsonRpcErrorCode } from "../constants.ts";

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

/** Join a base URL with a path and optional query-string parameters. */
export function buildUrl(
  baseUrl: string,
  path: string,
  query?: QueryParams,
): URL {
  const url = new URL(path, baseUrl);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null) {
      continue;
    }
    url.searchParams.set(key, String(value));
  }

  return url;
}

/** Standard JSON-RPC 2.0 error envelope used by the HTTP MCP transport. */
export function jsonRpcError(
  message: string,
  id: string | number | null,
): Record<string, unknown> {
  return {
    jsonrpc: "2.0",
    error: {
      code: JsonRpcErrorCode.SERVER_ERROR,
      message,
    },
    id,
  };
}

/** Type guard for plain objects (not arrays or null). */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Remove `undefined` fields so Serphouse only receives set values. */
export function compact<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => compact(item)) as T;
  }

  if (!isRecord(value)) {
    return value;
  }

  const output: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    if (nestedValue !== undefined) {
      output[key] = compact(nestedValue);
    }
  }

  return output as T;
}

/** Return log-safe error details without request bodies, headers, or tokens. */
export function errorForLog(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    message: typeof error === "string" ? error : "Unknown error",
  };
}
