FROM node:alpine

COPY package*.json yarn*.lock ./
RUN yarn

COPY . .

ENV NODE_ENV production
RUN yarn build
RUN yarn cache clean
EXPOSE 3000
CMD [ "yarn", "start" ]
