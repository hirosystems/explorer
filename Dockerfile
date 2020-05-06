FROM node:alpine

COPY package*.json ./
RUN yarn

COPY . .

RUN npx next telemetry disable

RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]
