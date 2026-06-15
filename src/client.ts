import { Messages } from "./constants.ts";
import type { SerphouseConfig } from "./config.ts";
import { configError } from "./lib/errors.ts";
import { callApi } from "./lib/fetch.ts";
import { buildUrl } from "./lib/utils.ts";

type HttpMethod = "GET" | "POST";
type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

export type SerphouseClient = {
  get: (path: string, query?: QueryParams, apiKey?: string) => Promise<unknown>;
  postData: (path: string, data: unknown, apiKey?: string) => Promise<unknown>;
};

export function createSerphouseClient(config: SerphouseConfig): SerphouseClient {
  return {
    get: (path, query, apiKey) => request(config, "GET", path, { query, apiKey }),
    postData: (path, data, apiKey) => request(config, "POST", path, { body: { data }, apiKey }),
  };
}

function request(
  config: SerphouseConfig,
  method: HttpMethod,
  path: string,
  options: { query?: QueryParams; body?: unknown; apiKey?: string } = {},
): Promise<unknown> {
  const apiKey = options.apiKey ?? config.apiKey;

  if (!apiKey) {
    throw configError(Messages.MISSING_API_KEY);
  }

  const endpoint = `${method} ${path}`;
  const url = buildUrl(config.baseUrl, path, options.query);
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
  };

  const init: RequestInit = { method, headers };

  if (method === "POST") {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.body ?? {});
  }

  return callApi(url, init, endpoint, config.timeoutMs);
}
