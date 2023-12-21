FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat

ARG REDIS_URL
ARG NEXT_PUBLIC_SEGMENT_WRITE_KEY
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_DSN
ARG SENTRY_LOG_LEVEL=warn
ARG NODE_ENV=production
ARG X_API_KEY
ARG RELEASE_TAG_NAME

ENV REDIS_URL=${REDIS_URL}
ENV NEXT_PUBLIC_SEGMENT_WRITE_KEY=${SEGMENT_WRITE_KEY}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_DSN=${SENTRY_DSN}
ENV SENTRY_LOG_LEVEL=${SENTRY_LOG_LEVEL}
ENV NODE_ENV=${NODE_ENV}
ENV X_API_KEY=${X_API_KEY}
ENV RELEASE_TAG_NAME=${RELEASE_TAG_NAME}

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm@8.9.1 && pnpm i


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME localhost

CMD ["node", "server.js"]
