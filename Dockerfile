FROM node:8.5.0

RUN rm -rf /app
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY . /app
