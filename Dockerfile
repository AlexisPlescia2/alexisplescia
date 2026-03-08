FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app

COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm ci

COPY backend/ .
RUN npx prisma generate
RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "timeout 20 npx prisma migrate deploy || echo '[migration] skipped'; node dist/server.js"]
