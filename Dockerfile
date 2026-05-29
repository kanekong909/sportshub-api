# Etapa 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm ci
COPY . .
# Generamos Prisma y construimos
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# Etapa 2: Runner
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

# Usamos find para localizar el archivo .js generado sin importar dónde esté
CMD ["sh", "-c", "node $(find dist -name main.js)"]