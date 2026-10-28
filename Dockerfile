# syntax=docker/dockerfile:1

FROM node:23-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG PUBLIC_BACKENDURL
ARG PUBLIC_COOKIEDOMAIN
ARG PUBLIC_ENV
ENV PUBLIC_BACKENDURL=$PUBLIC_BACKENDURL \
    PUBLIC_COOKIEDOMAIN=$PUBLIC_COOKIEDOMAIN \
    PUBLIC_ENV=$PUBLIC_ENV
RUN npm run build

FROM node:23-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /src/build ./build
COPY --from=build /src/package.json /src/package-lock.json ./
RUN npm ci --omit=dev
EXPOSE 3000
ENTRYPOINT ["node", "build/index.js"]
