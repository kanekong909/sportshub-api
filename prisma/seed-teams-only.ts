// prisma/seed-teams-only.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

// Verificar que DATABASE_URL existe
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL no está definida en el archivo .env');
  process.exit(1);
}

// Usar el mismo adaptador que en seed.ts
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

// Función para crear slug
function slug(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Interfaz para los datos del equipo
interface TeamInput {
  name: string;
  shortName: string;
  country: string;
  city: string;
  foundedYear: number;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  description: string;
}

// ============================================================
// LISTA DE EQUIPOS - MODIFICA AQUÍ TUS EQUIPOS
// ============================================================
const TEAMS_TO_SEED: TeamInput[] = [
   {
    name: "Inter Milan",
    shortName: "INT",
    country: "Italy",
    city: "Milan",
    foundedYear: 1908,
    primaryColor: "#0B0B3F",
    secondaryColor: "#FFD700",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Inter_Milan_logo.svg/1280px-Inter_Milan_logo.svg.png",
    description: "El FC Internazionale Milano, conocido como Inter, es el único club italiano que nunca ha descendido de Serie A. Ganador de la Champions League en 1964, 1965 y 2010, y campeón de la Serie A en 20 ocasiones."
  },
  {
    name: "AC Milan",
    shortName: "MIL",
    country: "Italy",
    city: "Milan",
    foundedYear: 1899,
    primaryColor: "#E20A0A",
    secondaryColor: "#0B0B0B",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/AC_Milan_logo.svg/1280px-AC_Milan_logo.svg.png",
    description: "El Associazione Calcio Milan es uno de los clubes más exitosos del mundo con 7 Champions League, 19 Serie A y numerosos títulos internacionales. Su estadio es el legendario San Siro."
  },
  {
    name: "Juventus",
    shortName: "JUV",
    country: "Italy",
    city: "Turin",
    foundedYear: 1897,
    primaryColor: "#FFFFFF",
    secondaryColor: "#0B0B0B",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juventus_FC_logo.svg/1280px-Juventus_FC_logo.svg.png",
    description: "La Juventus Football Club es el club más laureado de Italia con 36 títulos de Serie A. Ha ganado 2 Champions League y es conocido como 'La Vecchia Signora'."
  },
  {
    name: "Napoli",
    shortName: "NAP",
    country: "Italy",
    city: "Naples",
    foundedYear: 1926,
    primaryColor: "#00A3E0",
    secondaryColor: "#FFFFFF",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/SSC_Napoli_logo.svg/1280px-SSC_Napoli_logo.svg.png",
    description: "La Società Sportiva Calcio Napoli es famoso por haber sido el club de Diego Armando Maradona. Campeón de la Serie A en 2023, su estadio es el Diego Armando Maradona."
  },
  {
    name: "AS Roma",
    shortName: "ROM",
    country: "Italy",
    city: "Rome",
    foundedYear: 1927,
    primaryColor: "#D91A2B",
    secondaryColor: "#FFD700",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/AS_Roma_logo.svg/1280px-AS_Roma_logo.svg.png",
    description: "La Associazione Sportiva Roma es uno de los grandes de Italia. Ganó la Serie A en 1942, 1983 y 2001, y fue subcampeón de la Champions League en 1984."
  },
  {
    name: "Lazio",
    shortName: "LAZ",
    country: "Italy",
    city: "Rome",
    foundedYear: 1900,
    primaryColor: "#0091CD",
    secondaryColor: "#FFFFFF",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/SS_Lazio_logo.svg/1280px-SS_Lazio_logo.svg.png",
    description: "La Società Sportiva Lazio comparte el estadio Olímpico con la Roma. Ganó la Serie A en 1974 y 2000, y la Recopa de Europa en 1999."
  },
  {
    name: "Atalanta",
    shortName: "ATA",
    country: "Italy",
    city: "Bergamo",
    foundedYear: 1907,
    primaryColor: "#0B2B5C",
    secondaryColor: "#0B0B0B",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Atalanta_BC_logo.svg/1280px-Atalanta_BC_logo.svg.png",
    description: "L'Atalanta Bergamasca Calcio es conocida por su increíble cantera y juego ofensivo. Ganó la Europa League en 2024 y es un habitual en competiciones europeas."
  },
  {
    name: "Fiorentina",
    shortName: "FIO",
    country: "Italy",
    city: "Florence",
    foundedYear: 1926,
    primaryColor: "#4B0082",
    secondaryColor: "#FFD700",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/ACF_Fiorentina_logo.svg/1280px-ACF_Fiorentina_logo.svg.png",
    description: "La ACF Fiorentina es conocida como 'La Viola' por su camiseta púrpura. Su estadio es el Artemio Franchi y fue campeón de Serie A en 1956 y 1969."
  },
  {
    name: "Bologna",
    shortName: "BOL",
    country: "Italy",
    city: "Bologna",
    foundedYear: 1909,
    primaryColor: "#E20A0A",
    secondaryColor: "#0B0B3F",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bologna_FC_logo.svg/1280px-Bologna_FC_logo.svg.png",
    description: "El Bologna Football Club 1909 tiene 7 títulos de Serie A, siendo uno de los clubes históricos de Italia. Su estadio es el Renato Dall'Ara."
  },
  {
    name: "Torino",
    shortName: "TOR",
    country: "Italy",
    city: "Turin",
    foundedYear: 1906,
    primaryColor: "#6C0D13",
    secondaryColor: "#FFFFFF",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Torino_FC_logo.svg/1280px-Torino_FC_logo.svg.png",
    description: "El Torino Football Club tiene 7 títulos de Serie A. El club sufrió la tragedia de Superga en 1949 que acabó con todo su equipo legendario."
  },
  {
    name: "Monza",
    shortName: "MON",
    country: "Italy",
    city: "Monza",
    foundedYear: 1912,
    primaryColor: "#E20A0A",
    secondaryColor: "#FFFFFF",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/AC_Monza_logo.svg/1280px-AC_Monza_logo.svg.png",
    description: "El Associazione Calcio Monza es propiedad de Silvio Berlusconi. Ascendió a Serie A por primera vez en su historia en 2022 y se consolidó en la élite."
  },
  {
    name: "Genoa",
    shortName: "GEN",
    country: "Italy",
    city: "Genoa",
    foundedYear: 1893,
    primaryColor: "#0B2B5C",
    secondaryColor: "#E20A0A",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Genoa_CFC_logo.svg/1280px-Genoa_CFC_logo.svg.png",
    description: "El Genoa Cricket and Football Club es el club más antiguo de Italia (1893). Tiene 9 títulos de Serie A, aunque el último fue en 1924."
  },
  {
    name: "Udinese",
    shortName: "UDI",
    country: "Italy",
    city: "Udine",
    foundedYear: 1896,
    primaryColor: "#0B0B0B",
    secondaryColor: "#FFFFFF",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Udinese_Calcio_logo.svg/1280px-Udinese_Calcio_logo.svg.png",
    description: "El Udinese Calcio es conocido por su excelente red de scouting. Ha participado frecuentemente en competiciones europeas desde los años 90."
  },
  {
    name: "Empoli",
    shortName: "EMP",
    country: "Italy",
    city: "Empoli",
    foundedYear: 1920,
    primaryColor: "#0091CD",
    secondaryColor: "#FFFFFF",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Empoli_FC_logo.svg/1280px-Empoli_FC_logo.svg.png",
    description: "El Empoli Football Club es conocido por su cantera y por alternar entre Serie A y Serie B. Su estadio es el Carlo Castellani."
  },
  {
    name: "Hellas Verona",
    shortName: "VER",
    country: "Italy",
    city: "Verona",
    foundedYear: 1903,
    primaryColor: "#0B2B5C",
    secondaryColor: "#FFD700",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Hellas_Verona_logo.svg/1280px-Hellas_Verona_logo.svg.png",
    description: "El Hellas Verona Football Club fue campeón de la Serie A en 1985. Su estadio es el Marc'Antonio Bentegodi, compartido con el Chievo Verona."
  },
  {
    name: "Parma",
    shortName: "PAR",
    country: "Italy",
    city: "Parma",
    foundedYear: 1913,
    primaryColor: "#005C97",
    secondaryColor: "#FFD700",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Parma_Calcio_1913_logo.svg/1280px-Parma_Calcio_1913_logo.svg.png",
    description: "El Parma Calcio 1913 tuvo su época dorada en los 90, ganando múltiples Copas de Europa. Su estadio es el Ennio Tardini."
  },
  {
    name: "Cagliari",
    shortName: "CAG",
    country: "Italy",
    city: "Cagliari",
    foundedYear: 1920,
    primaryColor: "#004D98",
    secondaryColor: "#E20A0A",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Cagliari_Calcio_logo.svg/1280px-Cagliari_Calcio_logo.svg.png",
    description: "El Cagliari Calcio es el principal equipo de Cerdeña. Fue campeón de la Serie A en 1970 con el legendario Gigi Riva."
  },
  {
    name: "Lecce",
    shortName: "LEC",
    country: "Italy",
    city: "Lecce",
    foundedYear: 1908,
    primaryColor: "#FFD700",
    secondaryColor: "#004D98",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/US_Lecce_logo.svg/1280px-US_Lecce_logo.svg.png",
    description: "La Unione Sportiva Lecce es conocido como 'Los Giallorossi'. Su estadio es el Via del Mare y es famoso por su afición apasionada."
  },
  {
    name: "Venezia",
    shortName: "VEN",
    country: "Italy",
    city: "Venice",
    foundedYear: 1907,
    primaryColor: "#0B0B0B",
    secondaryColor: "#FFD700",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Venezia_FC_logo.svg/1280px-Venezia_FC_logo.svg.png",
    description: "El Venezia Football Club es conocido por sus elegantes camisetas. Su estadio es el Pier Luigi Penzo, uno de los más pintorescos de Italia."
  },
  {
    name: "Como",
    shortName: "COM",
    country: "Italy",
    city: "Como",
    foundedYear: 1907,
    primaryColor: "#004D98",
    secondaryColor: "#FFFFFF",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Como_1907_logo.svg/1280px-Como_1907_logo.svg.png",
    description: "El Como 1907 es el equipo del Lago de Como. Propiedad de los futbolistas Cesc Fàbregas y Thierry Henry, regresó a Serie A en 2024."
  }
];

// ============================================================
// SEED PRINCIPAL - SOLO EQUIPOS
// ============================================================
  // Agrega más equipos aquí siguiendo el mismo formato

// ============================================================
// SEED PRINCIPAL - SOLO EQUIPOS
// ============================================================
async function main() {
  console.log('🌱 Iniciando seed de equipos...\n');
  console.log(`📋 Se crearán ${TEAMS_TO_SEED.length} equipos\n`);

  let created = 0;
  let skipped = 0;

  for (const teamData of TEAMS_TO_SEED) {
    const teamSlug = slug(teamData.name);
    
    // Verificar si el equipo ya existe
    const existing = await prisma.team.findUnique({
      where: { slug: teamSlug }
    });

    if (existing) {
      console.log(`⏭️  ${teamData.name} - ya existe (saltando)`);
      skipped++;
      continue;
    }

    // Crear el equipo
    await prisma.team.create({
      data: {
        name: teamData.name,
        shortName: teamData.shortName,
        slug: teamSlug,
        country: teamData.country,
        city: teamData.city,
        foundedYear: teamData.foundedYear,
        primaryColor: teamData.primaryColor,
        secondaryColor: teamData.secondaryColor,
        logoUrl: teamData.logoUrl,
        description: teamData.description,
      }
    });

    console.log(`✅ Creado: ${teamData.name} (${teamData.shortName}) - ${teamData.country}`);
    created++;
  }

  console.log('\n📊 Resumen:');
  console.log(`   ✅ Creados: ${created} equipos`);
  console.log(`   ⏭️  Saltados: ${skipped} equipos (ya existían)`);
  console.log(`   📋 Total procesados: ${TEAMS_TO_SEED.length}`);
  
  console.log('\n✨ Seed completado exitosamente!');
  console.log('\n💡 Nota: Los equipos se han creado sin liga asociada.');
  console.log('   Puedes asignarlos manualmente desde el panel de administración.\n');
}

// Ejecutar seed
main()
  .catch(e => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });