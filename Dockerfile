FROM node:8.16.0

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

RUN npm install

EXPOSE 3100

CMD [ "npm", "start"]