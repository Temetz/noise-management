FROM library/ubuntu:14.04

MAINTAINER Temetz

RUN apt-get update && apt-get install -y software-properties-common
RUN apt-get update && apt-get install -y nodejs npm

RUN ln -s /usr/bin/nodejs /usr/bin/node

COPY /api /api
RUN cd /api/src;npm install

EXPOSE 8002

CMD node /api/src/index.js
