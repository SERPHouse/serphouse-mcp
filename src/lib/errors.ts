import { Messages } from "../constants.ts";

/** Plain error object returned/thrown from API calls — no classes. */
export type ApiCallError = {
  kind: "config" | "api" | "timeout";
  message: string;
  endpoint?: string;
  status?: number;
  body?: unknown;
};

export function isApiCallError(error: unknown): error is ApiCallError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    (error as ApiCallError).kind !== undefined
  );
}

export function configError(message: string): ApiCallError {
  return { kind: "config", message };
}

export function apiError(message: string, endpoint: string, status: number, body: unknown): ApiCallError {
  return { kind: "api", message, endpoint, status, body };
}

export function timeoutError(endpoint: string): ApiCallError {
  return {
    kind: "timeout",
    message: Messages.timeoutCalling(endpoint),
    endpoint,
  };
}
