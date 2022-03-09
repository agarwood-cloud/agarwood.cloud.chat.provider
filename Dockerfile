# @description php image base on the node:17-alpine3.14
#
#                       Some Information
# ------------------------------------------------------------------------------------
# @link https://hub.docker.com/_/node/      node image
# ------------------------------------------------------------------------------------
# @build-example docker build . -f Dockerfile -t agarwood/chat:2.0
#
FROM node:14-alpine3.14

LABEL maintainer="676786620@qq.com>" version="2.0"

ADD . /var/www/agarwood

RUN yarn

WORKDIR /var/www/agarwood

EXPOSE 3000
