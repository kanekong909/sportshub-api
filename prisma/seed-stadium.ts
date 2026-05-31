// prisma/seed-stadiums-serie-a.ts
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

// ============================================================
// ESTADIOS DE LA SERIE A 2024/25
// ============================================================
const STADIUMS = [
  {
    name: "San Siro",
    capacity: 80018,
    city: "Milan",
    country: "Italy",
    inaugurated: 1926,
    lastRenovated: 2015,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/San_Siro_2024.jpg/1280px-San_Siro_2024.jpg",
    latitude: 45.4781,
    longitude: 9.1240,
    description: "Estadio emblemático compartido por Inter y AC Milan. Es el estadio más grande de Italia."
  },
  {
    name: "Allianz Stadium",
    capacity: 41507,
    city: "Turin",
    country: "Italy",
    inaugurated: 2011,
    lastRenovated: 2023,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Allianz_Stadium_Juventus.jpg/1280px-Allianz_Stadium_Juventus.jpg",
    latitude: 45.1097,
    longitude: 7.6413,
    description: "Estadio moderno de la Juventus, inaugurado en 2011."
  },
  {
    name: "Stadio Diego Armando Maradona",
    capacity: 54726,
    city: "Naples",
    country: "Italy",
    inaugurated: 1959,
    lastRenovated: 2020,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Stadio_San_Paolo_2018.jpg/1280px-Stadio_San_Paolo_2018.jpg",
    latitude: 40.8279,
    longitude: 14.1930,
    description: "Estadio del Napoli, rebautizado en honor a Diego Armando Maradona."
  },
  {
    name: "Stadio Olimpico",
    capacity: 70634,
    city: "Rome",
    country: "Italy",
    inaugurated: 1937,
    lastRenovated: 2020,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Stadio_Olimpico_Roma_2024.jpg/1280px-Stadio_Olimpico_Roma_2024.jpg",
    latitude: 41.9341,
    longitude: 12.4548,
    description: "Estadio compartido por Roma y Lazio. Fue sede de la final del Mundial 1990."
  },
  {
    name: "Gewiss Stadium",
    capacity: 21237,
    city: "Bergamo",
    country: "Italy",
    inaugurated: 1928,
    lastRenovated: 2023,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Gewiss_Stadium_2023.jpg/1280px-Gewiss_Stadium_2023.jpg",
    latitude: 45.7110,
    longitude: 9.6808,
    description: "Estadio del Atalanta. Completamente renovado."
  },
  {
    name: "Stadio Artemio Franchi",
    capacity: 43147,
    city: "Florence",
    country: "Italy",
    inaugurated: 1931,
    lastRenovated: 2019,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Stadio_Artemio_Franchi_2020.jpg/1280px-Stadio_Artemio_Franchi_2020.jpg",
    latitude: 43.7795,
    longitude: 11.2826,
    description: "Estadio de la Fiorentina. Famosa torre de mármol diseñada por Pier Luigi Nervi."
  },
  {
    name: "Stadio Renato Dall'Ara",
    capacity: 38279,
    city: "Bologna",
    country: "Italy",
    inaugurated: 1927,
    lastRenovated: 2015,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Stadio_Renato_Dall%27Ara_2021.jpg/1280px-Stadio_Renato_Dall%27Ara_2021.jpg",
    latitude: 44.4939,
    longitude: 11.3095,
    description: "Estadio del Bologna."
  },
  {
    name: "Stadio Via del Mare",
    capacity: 31559,
    city: "Lecce",
    country: "Italy",
    inaugurated: 1966,
    lastRenovated: 2019,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Via_del_Mare_2022.jpg/1280px-Via_del_Mare_2022.jpg",
    latitude: 40.3636,
    longitude: 18.1839,
    description: "Estadio del Lecce."
  },
  {
    name: "Stadio Marcantonio Bentegodi",
    capacity: 39211,
    city: "Verona",
    country: "Italy",
    inaugurated: 1963,
    lastRenovated: 2018,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bentegodi_Verona.jpg/1280px-Bentegodi_Verona.jpg",
    latitude: 45.4366,
    longitude: 10.9683,
    description: "Estadio del Hellas Verona."
  },
  {
    name: "Stadio Ennio Tardini",
    capacity: 27306,
    city: "Parma",
    country: "Italy",
    inaugurated: 1923,
    lastRenovated: 2019,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Stadio_Tardini_2022.jpg/1280px-Stadio_Tardini_2022.jpg",
    latitude: 44.7903,
    longitude: 10.3364,
    description: "Estadio del Parma."
  },
  {
    name: "Stadio Luigi Ferraris",
    capacity: 36499,
    city: "Genoa",
    country: "Italy",
    inaugurated: 1911,
    lastRenovated: 2018,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Luigi_Ferraris_2023.jpg/1280px-Luigi_Ferraris_2023.jpg",
    latitude: 44.4165,
    longitude: 8.9525,
    description: "Estadio del Genoa, uno de los más antiguos de Italia."
  },
  {
    name: "Stadio Friuli",
    capacity: 25144,
    city: "Udine",
    country: "Italy",
    inaugurated: 1976,
    lastRenovated: 2016,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Stadio_Friuli_2022.jpg/1280px-Stadio_Friuli_2022.jpg",
    latitude: 46.0819,
    longitude: 13.2004,
    description: "Estadio del Udinese."
  },
  {
    name: "Stadio Carlo Castellani",
    capacity: 16284,
    city: "Empoli",
    country: "Italy",
    inaugurated: 1965,
    lastRenovated: 2019,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Carlo_Castellani_2021.jpg/1280px-Carlo_Castellani_2021.jpg",
    latitude: 43.7192,
    longitude: 10.9664,
    description: "Estadio del Empoli."
  },
  {
    name: "Stadio Pier Luigi Penzo",
    capacity: 11150,
    city: "Venice",
    country: "Italy",
    inaugurated: 1913,
    lastRenovated: 2015,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Pier_Luigi_Penzo_2023.jpg/1280px-Pier_Luigi_Penzo_2023.jpg",
    latitude: 45.4370,
    longitude: 12.3162,
    description: "Estadio del Venezia, el segundo más antiguo de Italia."
  },
  {
    name: "Stadio Giuseppe Sinigaglia",
    capacity: 13602,
    city: "Como",
    country: "Italy",
    inaugurated: 1927,
    lastRenovated: 2023,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sinigaglia_Como_2024.jpg/1280px-Sinigaglia_Como_2024.jpg",
    latitude: 45.8120,
    longitude: 9.0800,
    description: "Estadio del Como, a orillas del Lago de Como."
  },
  {
    name: "Unipol Domus",
    capacity: 16200,
    city: "Cagliari",
    country: "Italy",
    inaugurated: 2017,
    lastRenovated: 2021,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Unipol_Domus_2022.jpg/1280px-Unipol_Domus_2022.jpg",
    latitude: 39.2175,
    longitude: 9.1150,
    description: "Estadio moderno del Cagliari."
  },
  {
    name: "Stadio Mapei - Città del Tricolore",
    capacity: 21525,
    city: "Reggio Emilia",
    country: "Italy",
    inaugurated: 1995,
    lastRenovated: 2013,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Mapei_Stadium_2023.jpg/1280px-Mapei_Stadium_2023.jpg",
    latitude: 44.7139,
    longitude: 10.6361,
    description: "Estadio del Sassuolo."
  },
  {
    name: "Stadio Benito Stirpe",
    capacity: 16227,
    city: "Frosinone",
    country: "Italy",
    inaugurated: 2017,
    lastRenovated: 2023,
    surface: "Grass",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Benito_Stirpe_2022.jpg/1280px-Benito_Stirpe_2022.jpg",
    latitude: 41.6269,
    longitude: 13.3283,
    description: "Estadio moderno del Frosinone."
  }
];

