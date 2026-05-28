import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const email = process.argv[2];
  if (!email) { console.log('Uso: ts-node prisma/make-admin.ts tu@email.com'); process.exit(1); }

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
    select: { id: true, name: true, email: true, role: true },
  });
  console.log('✅ Usuario actualizado a ADMIN:', user);
}

main().catch(console.error).finally(() => prisma.$disconnect());
