FROM node:22-alpine as dev

WORKDIR /app

ENV NODE_ENV development

COPY --chown=node:node . .

RUN npm install

USER node