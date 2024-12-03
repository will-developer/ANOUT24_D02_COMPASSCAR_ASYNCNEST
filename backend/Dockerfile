FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 3000

ENV NODE_ENV development

CMD [ "npm", "run", "start:dev" ]
