import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const user = await prisma.user.update({
    where: { email: 'mateobossa909@gmail.com' },  // <-- tu email aquí
    data: { role: 'ADMIN' },
    select: { id: true, name: true, email: true, role: true },
  });
  console.log('✅ Admin:', user);
}

main().catch(console.error).finally(() => prisma.$disconnect());