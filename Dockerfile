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
# Instalamos solo dependencias de producción
COPY package*.json package-lock.json ./
RUN npm ci --only=production
# Copiamos la carpeta dist y la de prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# IMPORTANTE: Copiamos los binarios de prisma generados
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
# Asegúrate de poner la extensión .js
CMD ["node", "dist/main.js"]