// prisma/seed-players.ts (versión corregida)
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL no está definida en el archivo .env');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

function slug(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Mapeo de códigos de posición a los que existen en la BD (solo fútbol)
const POSITION_MAPPING: Record<string, string> = {
  // Fútbol
  'ST': 'FWD',    // Delantero Centro → Forward
  'CF': 'FWD',    // Delantero Centro → Forward
  'LW': 'FWD',    // Extremo Izquierdo → Forward
  'RW': 'FWD',    // Extremo Derecho → Forward
  'CAM': 'MID',   // Mediapunta → Midfielder
  'CM': 'MID',    // Centrocampista Central → Midfielder
  'CDM': 'MID',   // Mediocentro Defensivo → Midfielder
  'RM': 'MID',    // Mediocentro Derecho → Midfielder
  'LM': 'MID',    // Mediocentro Izquierdo → Midfielder
  'CB': 'DEF',    // Defensa Central → Defender
  'RB': 'DEF',    // Lateral Derecho → Defender
  'LB': 'DEF',    // Lateral Izquierdo → Defender
  'GK': 'GK',     // Portero → Goalkeeper
};

// Función para obtener el código mapeado o undefined
function getMappedPosition(code: string): string | undefined {
  return POSITION_MAPPING[code];
}

// ============================================================
// JUGADORES - SOLO FÚTBOL (SERIE A)
// ============================================================
const PLAYERS = [
// --- PORTEROS ---
  {
    firstName: "Keylor",
    lastName: "Navas",
    nationality: "Costa Rica",
    birthDate: new Date("1986-12-15"),
    birthPlace: "Pérez Zeledón, Costa Rica",
    height: 185,
    weight: 80,
    jerseyNumber: 13,
    photoUrl: "https://assets.realmadrid.com/is/image/realmadrid/1330783761069?$Mobile$&fit=wrap&wid=312",
    biography: "Portero fichado tras su brillante Mundial 2014 con Costa Rica y una gran campaña en el Levante.",
    positionCode: "GK",
    teamName: "Real Madrid"
  },

  // --- CENTROCAMPISTAS ---
  {
    firstName: "James",
    lastName: "Rodríguez",
    nationality: "Colombia",
    birthDate: new Date("1991-07-12"),
    birthPlace: "Cúcuta, Colombia",
    height: 180,
    weight: 75,
    jerseyNumber: 10,
    photoUrl: "https://assets.realmadrid.com/is/image/realmadrid/1330783932802?$Mobile$&fit=wrap&wid=312",
    biography: "Mediapunta estelar y bota de oro del Mundial 2014. Fichaje galáctico del verano procedente del Mónaco.",
    positionCode: "CAM",
    teamName: "Real Madrid"
  },
  {
    firstName: "Lucas",
    lastName: "Silva",
    nationality: "Brasil",
    birthDate: new Date("1993-02-16"),
    birthPlace: "Bom Jesus de Goiás, Brasil",
    height: 182,
    weight: 80,
    jerseyNumber: 16,
    photoUrl: "https://assets.realmadrid.com/is/image/realmadrid/LUCAS-SILVA-PRESENTACION_a_1AM7613?$Mobile$&fit=wrap&wid=312",
    biography: "Mediocentro defensivo brasileño incorporado en el mercado de invierno de 2015 procedente del Cruzeiro.",
    positionCode: "CDM",
    teamName: "Real Madrid"
  },
  {
    firstName: "Martin",
    lastName: "Ødegaard",
    nationality: "Noruega",
    birthDate: new Date("1998-12-17"),
    birthPlace: "Drammen, Noruega",
    height: 178,
    weight: 68,
    jerseyNumber: 21,
    photoUrl: "https://assets.realmadrid.com/is/image/realmadrid/ODEGAARD_1VC0708?$Mobile$&fit=wrap&wid=312",
    biography: "Joven prodigio noruego fichado en enero de 2015. Debutó con el primer equipo en la última jornada de Liga.",
    positionCode: "CAM",
    teamName: "Real Madrid"
  },

  // --- DELANTEROS ---
  {
    firstName: "Javier",
    lastName: "Hernández",
    nationality: "México",
    birthDate: new Date("1988-06-01"),
    birthPlace: "Guadalajara, México",
    height: 175,
    weight: 73,
    jerseyNumber: 14,
    photoUrl: "https://assets.realmadrid.com/is/image/realmadrid/CHICHARITO-HERNANDEZ_1AM6255?$Mobile$&fit=wrap&wid=312",
    biography: "Delantero centro ('Chicharito'). Llegó cedido del Manchester United; recordado por su gol decisivo ante el Atlético en Champions.",
    positionCode: "ST",
    teamName: "Real Madrid"
  }
];

// ============================================================
// SEED PRINCIPAL
// ============================================================
async function main() {
  console.log('⚽ Iniciando seed de jugadores...\n');
  console.log(`📋 Se crearán ${PLAYERS.length} jugadores\n`);

  let created = 0;
  let skipped = 0;
  let noPosition = 0;
  let noTeam = 0;

  for (const playerData of PLAYERS) {
    // Obtener el código mapeado
    const mappedCode = getMappedPosition(playerData.positionCode);
    
    if (!mappedCode) {
      console.log(`⚠️  No hay mapeo para ${playerData.positionCode} - ${playerData.firstName} ${playerData.lastName}`);
      noPosition++;
      continue;
    }

    // Buscar posición por el código mapeado
    const position = await prisma.position.findFirst({
      where: { code: mappedCode }
    });

    if (!position) {
      console.log(`⚠️  Posición no encontrada: ${mappedCode} (original: ${playerData.positionCode}) para ${playerData.firstName} ${playerData.lastName}`);
      noPosition++;
      continue;
    }

    // Buscar equipo
    let teamId: string | null = null;
    if (playerData.teamName) {
      const team = await prisma.team.findFirst({
        where: { name: playerData.teamName }
      });
      if (team) {
        teamId = team.id;
      } else {
        console.log(`⚠️  Equipo no encontrado: ${playerData.teamName} para ${playerData.firstName} ${playerData.lastName}`);
        noTeam++;
        continue;
      }
    }

    const playerSlug = slug(`${playerData.firstName}-${playerData.lastName}`);
    
    // Verificar si el jugador ya existe
   const existing = await prisma.player.findFirst({
    where: {
      OR: [
        { slug: playerSlug },
        { firstName: playerData.firstName, lastName: playerData.lastName }
      ]
    }
  });

  if (existing) {
    if (!existing.photoUrl && playerData.photoUrl) {
      await prisma.player.update({
        where: { id: existing.id },
        data:  { photoUrl: playerData.photoUrl }
      });
      console.log(`📸 Foto actualizada: ${playerData.firstName} ${playerData.lastName}`);
    } else {
      console.log(`⏭️  ${playerData.firstName} ${playerData.lastName} - ya existe`);
    }
    skipped++;
    continue;
  }

    // Crear el jugador
    await prisma.player.create({
      data: {
        firstName: playerData.firstName,
        lastName: playerData.lastName,
        slug: playerSlug,
        nationality: playerData.nationality,
        birthDate: playerData.birthDate,
        birthPlace: playerData.birthPlace,
        height: playerData.height,
        weight: playerData.weight,
        jerseyNumber: playerData.jerseyNumber,
        photoUrl: playerData.photoUrl,
        biography: playerData.biography,
        positionId: position.id,
        teamId: teamId,
        active: true
      }
    });

    console.log(`✅ Creado: ${playerData.firstName} ${playerData.lastName} (${position.code} ← ${playerData.positionCode}) - ${playerData.teamName}`);
    created++;
  }

  console.log('\n📊 Resumen:');
  console.log(`   ✅ Creados: ${created} jugadores`);
  console.log(`   ⏭️  Saltados: ${skipped}`);
  console.log(`   ⚠️ Sin posición: ${noPosition}`);
  console.log(`   ⚠️ Sin equipo: ${noTeam}`);
  console.log(`   📋 Total procesados: ${PLAYERS.length}`);
  
  console.log('\n✨ Seed de jugadores completado exitosamente!\n');
}

main()
  .catch(e => {
    console.error('❌ Error en seed de jugadores:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });