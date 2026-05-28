import path from 'node:path';
import 'dotenv/config'; 
import { defineConfig, env } from 'prisma/config'; 

export default defineConfig({
  schema: path.join(process.cwd(), 'prisma', 'schema.prisma'), // Ajuste más seguro para rutas en Node
  datasource: {
    url: env("DATABASE_URL"), 
  },
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
});
