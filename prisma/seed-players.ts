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
  // Inter Milan
  {
    firstName: "Lautaro",
    lastName: "Martínez",
    nationality: "Argentina",
    birthDate: new Date("1997-08-22"),
    birthPlace: "Bahía Blanca, Argentina",
    height: 174,
    weight: 72,
    jerseyNumber: 10,
    photoUrl: null,
    biography: "Delantero argentino, capitán del Inter. Campeón del mundo 2022.",
    positionCode: "ST",
    teamName: "Inter Milan"
  },
  {
    firstName: "Nicolò",
    lastName: "Barella",
    nationality: "Italy",
    birthDate: new Date("1997-02-07"),
    birthPlace: "Cagliari, Italy",
    height: 175,
    weight: 68,
    jerseyNumber: 23,
    photoUrl: null,
    biography: "Centrocampista italiano, pieza clave del Inter y la Nazionale.",
    positionCode: "CM",
    teamName: "Inter Milan"
  },
  {
    firstName: "Alessandro",
    lastName: "Bastoni",
    nationality: "Italy",
    birthDate: new Date("1999-04-13"),
    birthPlace: "Casalmaggiore, Italy",
    height: 190,
    weight: 75,
    jerseyNumber: 95,
    photoUrl: null,
    biography: "Defensor central italiano, uno de los mejores jóvenes del mundo.",
    positionCode: "CB",
    teamName: "Inter Milan"
  },
  
  // AC Milan
  {
    firstName: "Rafael",
    lastName: "Leão",
    nationality: "Portugal",
    birthDate: new Date("1999-06-10"),
    birthPlace: "Almada, Portugal",
    height: 188,
    weight: 81,
    jerseyNumber: 10,
    photoUrl: null,
    biography: "Extremo portugués, Balón de Oro del Serie A 2022.",
    positionCode: "LW",
    teamName: "AC Milan"
  },
  {
    firstName: "Mike",
    lastName: "Maignan",
    nationality: "France",
    birthDate: new Date("1995-07-03"),
    birthPlace: "Cayenne, French Guiana",
    height: 191,
    weight: 89,
    jerseyNumber: 16,
    photoUrl: null,
    biography: "Portero francés, campeón de la Serie A 2022.",
    positionCode: "GK",
    teamName: "AC Milan"
  },
  {
    firstName: "Theo",
    lastName: "Hernández",
    nationality: "France",
    birthDate: new Date("1997-10-06"),
    birthPlace: "Marseille, France",
    height: 184,
    weight: 81,
    jerseyNumber: 19,
    photoUrl: null,
    biography: "Lateral izquierdo francés, uno de los mejores del mundo en su posición.",
    positionCode: "LB",
    teamName: "AC Milan"
  },
  
  // Juventus
  {
    firstName: "Dušan",
    lastName: "Vlahović",
    nationality: "Serbia",
    birthDate: new Date("2000-01-28"),
    birthPlace: "Belgrade, Serbia",
    height: 190,
    weight: 85,
    jerseyNumber: 9,
    photoUrl: null,
    biography: "Delantero serbio, uno de los mejores goleadores jóvenes del mundo.",
    positionCode: "ST",
    teamName: "Juventus"
  },
  {
    firstName: "Federico",
    lastName: "Chiesa",
    nationality: "Italy",
    birthDate: new Date("1997-10-25"),
    birthPlace: "Genoa, Italy",
    height: 175,
    weight: 70,
    jerseyNumber: 7,
    photoUrl: null,
    biography: "Extremo italiano, campeón de la Eurocopa 2021.",
    positionCode: "RW",
    teamName: "Juventus"
  },
  {
    firstName: "Manuel",
    lastName: "Locatelli",
    nationality: "Italy",
    birthDate: new Date("1998-01-08"),
    birthPlace: "Lecco, Italy",
    height: 186,
    weight: 75,
    jerseyNumber: 5,
    photoUrl: null,
    biography: "Centrocampista italiano, campeón de la Eurocopa 2021.",
    positionCode: "CDM",
    teamName: "Juventus"
  },
  
  // Napoli
  {
    firstName: "Victor",
    lastName: "Osimhen",
    nationality: "Nigeria",
    birthDate: new Date("1998-12-29"),
    birthPlace: "Lagos, Nigeria",
    height: 186,
    weight: 78,
    jerseyNumber: 9,
    photoUrl: null,
    biography: "Delantero nigeriano, capocannoniere de la Serie A 2023.",
    positionCode: "ST",
    teamName: "Napoli"
  },
  {
    firstName: "Khvicha",
    lastName: "Kvaratskhelia",
    nationality: "Georgia",
    birthDate: new Date("2001-02-12"),
    birthPlace: "Tbilisi, Georgia",
    height: 183,
    weight: 70,
    jerseyNumber: 77,
    photoUrl: null,
    biography: "Extremo georgiano, MVP de la Serie A 2023.",
    positionCode: "LW",
    teamName: "Napoli"
  },
  {
    firstName: "Stanislav",
    lastName: "Lobotka",
    nationality: "Slovakia",
    birthDate: new Date("1994-11-25"),
    birthPlace: "Trenčín, Slovakia",
    height: 170,
    weight: 64,
    jerseyNumber: 68,
    photoUrl: null,
    biography: "Centrocampista eslovaco, cerebro del juego del Napoli.",
    positionCode: "CM",
    teamName: "Napoli"
  },
  
  // AS Roma
  {
    firstName: "Paulo",
    lastName: "Dybala",
    nationality: "Argentina",
    birthDate: new Date("1993-11-15"),
    birthPlace: "Laguna Larga, Argentina",
    height: 177,
    weight: 75,
    jerseyNumber: 21,
    photoUrl: null,
    biography: "Mediapunta argentino, campeón del mundo 2022.",
    positionCode: "CAM",
    teamName: "AS Roma"
  },
  {
    firstName: "Lorenzo",
    lastName: "Pellegrini",
    nationality: "Italy",
    birthDate: new Date("1996-06-19"),
    birthPlace: "Rome, Italy",
    height: 186,
    weight: 77,
    jerseyNumber: 7,
    photoUrl: null,
    biography: "Capitán de la Roma, centrocampista ofensivo.",
    positionCode: "CAM",
    teamName: "AS Roma"
  },
  {
    firstName: "Gianluca",
    lastName: "Mancini",
    nationality: "Italy",
    birthDate: new Date("1996-04-17"),
    birthPlace: "Florence, Italy",
    height: 190,
    weight: 77,
    jerseyNumber: 23,
    photoUrl: null,
    biography: "Defensor central, capitán de la Roma.",
    positionCode: "CB",
    teamName: "AS Roma"
  },
  
  // Lazio
  {
    firstName: "Ciro",
    lastName: "Immobile",
    nationality: "Italy",
    birthDate: new Date("1990-02-20"),
    birthPlace: "Torre Annunziata, Italy",
    height: 181,
    weight: 78,
    jerseyNumber: 17,
    photoUrl: null,
    biography: "Máximo goleador histórico de la Lazio y capocannoniere récord.",
    positionCode: "ST",
    teamName: "Lazio"
  },
  {
    firstName: "Luis",
    lastName: "Alberto",
    nationality: "Spain",
    birthDate: new Date("1992-09-28"),
    birthPlace: "San José del Valle, Spain",
    height: 182,
    weight: 74,
    jerseyNumber: 10,
    photoUrl: null,
    biography: "Centrocampista español, mago con el balón.",
    positionCode: "CAM",
    teamName: "Lazio"
  },
  
  // Atalanta
  {
    firstName: "Teun",
    lastName: "Koopmeiners",
    nationality: "Netherlands",
    birthDate: new Date("1998-02-28"),
    birthPlace: "Castricum, Netherlands",
    height: 184,
    weight: 77,
    jerseyNumber: 7,
    photoUrl: null,
    biography: "Centrocampista neerlandés, especialista en tiros largos.",
    positionCode: "CM",
    teamName: "Atalanta"
  },
  {
    firstName: "Ademola",
    lastName: "Lookman",
    nationality: "Nigeria",
    birthDate: new Date("1997-10-20"),
    birthPlace: "London, England",
    height: 174,
    weight: 72,
    jerseyNumber: 11,
    photoUrl: null,
    biography: "Extremo nigeriano, hat-trick en la final de la Europa League 2024.",
    positionCode: "LW",
    teamName: "Atalanta"
  },
  
  // Fiorentina
  {
    firstName: "Nicolás",
    lastName: "González",
    nationality: "Argentina",
    birthDate: new Date("1998-04-06"),
    birthPlace: "Belén de Escobar, Argentina",
    height: 180,
    weight: 75,
    jerseyNumber: 10,
    photoUrl: null,
    biography: "Extremo argentino, campeón del mundo 2022 y de la Copa América 2024.",
    positionCode: "RW",
    teamName: "Fiorentina"
  },
  
  // Bologna
  {
    firstName: "Joshua",
    lastName: "Zirkzee",
    nationality: "Netherlands",
    birthDate: new Date("2001-05-22"),
    birthPlace: "Schiedam, Netherlands",
    height: 193,
    weight: 85,
    jerseyNumber: 9,
    photoUrl: null,
    biography: "Delantero neerlandés, joven promesa del fútbol europeo.",
    positionCode: "ST",
    teamName: "Bologna"
  }
];

// ============================================================
// SEED PRINCIPAL
// ============================================================
async function main() {
  console.log('⚽ Iniciando seed de jugadores de la Serie A...\n');
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
      where: { slug: playerSlug }
    });

    if (existing) {
      console.log(`⏭️  ${playerData.firstName} ${playerData.lastName} - ya existe`);
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