<div align="center">

<img src="./assets/serphouse-logo.png" alt="SERPHouse logo" width="80" />

# SERPHouse MCP Server

**Connect AI assistants to live SERP data, Google verticals, and SEO intelligence — powered by [SERPHouse](https://serphouse.com).**

Run Google, Bing, and Yahoo searches, resolve locations, and query Jobs, Local, Videos, and more — directly from Cursor, VS Code, Claude Desktop, or any MCP-compatible client. No custom API integration required.

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
| **21 MCP tools** | Live Google, Bing, and Yahoo SERP, Google verticals, and account lookups — all exposed with typed schemas |
| **Zero glue code** | Your assistant picks the right tool; you describe what you need in plain language |
| **Hosted or self-hosted** | Use the managed endpoint at `mcp.serphouse.com`, or run the server on your own infrastructure |
| **Built-in context** | MCP resources `serphouse_guide` and `serphouse_examples` teach tool routing, domains, location, and SEO rules |

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

**3.** Start chatting. Ask your assistant to search Google, Bing, or Yahoo, look up locations, fetch jobs, or check your account — it will route to the correct tool.

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
| **Monitor positions** | *"Run a mobile Bing SERP check for our brand in NYC and report our rank."* |
| **Multi-engine coverage** | *"Compare Yahoo and Google news results for 'electric vehicles'."* |

---

## Tools Overview

The server exposes **21 tools** across five categories. Google and Bing SERP requests require exactly one location field — `loc` (e.g. `Austin,Texas,United States`) or `loc_id` (from `serphouse_location_search`). Never send both or omit both on those endpoints. Yahoo SERP tools do not require location.

### Reference

| Tool | Description |
|------|-------------|
| `serphouse_domain_list` | Supported Google, Bing, and Yahoo search domains |
| `serphouse_language_list` | Language codes by search engine type |
| `serphouse_location_search` | Resolve city/country names to `loc_id` |
| `serphouse_account_info` | Account balance and usage |

### Google SERP

| Tool | Description |
|------|-------------|
| `serphouse_google_web` | Google web search |
| `serphouse_google_image` | Google image search |
| `serphouse_google_news` | Google news search |
| `serphouse_google_shop` | Google shopping search |
| `serphouse_serp_google_advanced` | Advanced Google SERP with extended parameters (up to 100 results) |

### Bing SERP

| Tool | Description |
|------|-------------|
| `serphouse_bing_web` | Bing web search |
| `serphouse_bing_image` | Bing image search |
| `serphouse_bing_news` | Bing news search |

### Yahoo SERP

| Tool | Description |
|------|-------------|
| `serphouse_yahoo_web` | Yahoo web search |
| `serphouse_yahoo_image` | Yahoo image search |
| `serphouse_yahoo_news` | Yahoo news search |

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

### Server Options

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP listen port |
| `HOST` | `0.0.0.0` | HTTP bind address |

Authentication is header-only. Send `SERPHOUSE_API: <api_key>` on every `/mcp` request (configure it in your MCP client `headers`).

---

## Self-Host with Docker

Run the MCP server locally in Docker without installing Node.js.

```bash
docker compose up -d
```

The server runs at `http://localhost:3000/mcp`.

Connect your MCP client with the API key in headers:

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

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Missing API key | Send `SERPHOUSE_API` header on `/mcp` requests |
| Invalid key | Verify your key in the [SERPHouse dashboard](https://serphouse.com) |
| Credit exhausted | Check balance with `serphouse_account_info` |
| Location error | For Google and Bing tools, include `loc` or `loc_id` (not both); use `serphouse_location_search` to resolve IDs. Yahoo SERP tools do not require location. |
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
