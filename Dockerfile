FROM node:8.17.0

RUN rm -rf /app
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

ENV PORT 8080

CMD [ "npm", "run", "example" ]
