import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const COACHES = [
  {
    firstName: 'Carlo',    lastName: 'Ancelotti',
    nationality: 'Italian', birthDate: new Date('1959-06-10'),
    birthPlace: 'Reggiolo, Italy',
    photoUrl: 'https://img.a.transfermarkt.technology/portrait/big/26645-1694417994.jpg',
    biography: 'Uno de los entrenadores más laureados de la historia del fútbol. Único DT en ganar la Champions League con tres clubes distintos.',
    teamSlug: 'real-madrid', role: 'HEAD_COACH',
  },
  {
    firstName: 'Hansi',    lastName: 'Flick',
    nationality: 'German',  birthDate: new Date('1964-02-24'),
    birthPlace: 'Heidelberg, Germany',
    photoUrl: null,
    biography: 'Campeón del sextete con el Bayern Munich en 2020. Actualmente al frente del FC Barcelona.',
    teamSlug: 'fc-barcelona', role: 'HEAD_COACH',
  },
  {
    firstName: 'Pep',      lastName: 'Guardiola',
    nationality: 'Spanish', birthDate: new Date('1971-01-18'),
    birthPlace: 'Santpedor, Spain',
    photoUrl: 'https://img.a.transfermarkt.technology/portrait/big/7768-1694417994.jpg',
    biography: 'Considerado el mejor entrenador de su generación. Revolucionó el fútbol moderno con el Barcelona y el Bayern.',
    teamSlug: 'manchester-city', role: 'HEAD_COACH',
  },
  {
    firstName: 'JJ',       lastName: 'Redick',
    nationality: 'American', birthDate: new Date('1984-06-24'),
    birthPlace: 'Cookeville, Tennessee',
    photoUrl: null,
    biography: 'Ex jugador NBA que debutó como head coach de los Lakers en 2024.',
    teamSlug: 'los-angeles-lakers', role: 'HEAD_COACH',
  },
  {
    firstName: 'Andy',     lastName: 'Reid',
    nationality: 'American', birthDate: new Date('1958-03-19'),
    birthPlace: 'Los Angeles, California',
    photoUrl: null,
    biography: 'Head coach de los Kansas City Chiefs. Ha llevado al equipo a múltiples Super Bowls consecutivos.',
    teamSlug: 'kansas-city-chiefs', role: 'HEAD_COACH',
  },
];

async function main() {
  console.log('\n🌱 Seed de entrenadores...\n');

  for (const c of COACHES) {
    const { teamSlug, role, ...coachData } = c;
    const slug = slugify(`${c.firstName}-${c.lastName}`);

    const coach = await prisma.coach.upsert({
      where:  { slug },
      update: { photoUrl: coachData.photoUrl },
      create: { ...coachData, slug },
    });

    console.log(`  ✓ ${c.firstName} ${c.lastName}`);

    // Buscar equipo y temporada actual
    const team = await prisma.team.findUnique({ where: { slug: teamSlug } });
    if (!team) { console.log(`    ⚠ Equipo ${teamSlug} no encontrado`); continue; }

    const season = await prisma.season.findFirst({
      where:   { current: true, league: { teams: { some: { teamId: team.id } } } },
      orderBy: { name: 'desc' },
    });

    if (season) {
      await prisma.coachSeasonTeam.upsert({
        where:  { coachId_teamId_seasonId: { coachId: coach.id, teamId: team.id, seasonId: season.id } },
        update: {},
        create: { coachId: coach.id, teamId: team.id, seasonId: season.id, role: role as any, isActive: true },
      });
      console.log(`    → Asignado a ${team.name} (${season.name})`);
    } else {
      console.log(`    ⚠ No hay temporada actual para ${team.name}`);
    }
  }

  console.log('\n✅ Entrenadores creados!\n');
}

main().catch(console.error).finally(() => prisma.$disconnect());