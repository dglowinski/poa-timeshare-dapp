FROM mhart/alpine-node:latest

RUN apk update && apk upgrade && \
   apk add --no-cache bash git openssh python make g++

COPY build_webpack/ build 

RUN npm i http-server -g

EXPOSE 80

CMD http-server build -p 80