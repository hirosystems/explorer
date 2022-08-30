# Set Global ARGs
# Pass these build args in to configure Segment
ARG SEGMENT_WRITE_KEY

# Pass these build args in to configure Sentry
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_DSN
ARG SENTRY_LOG_LEVEL=warn
ARG NODE_ENV=production

FROM node:16-alpine AS build

ENV SEGMENT_WRITE_KEY=${SEGMENT_WRITE_KEY}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_DSN=${SENTRY_DSN}
ENV SENTRY_LOG_LEVEL=${SENTRY_LOG_LEVEL}
ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN apk --no-cache add --virtual \
  native-deps \
  g++ \
  gcc \
  libgcc \
  libstdc++ \
  linux-headers \
  make \
  python3 \
  && npm install --quiet node-gyp -g \
  && yarn \
  && apk del native-deps

RUN yarn build

RUN yarn cache clean

FROM node:16-alpine

ENV SEGMENT_WRITE_KEY=${SEGMENT_WRITE_KEY}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_DSN=${SENTRY_DSN}
ENV SENTRY_LOG_LEVEL=${SENTRY_LOG_LEVEL}
ENV NODE_ENV=production

RUN apk --no-cache add --virtual \
  yarn

WORKDIR /app

COPY --from=build /app/next.config.js /app/next.config.js
COPY --from=build /app/public /app/public
COPY --from=build /app/.next/static /app/.next/static
COPY --from=build /app/.next/standalone /app


EXPOSE 3000
CMD [ "node", "server.js" ]
