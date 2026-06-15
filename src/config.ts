import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";
import { Messages } from "./constants.ts";
import { configError } from "./lib/errors.ts";

export type SerphouseConfig = {
  apiKey?: string;
  baseUrl: string;
  timeoutMs: number;
};

const DEFAULT_BASE_URL = "https://api.serphouse.com";
const DEFAULT_TIMEOUT_MS = 60_000;
const MAX_TIMEOUT_MS = 300_000;
const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let envFilesLoaded = false;

export function loadConfig(env?: Record<string, string | undefined>): SerphouseConfig {
  const source = env ?? loadProcessEnv();
  const timeoutMs = parseTimeoutMs(source.SERPHOUSE_TIMEOUT_MS);

  return {
    apiKey: source.SERPHOUSE_API_KEY ?? source.SERPHOUSE_API_TOKEN,
    baseUrl: parseBaseUrl(source.SERPHOUSE_BASE_URL),
    timeoutMs,
  };
}

function parseBaseUrl(value: string | undefined): string {
  const rawValue = value?.trim() || DEFAULT_BASE_URL;

  try {
    const url = new URL(rawValue);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
      throw configError(Messages.INVALID_BASE_URL);
    }

    return url.toString();
  } catch (error) {
    if (error && typeof error === "object" && "kind" in error) {
      throw error;
    }
    throw configError(Messages.INVALID_BASE_URL);
  }
}

function parseTimeoutMs(value: string | undefined): number {
  const timeoutMs = Number(value ?? DEFAULT_TIMEOUT_MS);

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return DEFAULT_TIMEOUT_MS;
  }

  return Math.min(timeoutMs, MAX_TIMEOUT_MS);
}

function loadProcessEnv(): NodeJS.ProcessEnv {
  if (envFilesLoaded) {
    return process.env;
  }

  envFilesLoaded = true;
  loadDotenv({ path: getEnvFilePaths(), quiet: true });

  return process.env;
}

function getEnvFilePaths(): string[] {
  return Array.from(new Set([resolve(process.cwd(), ".env"), resolve(PROJECT_ROOT, ".env")]));
}
