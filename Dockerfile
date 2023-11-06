FROM node:21-alpine3.17

RUN mkdir -p /home

COPY ./app /home/app

WORKDIR /home/app

CMD ["node", "index.js"]

