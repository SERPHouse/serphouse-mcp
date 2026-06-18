import { Messages } from "./constants.ts";
import type { SerphouseConfig } from "./config.ts";
import { buildUrl } from "./lib/utils.ts";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

function authHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
  };
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

export async function get(
  config: SerphouseConfig,
  path: string,
  query?: QueryParams,
): Promise<unknown> {
  if (!config.apiKey) {
    throw new Error(Messages.MISSING_API_KEY);
  }

  const response = await fetch(buildUrl(config.baseUrl, path, query), {
    headers: authHeaders(config.apiKey),
    signal: AbortSignal.timeout(config.timeoutMs),
  });

  const body = await parseJson(response);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(body)}`);
  }

  return body;
}

export async function post(
  config: SerphouseConfig,
  path: string,
  data: unknown,
): Promise<unknown> {
  if (!config.apiKey) {
    throw new Error(Messages.MISSING_API_KEY);
  }

  const response = await fetch(buildUrl(config.baseUrl, path), {
    method: "POST",
    headers: {
      ...authHeaders(config.apiKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
    signal: AbortSignal.timeout(config.timeoutMs),
  });

  const body = await parseJson(response);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(body)}`);
  }

  return body;
}
