# syntax=docker/dockerfile:1

ARG NODE_VERSION=20
ARG ALPINE_VERSION=3.21

FROM node:${NODE_VERSION}-alpine AS node_base

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm i --no-audit --no-fund --prefer-offline --legacy-peer-deps \
    && npm cache clean --force

COPY tsconfig.json ./
COPY src ./src

RUN npm run build \
    && npx --yes esbuild@0.25.0 dist/src/http.js \
      --bundle \
      --platform=node \
      --format=cjs \
      --target=node20 \
      --minify \
      --legal-comments=none \
      --outfile=dist/server.cjs \
    && rm -rf src tsconfig.json node_modules package-lock.json \
    && npm cache clean --force

FROM alpine:${ALPINE_VERSION} AS production
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

RUN apk add --no-cache ca-certificates libstdc++ libgcc \
    && addgroup -g 1001 -S nodejs \
    && adduser -S mcp -u 1001 -G nodejs

COPY --from=node_base /usr/local/bin/node /usr/local/bin/node
COPY --from=build --chown=mcp:nodejs /app/dist/server.cjs ./server.cjs

USER mcp

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || process.env.MCP_PORT || 3000) + '/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.cjs"]
