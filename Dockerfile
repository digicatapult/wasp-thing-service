# syntax=docker/dockerfile:1.1.7-experimental

FROM node:lts-alpine

# Allow log level to be controlled. Uses an argument name that is different
# from the existing environment variable, otherwise the environment variable
# shadows the argument.
ARG LOGLEVEL
ENV NPM_CONFIG_LOGLEVEL ${LOGLEVEL}

WORKDIR /wasp-thing-service

# Install base dependencies
COPY . .
RUN npm ci --production


EXPOSE 3001
CMD ["node", "./app/index.js"]
