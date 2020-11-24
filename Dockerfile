FROM node:alpine
COPY . .
run apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install --quiet node-gyp -g &&\
  yarn && \
  apk del native-deps
ENV NODE_ENV production
RUN yarn build
RUN yarn cache clean
EXPOSE 3000
CMD [ "yarn", "start" ]