// ============================================================
// SEED PRINCIPAL
// ============================================================
async function main() {
  console.log('🏟️  Iniciando seed de estadios de la Serie A...\n');
  console.log(`📋 Se crearán ${STADIUMS.length} estadios\n`);

  let created = 0;
  let skipped = 0;

  for (const stadiumData of STADIUMS) {
    const existing = await prisma.stadium.findFirst({
      where: { name: stadiumData.name }
    });

    if (existing) {
      console.log(`⏭️  ${stadiumData.name} - ya existe (saltando)`);
      skipped++;
      continue;
    }

    await prisma.stadium.create({
      data: {
        name: stadiumData.name,
        capacity: stadiumData.capacity,
        city: stadiumData.city,
        country: stadiumData.country,
        inaugurated: stadiumData.inaugurated,
        lastRenovated: stadiumData.lastRenovated,
        surface: stadiumData.surface,
        imageUrl: stadiumData.imageUrl,
        latitude: stadiumData.latitude,
        longitude: stadiumData.longitude,
        description: stadiumData.description
      }
    });

    console.log(`✅ Creado: ${stadiumData.name} (${stadiumData.capacity.toLocaleString()} espectadores) - ${stadiumData.city}`);
    created++;
  }

  console.log('\n📊 Resumen:');
  console.log(`   ✅ Creados: ${created} estadios`);
  console.log(`   ⏭️  Saltados: ${skipped} estadios (ya existían)`);
  console.log(`   📋 Total procesados: ${STADIUMS.length}`);
  
  console.log('\n✨ Seed de estadios de la Serie A completado exitosamente!');
  console.log('\n💡 Después de crear los estadios, puedes asignarlos manualmente:');
  console.log('   1. Desde el panel de administración');
  console.log('   2. O actualizando directamente en la base de datos:');
  console.log('      UPDATE teams SET "stadiumId" = (SELECT id FROM stadiums WHERE name = "San Siro") WHERE name = "Inter Milan";\n');
}

main()
  .catch(e => {
    console.error('❌ Error en seed de estadios:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });