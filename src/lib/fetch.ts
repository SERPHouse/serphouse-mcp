import { Messages } from "../constants.ts";
import { apiError, timeoutError } from "./errors.ts";

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export async function callApi(
  url: URL,
  init: RequestInit,
  endpoint: string,
  timeoutMs: number,
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const body = await readResponseBody(response);

    if (!response.ok) {
      throw apiError(Messages.httpError(response.status, endpoint), endpoint, response.status, body);
    }

    return body;
  } catch (error) {
    if (isAbortError(error)) {
      throw timeoutError(endpoint);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
