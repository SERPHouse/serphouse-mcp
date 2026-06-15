# Serphouse MCP Server

The Serphouse MCP Server connects [Serphouse](https://serphouse.com) search and SEO APIs to MCP-compatible clients like Cursor, VS Code, Claude Desktop, and other AI assistants.

This integration lets AI assistants run live SERP queries, scheduled tasks, Google vertical searches, and location lookups using your Serphouse subscription — without building custom API integrations.

---

## Hosted Service (Recommended)

Serphouse MCP is available as a hosted service at **https://mcp.serphouse.com**. You need a Serphouse API key to connect. Get yours from the [Serphouse dashboard](https://serphouse.com).

Add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "serphouse": {
      "url": "https://mcp.serphouse.com/mcp",
      "headers": {
        "SERPHOUSE_API": "YOUR_SERPHOUSE_API_KEY"
      }
    }
  }
}
```

Once connected, ask your assistant to search Google, look up locations, fetch jobs, or check your Serphouse account — it will pick the right tool automatically.

---

## Self-Host Locally

Run the MCP server on your machine when you need full control or local development.

```bash
git clone <your-repo-url>
cd MCP
npm install
npm run build
npm start
```

The server listens on `http://localhost:3000`. MCP endpoint: `POST /mcp`

Configure your MCP client:

```json
{
  "mcpServers": {
    "serphouse": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "SERPHOUSE_API": "YOUR_SERPHOUSE_API_KEY"
      }
    }
  }
}
```

### Available commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the HTTP server (`http://localhost:3000/mcp`) |
| `npm run start:stdio` | Run the stdio transport server (for local MCP process mode) |
| `npm run dev` | Run the HTTP server with hot reload |
| `npm run dev:ins` | Launch MCP Inspector against the stdio server for debugging |
| `npm run typecheck` | Type-check without emitting files |

Health check: `GET http://localhost:3000/health`

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SERPHOUSE_API_KEY` | — | API key for stdio mode (`start:stdio`) |
| `SERPHOUSE_BASE_URL` | `https://api.serphouse.com` | Serphouse API base URL |
| `SERPHOUSE_TIMEOUT_MS` | `60000` | Request timeout in ms |
| `PORT` | `3000` | HTTP listen port |
| `HOST` | `0.0.0.0` | HTTP bind address |

---

## Self-Host with Docker

For team or production deployments, run the server in a container.

```bash
docker build -t serphouse-mcp .
docker run -p 3000:3000 serphouse-mcp
```

Use the same MCP configuration as local self-host — point `url` to your server (`http://localhost:3000/mcp` locally, or your host URL in production). Send your API key via the `SERPHOUSE_API` header.

Replace `localhost` with your server hostname when deploying remotely. Use HTTPS in production and terminate TLS at a reverse proxy.

- Runs as non-root user `mcp`
- Built-in health check on `/health`
- Listens on port `3000` by default (override with `-e PORT=8080 -p 8080:8080`)

---

## Tools Overview

The server exposes **18 tools** for Serphouse APIs. MCP resources (`serphouse_capabilities`, `serphouse_constraints`, `serphouse_examples`) give the AI full context on usage rules.

| Category | Tools |
|----------|-------|
| Reference | `serphouse_domain_list`, `serphouse_language_list`, `serphouse_location_search`, `serphouse_account_info` |
| Live SERP | `serphouse_serp_live`, `serphouse_serp_live_get`, `serphouse_serp_google_advanced` |
| Scheduled | `serphouse_serp_schedule`, `serphouse_serp_google_advanced_scheduled`, `serphouse_task_check`, `serphouse_task_get`, `serphouse_schedule_and_wait` |
| Google verticals | `serphouse_google_jobs`, `serphouse_google_autocomplete`, `serphouse_google_videos`, `serphouse_google_short_videos`, `serphouse_google_forums`, `serphouse_google_local` |

**Location rule:** every SERP request needs exactly one of `loc` (e.g. `Austin,Texas,United States`) or `loc_id` (from `serphouse_location_search`). Never send both or omit both.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Missing API key | Send `SERPHOUSE_API` header (HTTP) or set `SERPHOUSE_API_KEY` (stdio) |
| Invalid key | Verify your key in the Serphouse dashboard |
| Credit exhausted | Check balance with `serphouse_account_info` |
| Location error | Include `loc` or `loc_id`; use `serphouse_location_search` to resolve IDs |
| Connection refused | Confirm the server is running and the URL/port is correct |

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Install dependencies: `npm install`
4. Make your changes and run `npm run typecheck`
5. Commit: `git commit -m 'Add your feature'`
6. Push: `git push origin feature/your-feature`
7. Open a Pull Request

Please keep changes focused, match existing code style, and update the README if you change setup or configuration.

---

## License

Private — internal use. See repository ownership for distribution terms.
