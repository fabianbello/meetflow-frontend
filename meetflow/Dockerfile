FROM node:14 as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app 

RUN npm run build --prod

FROM nginx

COPY --from=build-step /app/dist/meetflow /usr/share/nginx/html

