
FROM node:14 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --prod


FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
