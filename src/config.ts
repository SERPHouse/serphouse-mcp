export type ServerConfig = {
  baseUrl: string;
  timeoutMs: number;
};

export type SerphouseConfig = ServerConfig & {
  apiKey: string;
};

const DEFAULT_BASE_URL = "https://api.serphouse.com";
const DEFAULT_TIMEOUT_MS = 60_000;

export function getServerConfig(): ServerConfig {
  return {
    baseUrl: DEFAULT_BASE_URL,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };
}
