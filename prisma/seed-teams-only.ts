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
    name: "Real Madrid",
    shortName: "RMA",
    country: "Spain",
    city: "Madrid",
    foundedYear: 1902,
    primaryColor: "#FFFFFF",
    secondaryColor: "#FFD700",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Real Madrid Club de Fútbol es el club más laureado del fútbol mundial. Con 15 Copas de Europa, es considerado el mejor club del siglo XX según la FIFA."
  },
  {
    name: "FC Barcelona",
    shortName: "FCB",
    country: "Spain",
    city: "Barcelona",
    foundedYear: 1899,
    primaryColor: "#A50044",
    secondaryColor: "#004D98",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Fútbol Club Barcelona, conocido como Barça, es uno de los clubes más exitosos del mundo. Famoso por su filosofía de juego ofensivo y su cantera, La Masia."
  },
  {
    name: "Atlético Madrid",
    shortName: "ATM",
    country: "Spain",
    city: "Madrid",
    foundedYear: 1903,
    primaryColor: "#FFFFFF",
    secondaryColor: "#CB2027",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Club Atlético de Madrid es un histórico club madrileño, conocido por su garra y pasión bajo el lema 'Nunca dejes de creer'. Ha ganado múltiples títulos de La Liga y Europa League."
  },
  {
    name: "Real Betis",
    shortName: "BET",
    country: "Spain",
    city: "Seville",
    foundedYear: 1907,
    primaryColor: "#FFFFFF",
    secondaryColor: "#008000",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Real Betis Balompié es un club sevillano con una enorme afición. Su estadio, el Benito Villamarín, es conocido por su increíble ambiente."
  },
  {
    name: "Sevilla FC",
    shortName: "SFC",
    country: "Spain",
    city: "Seville",
    foundedYear: 1890,
    primaryColor: "#FFFFFF",
    secondaryColor: "#C8102E",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Sevilla FC es el club más laureado de la UEFA Europa League con 7 títulos. Es conocido por su exitosa política de fichajes y su gran cantera."
  },
  {
    name: "Valencia CF",
    shortName: "VCF",
    country: "Spain",
    city: "Valencia",
    foundedYear: 1919,
    primaryColor: "#FFFFFF",
    secondaryColor: "#FF8C00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Valencia Club de Fútbol es uno de los grandes del fútbol español. Ha ganado múltiples títulos de La Liga y fue subcampeón de la Champions League en 2000 y 2001."
  },
  {
    name: "Villarreal CF",
    shortName: "VIL",
    country: "Spain",
    city: "Villarreal",
    foundedYear: 1923,
    primaryColor: "#FFD700",
    secondaryColor: "#000080",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Villarreal Club de Fútbol, conocido como el 'Submarino Amarillo', ganó la Europa League en 2021 y ha sido un habitual en competiciones europeas."
  },
  {
    name: "Athletic Bilbao",
    shortName: "ATH",
    country: "Spain",
    city: "Bilbao",
    foundedYear: 1898,
    primaryColor: "#E10213",
    secondaryColor: "#FFFFFF",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Athletic Club es famoso por su política de solo jugadores vascos. Es uno de los clubes más antiguos de España y nunca ha descendido de Primera División."
  },
  {
    name: "Real Sociedad",
    shortName: "RSO",
    country: "Spain",
    city: "San Sebastián",
    foundedYear: 1909,
    primaryColor: "#FFFFFF",
    secondaryColor: "#0066B2",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "La Real Sociedad es un club vasco con gran tradición en el fútbol español. Ganó La Liga en 1981 y 1982 y es conocido por su excelente cantera."
  },
  {
    name: "CA Osasuna",
    shortName: "OSA",
    country: "Spain",
    city: "Pamplona",
    foundedYear: 1920,
    primaryColor: "#E10213",
    secondaryColor: "#004D98",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Club Atlético Osasuna es el único equipo de Primera División de Navarra. Su estadio, El Sadar, es famoso por su ambiente y su afición apasionada."
  },
  {
    name: "RC Celta de Vigo",
    shortName: "CEL",
    country: "Spain",
    city: "Vigo",
    foundedYear: 1923,
    primaryColor: "#00BFFF",
    secondaryColor: "#FFFFFF",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Real Club Celta de Vigo es un histórico club gallego. Es conocido por su estilo ofensivo y por su legendaria rivalidad con el Deportivo de La Coruña."
  },
  {
    name: "Deportivo Alavés",
    shortName: "ALA",
    country: "Spain",
    city: "Vitoria-Gasteiz",
    foundedYear: 1921,
    primaryColor: "#FFFFFF",
    secondaryColor: "#0066B2",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Deportivo Alavés es un club vasco que fue subcampeón de la UEFA Cup en 2001. Juega en el estadio Mendizorrotza."
  },
  {
    name: "RCD Mallorca",
    shortName: "MLL",
    country: "Spain",
    city: "Palma de Mallorca",
    foundedYear: 1916,
    primaryColor: "#E10213",
    secondaryColor: "#000000",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Real Club Deportivo Mallorca es el principal equipo de las Islas Baleares. Ha jugado en Primera División durante gran parte de su historia."
  },
  {
    name: "Rayo Vallecano",
    shortName: "RAY",
    country: "Spain",
    city: "Madrid",
    foundedYear: 1924,
    primaryColor: "#FFFFFF",
    secondaryColor: "#E10213",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Rayo Vallecano es un club madrileño conocido por su afición humilde y apasionada. Su estadio, el Campo de Fútbol de Vallecas, tiene un ambiente único."
  },
  {
    name: "Getafe CF",
    shortName: "GET",
    country: "Spain",
    city: "Getafe",
    foundedYear: 1983,
    primaryColor: "#0066B2",
    secondaryColor: "#FFFFFF",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Getafe Club de Fútbol es el club más joven de La Liga. A pesar de su corta historia, ha participado en competiciones europeas."
  },
  {
    name: "UD Las Palmas",
    shortName: "LPA",
    country: "Spain",
    city: "Las Palmas",
    foundedYear: 1949,
    primaryColor: "#FFD700",
    secondaryColor: "#0066B2",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "La Unión Deportiva Las Palmas es el principal equipo de las Islas Canarias. Su estadio, el Estadio Gran Canaria, tiene capacidad para más de 32,000 espectadores."
  },
  {
    name: "CD Leganés",
    shortName: "LEG",
    country: "Spain",
    city: "Leganés",
    foundedYear: 1928,
    primaryColor: "#FFFFFF",
    secondaryColor: "#004D98",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Club Deportivo Leganés es un club modesto de la Comunidad de Madrid. Su estadio, Butarque, es conocido por su ambiente cercano."
  },
  {
    name: "Real Valladolid",
    shortName: "VLD",
    country: "Spain",
    city: "Valladolid",
    foundedYear: 1928,
    primaryColor: "#FFFFFF",
    secondaryColor: "#800080",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Real Valladolid Club de Fútbol es un club castellano-leonés con gran tradición en el fútbol español. Su estadio es el José Zorrilla."
  },
  {
    name: "SD Eibar",
    shortName: "EIB",
    country: "Spain",
    city: "Eibar",
    foundedYear: 1940,
    primaryColor: "#0066B2",
    secondaryColor: "#E10213",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "La Sociedad Deportiva Eibar es conocido por tener uno de los estadios más pequeños de La Liga, Ipurúa, con capacidad para solo 8,000 espectadores."
  },
  {
    name: "Girona FC",
    shortName: "GIR",
    country: "Spain",
    city: "Girona",
    foundedYear: 1930,
    primaryColor: "#E10213",
    secondaryColor: "#FFFFFF",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Real_Madrid_CF_Logo.svg/1280px-Real_Madrid_CF_Logo.svg.png",
    description: "El Girona Futbol Club es un club catalán que ha logrado establecerse en Primera División. Su estadio es el Montilivi."
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