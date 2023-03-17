FROM node:16-alpine AS build

ARG SEGMENT_WRITE_KEY
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_DSN
ARG SENTRY_LOG_LEVEL=warn
ARG NODE_ENV=production

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
  python3
RUN npm install --quiet node-gyp -g
RUN yarn --frozen-lockfile
RUN apk del native-deps

RUN yarn build

RUN yarn cache clean

FROM node:16-alpine

ARG SEGMENT_WRITE_KEY
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_DSN
ARG SENTRY_LOG_LEVEL=warn
ARG NODE_ENV=production

# Set ENVs so they persist after image is built
ENV SEGMENT_WRITE_KEY=${SEGMENT_WRITE_KEY}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_DSN=${SENTRY_DSN}
ENV SENTRY_LOG_LEVEL=${SENTRY_LOG_LEVEL}
ENV NODE_ENV=${NODE_ENV}

RUN apk --no-cache add --virtual \
  yarn

WORKDIR /app

COPY --from=build /app/next.config.js /app/next.config.js
COPY --from=build /app/public /app/public
COPY --from=build /app/.next/static /app/.next/static
COPY --from=build /app/.next/standalone /app


EXPOSE 3000
CMD [ "node", "server.js" ]

