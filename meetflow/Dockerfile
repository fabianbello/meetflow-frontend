FROM node:18 as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install --force

COPY . /app 

RUN npm ci --force

RUN npm run build --force

FROM nginx

COPY --from=build-step /app/dist/meetflow /usr/share/nginx/html




