# Etapa 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Generamos Prisma aquí para que se cree la estructura en node_modules
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# Etapa 2: Runner
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Instalamos todas las dependencias (incluyendo @prisma/client que debe estar en "dependencies")
RUN npm ci --only=production
# Copiamos los archivos compilados
COPY --from=builder /app/dist ./dist
# Copiamos la carpeta prisma (por si acaso, aunque ya esté generado)
COPY --from=builder /app/prisma ./prisma
# IMPORTANTE: Copiamos el cliente generado desde el builder
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
CMD ["node", "dist/src/main.js"]