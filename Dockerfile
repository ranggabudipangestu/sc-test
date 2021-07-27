FROM node:current-alpine3.13

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .


CMD ["npm", "run", "start:prod"]