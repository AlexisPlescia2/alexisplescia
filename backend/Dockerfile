FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app

COPY . .
RUN npm ci --ignore-scripts
RUN npx prisma generate
RUN npm run build

EXPOSE 10000

CMD ["sh", "-c", "timeout 60 npx tsx prisma/seed.ts || true; node dist/server.js"]
