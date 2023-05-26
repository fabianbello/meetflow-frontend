FROM node:20 as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app 

RUN npm ci && npm run build

FROM nginx:alpine

COPY --from=build-step /app/dist/meetflow /usr/share/nginx/html



