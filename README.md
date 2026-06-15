<div align="center">

<img src="assets/serphouse-logo.png" alt="SERPHouse logo" width="80" />

# SERPHouse MCP Server

**Connect AI assistants to live SERP data, Google verticals, and SEO intelligence — powered by [SERPHouse](https://serphouse.com).**

Run Google searches, schedule SERP tasks, resolve locations, and query Jobs, Local, Videos, and more — directly from Cursor, VS Code, Claude Desktop, or any MCP-compatible client. No custom API integration required.

<br />

[![TypeScript 5+](https://img.shields.io/badge/TypeScript-5%2B-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-7B42BC)](https://modelcontextprotocol.io/)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Install in VS Code](https://img.shields.io/badge/Install%20in-VS%20Code-blue?logo=visualstudiocode)](https://insiders.vscode.dev/redirect/mcp/install?name=serphouse-mcp&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.serphouse.com%2Fmcp%22%2C%22headers%22%3A%7B%22SERPHOUSE_API%22%3A%22YOUR_SERPHouse_API_KEY%22%7D%7D)
[![Install in Cursor](https://img.shields.io/badge/Install%20in-Cursor-blue?logo=cursor)](cursor://anysphere.cursor-deeplink/mcp/install?name=serphouse-mcp&config=eyJ0eXBlIjoiaHR0cCIsInVybCI6Imh0dHBzOi8vbWNwLnNlcnBob3VzZS5jb20vbWNwIiwiaGVhZGVycyI6eyJTRVJQSE9VU0VfQVBJIjoiWU9VUl9TRVJQSG91c2VfQVBJX0tFWSJ9fQ==)

[![Website](https://img.shields.io/badge/Website-serphouse.com-7B42BC)](https://serphouse.com)
[![GitHub](https://img.shields.io/badge/GitHub-SERPHouse-181717?logo=github)](https://github.com/SERPHouse)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-SERPHouse-0A66C2?logo=linkedin)](https://linkedin.com/company/serphouse)

</div>

---

## Table of Contents

- [Why SERPHouse MCP](#why-serphouse-mcp)
- [Quick Start (Hosted)](#quick-start-hosted)
- [What You Can Ask](#what-you-can-ask)
- [Tools Overview](#tools-overview)
- [Self-Host Locally](#self-host-locally)
- [Self-Host with Docker](#self-host-with-docker)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Why SERPHouse MCP

| | |
|---|---|
| **18 MCP tools** | Live SERP, scheduled tasks, Google verticals, and account lookups — all exposed with typed schemas |
| **Zero glue code** | Your assistant picks the right tool; you describe what you need in plain language |
| **Hosted or self-hosted** | Use the managed endpoint at `mcp.serphouse.com`, or run the server on your own infrastructure |
| **Built-in context** | MCP resources (`serphouse_capabilities`, `serphouse_constraints`, `serphouse_examples`) teach the AI usage rules automatically |

---

## Quick Start (Hosted)

The fastest path — no build step, no server to maintain.

**1.** Get your API key from the [SERPHouse dashboard](https://serphouse.com).

**2.** Add the server to your MCP client config:

```json
{
  "mcpServers": {
    "serphouse": {
      "url": "https://mcp.serphouse.com/mcp",
      "headers": {
        "SERPHOUSE_API": "YOUR_SERPHouse_API_KEY"
      }
    }
  }
}
```

**3.** Start chatting. Ask your assistant to search Google, look up locations, fetch jobs, or check your account — it will route to the correct tool.

> **One-click install:** Use the **Install in VS Code** or **Install in Cursor** badges above, then replace the placeholder API key with yours.

---

## What You Can Ask

For SEO teams, agencies, and SaaS marketers who need live search data inside their AI workflow — no dashboards, scripts, or context switching.

| Why you use it | Example prompt |
|----------------|----------------|
| **Track your rankings** | *"Where do we rank for 'crm software' on Google US desktop?"* |
| **Beat competitors** | *"Who owns the top 5 spots for 'project management software' in London?"* |
| **Own local search** | *"Top Google Local results for 'emergency plumber' in Chicago."* |
| **Discover keywords** | *"What does Autocomplete suggest for 'best saas for'?"* |
| **Monitor positions** | *"Schedule a mobile SERP check for our brand in NYC and report our rank."* |

---

## Tools Overview

The server exposes **18 tools** across four categories. Every SERP and Google vertical request requires exactly one location field — `loc` (e.g. `Austin,Texas,United States`) or `loc_id` (from `serphouse_location_search`). Never send both or omit both.

### Reference

| Tool | Description |
|------|-------------|
| `serphouse_domain_list` | Supported Google, Bing, and Yahoo search domains |
| `serphouse_language_list` | Language codes by search engine type |
| `serphouse_location_search` | Resolve city/country names to `loc_id` |
| `serphouse_account_info` | Account balance and usage |

### Live SERP

| Tool | Description |
|------|-------------|
| `serphouse_serp_live` | Submit a live SERP query |
| `serphouse_serp_live_get` | Retrieve live SERP results |
| `serphouse_serp_google_advanced` | Advanced Google SERP with extended parameters |

### Scheduled

| Tool | Description |
|------|-------------|
| `serphouse_serp_schedule` | Schedule a SERP task |
| `serphouse_serp_google_advanced_scheduled` | Schedule an advanced Google SERP task |
| `serphouse_task_check` | Poll task status |
| `serphouse_task_get` | Fetch completed task results |
| `serphouse_schedule_and_wait` | Schedule, poll, and return results in one call |

### Google Verticals

| Tool | Description |
|------|-------------|
| `serphouse_google_jobs` | Google Jobs search |
| `serphouse_google_autocomplete` | Google Autocomplete suggestions |
| `serphouse_google_videos` | Google Videos results |
| `serphouse_google_short_videos` | Google Short Videos (Shorts) |
| `serphouse_google_forums` | Google Forums results |
| `serphouse_google_local` | Google Local / Maps results |

---

## Self-Host Locally

Run the server on your machine for full control or local development.

```bash
git clone https://github.com/SERPHouse/serphouse-mcp.git
cd serphouse-mcp
npm install
npm run build
npm start
```

The server listens on `http://localhost:3000`. MCP endpoint: `POST /mcp`

Point your MCP client at the local instance:

```json
{
  "mcpServers": {
    "serphouse": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "SERPHOUSE_API": "YOUR_SERPHouse_API_KEY"
      }
    }
  }
}
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the HTTP server (`http://localhost:3000/mcp`) |
| `npm run start:stdio` | Run the stdio transport server (local MCP process mode) |
| `npm run dev` | Run the HTTP server with hot reload |
| `npm run dev:ins` | Launch MCP Inspector against the stdio server for debugging |
| `npm run typecheck` | Type-check without emitting files |

Health check: `GET http://localhost:3000/health`

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SERPHOUSE_API_KEY` | — | API key for stdio mode (`start:stdio`) or optional fixed key for standalone HTTP |
| `SERPHOUSE_BASE_URL` | `https://api.serphouse.com` | SERPHouse API base URL |
| `SERPHOUSE_TIMEOUT_MS` | `60000` | Request timeout in ms |
| `PORT` | `3000` | HTTP listen port |
| `HOST` | `0.0.0.0` | HTTP bind address |

---

## Self-Host with Docker

Run the MCP server locally in Docker without installing Node.js.

### 1. Set environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your API key:

```bash
SERPHOUSE_API_KEY=your_serphouse_api_key
PORT=3000
```

### 2. Start the server

```bash
docker compose up -d
```

The server runs at `http://localhost:3000/mcp`.

### 3. Connect your MCP client

```json
{
  "mcpServers": {
    "serphouse": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Missing API key | Send `SERPHOUSE_API` header (HTTP) or set `SERPHOUSE_API_KEY` (stdio) |
| Invalid key | Verify your key in the [SERPHouse dashboard](https://serphouse.com) |
| Credit exhausted | Check balance with `serphouse_account_info` |
| Location error | Include `loc` or `loc_id`; use `serphouse_location_search` to resolve IDs |
| Connection refused | Confirm the server is running and the URL/port is correct |

---

## Contributing

Contributions are welcome. Please keep changes focused and match existing code style.

```bash
git checkout -b feature/your-feature
npm install
# make changes
npm run typecheck
git commit -m "Add your feature"
git push origin feature/your-feature
```

Then open a Pull Request. Update this README if you change setup or configuration.

---

## License

[MIT License](LICENSE) — Copyright SERPHouse.
