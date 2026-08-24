# =============================================================================
# Dockerfile — Backend Jardim de Software (multi-stage, non-root)
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Builder
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./

RUN npm ci --ignore-scripts && npm cache clean --force
RUN npx prisma generate

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2: Production
# ---------------------------------------------------------------------------
FROM node:22-alpine AS production

RUN apk add --no-cache dumb-init wget && rm -rf /var/cache/apk/*

RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup

WORKDIR /usr/app

ENV NODE_ENV=production

COPY --chown=appuser:appgroup package.json package-lock.json ./
COPY --chown=appuser:appgroup prisma ./prisma/

RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force && rm -rf /root/.npm /tmp/*
RUN npx prisma generate

COPY --from=builder --chown=appuser:appgroup /usr/app/dist ./dist

RUN mkdir -p uploads && chown -R appuser:appgroup uploads

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

LABEL org.opencontainers.image.title="Jardim de Software Backend" \
      org.opencontainers.image.description="API do site do Jardim de Software (IFPE Campus Belo Jardim)" \
      org.opencontainers.image.licenses="UNLICENSED"

ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/presentation/main.js"]
