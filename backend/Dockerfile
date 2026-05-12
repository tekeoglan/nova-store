FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache sqlite-libs

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=development
ENV PORT=8080

EXPOSE 8080

VOLUME /app/database

CMD ["node", "server.js"]
