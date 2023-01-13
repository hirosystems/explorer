# Install dependencies only when needed
FROM node:16-alpine AS deps

# ARG SEGMENT_WRITE_KEY
# ARG SENTRY_AUTH_TOKEN
# ARG SENTRY_DSN
# ARG SENTRY_LOG_LEVEL=warn
# ARG NODE_ENV=production

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn


# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner

# ARG SEGMENT_WRITE_KEY
# ARG SENTRY_AUTH_TOKEN
# ARG SENTRY_DSN
# ARG SENTRY_LOG_LEVEL=warn
# ARG NODE_ENV=production

# Set ENVs so they persist after image is built
# ENV SEGMENT_WRITE_KEY=${SEGMENT_WRITE_KEY}
# ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
# ENV SENTRY_DSN=${SENTRY_DSN}
# ENV SENTRY_LOG_LEVEL=${SENTRY_LOG_LEVEL}
# ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# COPY --from=builder /app/next.config.js /app/next.config.js
# COPY --from=builder /app/public /app/public
# COPY --from=builder /app/.next/static /app/.next/static
# COPY --from=builder /app/.next/standalone /app

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
