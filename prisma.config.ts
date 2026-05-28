import path from 'node:path';
import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv'; // Asegúrate de tener dotenv instalado

// Carga las variables de entorno si no existen en process.env
dotenv.config();

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    // Si process.env.DATABASE_URL es undefined, buscará en el entorno
    url: process.env.DATABASE_URL || '', 
  },
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
});