FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código
COPY . .

# Generar Prisma Client (puede fallar sin DB, por eso el || true)
RUN (npx prisma generate || npx prisma generate --no-engine)

# Build
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Copiar dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar build y Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Variables de entorno
ENV NODE_ENV=production

EXPOSE 3000

# Comando de inicio con migraciones
CMD sh -c "if [ ! -z \"$DATABASE_URL\" ]; then npx prisma migrate deploy; fi && node dist/main"