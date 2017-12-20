FROM node:carbon

WORKDIR /usr/src/ropedb

COPY . .

RUN npm install

EXPOSE 1337

ENTRYPOINT []
CMD npm start
