import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ErrorCode, HttpStatus, Messages } from "../constants.ts";
import { isApiCallError, type ApiCallError } from "./errors.ts";
import { isRecord, redactSecrets } from "./utils.ts";

type ToolBody = Record<string, unknown>;

export function toolSuccess(body: ToolBody): CallToolResult {
  const content = { ok: true, ...body };

  return {
    content: [{ type: "text", text: JSON.stringify(content, null, 2) }],
    structuredContent: content,
  };
}

export function toolError(body: ToolBody): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(body, null, 2) }],
    structuredContent: body,
    isError: true,
  };
}

export async function runSerphouseTool(endpoint: string, call: () => Promise<unknown>): Promise<CallToolResult> {
  try {
    const data = await call();
    return upstreamResult(endpoint, data);
  } catch (error) {
    return toolError(errorToBody(endpoint, error));
  }
}

export function upstreamErrorBody(endpoint: string, data: unknown): ToolBody | undefined {
  if (!isRecord(data) || data.status !== "error") {
    return undefined;
  }

  const message = typeof data.msg === "string" ? data.msg : Messages.UPSTREAM_ERROR_RESPONSE;

  return {
    ok: false,
    code: classifyMessage(message, data),
    message,
    details: {
      endpoint,
      upstream: redactSecrets(data),
    },
  };
}

function upstreamResult(endpoint: string, data: unknown): CallToolResult {
  const error = upstreamErrorBody(endpoint, data);
  if (error) {
    return toolError(error);
  }

  return toolSuccess({
    endpoint,
    data: redactSecrets(data),
  });
}

export function errorToBody(endpoint: string, error: unknown): ToolBody {
  if (isApiCallError(error)) {
    return apiCallErrorToBody(error);
  }

  return {
    ok: false,
    code: ErrorCode.UPSTREAM_ERROR,
    message: Messages.UNKNOWN_UPSTREAM_ERROR,
    details: { endpoint },
  };
}

function apiCallErrorToBody(error: ApiCallError): ToolBody {
  if (error.kind === "config") {
    return {
      ok: false,
      code: ErrorCode.CONFIG_ERROR,
      message: error.message,
      details: { endpoint: error.endpoint },
    };
  }

  if (error.kind === "timeout") {
    return {
      ok: false,
      code: ErrorCode.TIMEOUT,
      message: error.message,
      details: { endpoint: error.endpoint },
    };
  }

  return {
    ok: false,
    code: classifyHttpStatus(error.status ?? 0, error.body),
    message: error.message,
    details: {
      endpoint: error.endpoint,
      upstream_status: error.status,
      upstream: redactSecrets(error.body),
    },
  };
}

function classifyHttpStatus(status: number, body: unknown): string {
  const text = JSON.stringify(body).toLowerCase();

  if (
    status === HttpStatus.UNAUTHORIZED ||
    status === HttpStatus.FORBIDDEN ||
    text.includes("unauthenticated") ||
    text.includes("unauthorized")
  ) {
    return ErrorCode.AUTH_ERROR;
  }

  if (status === HttpStatus.BAD_REQUEST || status === HttpStatus.UNPROCESSABLE_ENTITY) {
    return ErrorCode.VALIDATION_ERROR;
  }

  if (status === HttpStatus.PAYMENT_REQUIRED || text.includes("credit") || text.includes("balance")) {
    return ErrorCode.CREDIT_EXHAUSTED;
  }

  if (status === HttpStatus.REQUEST_TIMEOUT || status === HttpStatus.GATEWAY_TIMEOUT) {
    return ErrorCode.TIMEOUT;
  }

  return ErrorCode.UPSTREAM_ERROR;
}

function classifyMessage(message: string, data: Record<string, unknown>): string {
  const text = `${message} ${JSON.stringify(data)}`.toLowerCase();

  if (text.includes("unauthenticated") || text.includes("unauthorized")) {
    return ErrorCode.AUTH_ERROR;
  }

  if (text.includes("validation")) {
    return ErrorCode.VALIDATION_ERROR;
  }

  if (text.includes("credit") || text.includes("balance")) {
    return ErrorCode.CREDIT_EXHAUSTED;
  }

  return ErrorCode.UPSTREAM_ERROR;
}

export function isCompletedStatus(data: unknown): boolean {
  if (!isRecord(data)) {
    return false;
  }

  const msg = typeof data.msg === "string" ? data.msg.toLowerCase() : "";
  return msg.includes("completed");
}

export function extractTaskId(data: unknown): string | number | undefined {
  if (!isRecord(data)) {
    return undefined;
  }

  const results = data.results;
  if (Array.isArray(results)) {
    const first = results.find((item) => isRecord(item) && (typeof item.id === "string" || typeof item.id === "number"));
    return isRecord(first) ? (first.id as string | number) : undefined;
  }

  if (isRecord(results) && (typeof results.id === "string" || typeof results.id === "number")) {
    return results.id;
  }

  return undefined;
}
