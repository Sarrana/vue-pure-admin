FROM node:18-alpine as build-stage

WORKDIR /app
RUN corepack enable
RUN corepack prepare npm@8.6.10 --activate

RUN npm config set registry https://registry.npmmirror.com

COPY .npmrc package.json npm-lock.yaml ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm build

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]