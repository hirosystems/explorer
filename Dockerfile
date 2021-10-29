FROM node:16-alpine AS deps

# Pass these build args in to configure Segment
ARG SEGMENT_WRITE_KEY

# Pass these build args in to configure Sentry
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_DSN
ARG SENTRY_LOG_LEVEL=warn

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

ENV SEGMENT_WRITE_KEY=${SEGMENT_WRITE_KEY}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_DSN=${SENTRY_DSN}
ENV SENTRY_LOG_LEVEL=${SENTRY_LOG_LEVEL}
ENV NODE_ENV=production

RUN yarn build
RUN yarn cache clean

EXPOSE 3000
CMD [ "yarn", "start" ]
