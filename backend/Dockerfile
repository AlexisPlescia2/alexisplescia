FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app

COPY . .
RUN npm ci --ignore-scripts
RUN npx prisma generate
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/server.js"]
