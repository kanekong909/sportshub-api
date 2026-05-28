// ============================================================
// SportsHub — Seed inicial
// Puebla la DB con deportes, ligas, equipos, estadios y jugadores
// Usa TheSportsDB (gratis) para logos e imágenes
// ============================================================

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

// ---- Helper: fetch con timeout ----
async function fetchJSON(url: string): Promise<any> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ---- TheSportsDB helpers ----
const TSDB = 'https://www.thesportsdb.com/api/v1/json/3';

async function getTeamFromTSDB(teamName: string) {
  const data = await fetchJSON(`${TSDB}/searchteams.php?t=${encodeURIComponent(teamName)}`);
  return data?.teams?.[0] ?? null;
}

async function getPlayersByTeamTSDB(teamName: string) {
  const data = await fetchJSON(`${TSDB}/searchplayers.php?t=${encodeURIComponent(teamName)}`);
  return data?.player ?? [];
}

// ---- Slugify ----
function slug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ============================================================
// DATOS MAESTROS
// ============================================================

const SPORTS = [
  { name: 'Soccer',   slug: 'soccer' },
  { name: 'NBA',      slug: 'nba'    },
  { name: 'NFL',      slug: 'nfl'    },
];

const LEAGUES = [
  { name: 'LaLiga',        slug: 'laliga',    country: 'Spain',  sport: 'soccer', season: '2024-25' },
  { name: 'Premier League',slug: 'premier',   country: 'England',sport: 'soccer', season: '2024-25' },
  { name: 'UEFA Champions',slug: 'ucl',       country: null,     sport: 'soccer', season: '2024-25' },
  { name: 'NBA',           slug: 'nba-league',country: 'USA',    sport: 'nba',    season: '2024-25' },
  { name: 'NFL',           slug: 'nfl-league',country: 'USA',    sport: 'nfl',    season: '2024-25' },
];

// Posiciones por deporte
const POSITIONS = {
  soccer: [
    { name: 'Goalkeeper',        code: 'GK',  group: 'Goalkeeper' },
    { name: 'Defender',          code: 'DEF', group: 'Defender'   },
    { name: 'Midfielder',        code: 'MID', group: 'Midfielder' },
    { name: 'Forward',           code: 'FWD', group: 'Forward'    },
  ],
  nba: [
    { name: 'Point Guard',       code: 'PG',  group: 'Guard'      },
    { name: 'Shooting Guard',    code: 'SG',  group: 'Guard'      },
    { name: 'Small Forward',     code: 'SF',  group: 'Forward'    },
    { name: 'Power Forward',     code: 'PF',  group: 'Forward'    },
    { name: 'Center',            code: 'C',   group: 'Center'     },
  ],
  nfl: [
    { name: 'Quarterback',       code: 'QB',  group: 'Offense'    },
    { name: 'Running Back',      code: 'RB',  group: 'Offense'    },
    { name: 'Wide Receiver',     code: 'WR',  group: 'Offense'    },
    { name: 'Tight End',         code: 'TE',  group: 'Offense'    },
    { name: 'Linebacker',        code: 'LB',  group: 'Defense'    },
    { name: 'Cornerback',        code: 'CB',  group: 'Defense'    },
  ],
};

// Equipos con sus datos base y jugadores destacados
const TEAMS_DATA = [
  // ---- SOCCER ----
  {
    sport: 'soccer', league: 'laliga',
    name: 'Real Madrid', shortName: 'RM', country: 'Spain', city: 'Madrid',
    primaryColor: '#FFFFFF', secondaryColor: '#FFD700',
    foundedYear: 1902,
    description: 'El Real Madrid Club de Fútbol es el club con más Copas de Europa/Champions League de la historia. Fundado en 1902 en Madrid, España.',
    tsdbName: 'Real Madrid',
    stadium: { name: 'Santiago Bernabéu', capacity: 81044, inaugurated: 1947, lastRenovated: 2023, surface: 'Hybrid', city: 'Madrid', country: 'Spain' },
    titles: [
      { name: 'UEFA Champions League', year: 2024 },
      { name: 'UEFA Champions League', year: 2022 },
      { name: 'LaLiga', year: 2024 },
      { name: 'LaLiga', year: 2022 },
    ],
    history: [
      { year: 1902, event: 'Fundación del club' },
      { year: 1947, event: 'Inauguración del Santiago Bernabéu' },
      { year: 1956, event: 'Primera Copa de Europa' },
      { year: 2024, event: 'Champions League número 15' },
    ],
    players: [
      { firstName: 'Thibaut',   lastName: 'Courtois',  jersey: 1,  position: 'GK',  nationality: 'Belgian',   height: 199, weight: 96  },
      { firstName: 'Dani',      lastName: 'Carvajal',  jersey: 2,  position: 'DEF', nationality: 'Spanish',   height: 173, weight: 73  },
      { firstName: 'David',     lastName: 'Alaba',     jersey: 4,  position: 'DEF', nationality: 'Austrian',  height: 180, weight: 80  },
      { firstName: 'Antonio',   lastName: 'Rüdiger',   jersey: 22, position: 'DEF', nationality: 'German',    height: 190, weight: 85  },
      { firstName: 'Ferland',   lastName: 'Mendy',     jersey: 23, position: 'DEF', nationality: 'French',    height: 180, weight: 75  },
      { firstName: 'Toni',      lastName: 'Kroos',     jersey: 8,  position: 'MID', nationality: 'German',    height: 183, weight: 76  },
      { firstName: 'Luka',      lastName: 'Modrić',    jersey: 10, position: 'MID', nationality: 'Croatian',  height: 172, weight: 66  },
      { firstName: 'Fede',      lastName: 'Valverde',  jersey: 15, position: 'MID', nationality: 'Uruguayan', height: 182, weight: 78  },
      { firstName: 'Jude',      lastName: 'Bellingham',jersey: 5,  position: 'MID', nationality: 'English',   height: 186, weight: 75  },
      { firstName: 'Vinícius',  lastName: 'Jr.',       jersey: 7,  position: 'FWD', nationality: 'Brazilian', height: 176, weight: 73  },
      { firstName: 'Kylian',    lastName: 'Mbappé',    jersey: 9,  position: 'FWD', nationality: 'French',    height: 178, weight: 73  },
    ],
  },
  {
    sport: 'soccer', league: 'laliga',
    name: 'FC Barcelona', shortName: 'FCB', country: 'Spain', city: 'Barcelona',
    primaryColor: '#A50044', secondaryColor: '#004D98',
    foundedYear: 1899,
    description: 'El Fútbol Club Barcelona, conocido como el Barça, es uno de los clubes más laureados del mundo y símbolo del catalanismo.',
    tsdbName: 'Barcelona',
    stadium: { name: 'Spotify Camp Nou', capacity: 99354, inaugurated: 1957, lastRenovated: 2024, surface: 'Grass', city: 'Barcelona', country: 'Spain' },
    titles: [
      { name: 'UEFA Champions League', year: 2015 },
      { name: 'LaLiga', year: 2023 },
    ],
    history: [
      { year: 1899, event: 'Fundación por Joan Gamper' },
      { year: 1957, event: 'Inauguración del Camp Nou' },
      { year: 2009, event: 'Primer Sextete de la historia' },
      { year: 2023, event: 'LaLiga con 88 puntos bajo Xavi' },
    ],
    players: [
      { firstName: 'Marc-André', lastName: 'ter Stegen', jersey: 1,  position: 'GK',  nationality: 'German',    height: 187, weight: 85 },
      { firstName: 'Ronald',     lastName: 'Araújo',     jersey: 4,  position: 'DEF', nationality: 'Uruguayan', height: 188, weight: 88 },
      { firstName: 'Pedri',      lastName: 'González',   jersey: 8,  position: 'MID', nationality: 'Spanish',   height: 174, weight: 60 },
      { firstName: 'Gavi',       lastName: 'Páez',       jersey: 6,  position: 'MID', nationality: 'Spanish',   height: 173, weight: 60 },
      { firstName: 'Lamine',     lastName: 'Yamal',      jersey: 19, position: 'FWD', nationality: 'Spanish',   height: 176, weight: 68 },
      { firstName: 'Robert',     lastName: 'Lewandowski', jersey: 9, position: 'FWD', nationality: 'Polish',    height: 185, weight: 81 },
    ],
  },
  {
    sport: 'soccer', league: 'premier',
    name: 'Manchester City', shortName: 'MCI', country: 'England', city: 'Manchester',
    primaryColor: '#6CABDD', secondaryColor: '#1C2C5B',
    foundedYear: 1880,
    description: 'El Manchester City es el club dominante del fútbol inglés en la era moderna bajo la dirección de Pep Guardiola.',
    tsdbName: 'Manchester City',
    stadium: { name: 'Etihad Stadium', capacity: 53400, inaugurated: 2003, surface: 'Grass', city: 'Manchester', country: 'England' },
    titles: [
      { name: 'UEFA Champions League', year: 2023 },
      { name: 'Premier League', year: 2024 },
    ],
    history: [
      { year: 1880, event: 'Fundación como St. Marks Church' },
      { year: 2008, event: 'Adquisición por Abu Dhabi United Group' },
      { year: 2023, event: 'Primer Triplete en la historia del club' },
    ],
    players: [
      { firstName: 'Ederson',   lastName: 'Moraes',    jersey: 31, position: 'GK',  nationality: 'Brazilian', height: 188, weight: 89 },
      { firstName: 'Rúben',     lastName: 'Dias',      jersey: 3,  position: 'DEF', nationality: 'Portuguese',height: 187, weight: 76 },
      { firstName: 'Kevin',     lastName: 'De Bruyne', jersey: 17, position: 'MID', nationality: 'Belgian',   height: 181, weight: 68 },
      { firstName: 'Phil',      lastName: 'Foden',     jersey: 47, position: 'MID', nationality: 'English',   height: 171, weight: 70 },
      { firstName: 'Erling',    lastName: 'Haaland',   jersey: 9,  position: 'FWD', nationality: 'Norwegian', height: 194, weight: 88 },
    ],
  },
  // ---- NBA ----
  {
    sport: 'nba', league: 'nba-league',
    name: 'Los Angeles Lakers', shortName: 'LAL', country: 'USA', city: 'Los Angeles',
    primaryColor: '#552583', secondaryColor: '#FDB927',
    foundedYear: 1947,
    description: 'Los Lakers son el equipo más icónico de la NBA con 17 campeonatos, hogar de leyendas como Magic Johnson, Kareem, Shaq, Kobe y LeBron.',
    tsdbName: 'Los Angeles Lakers',
    stadium: { name: 'Crypto.com Arena', capacity: 19079, inaugurated: 1999, surface: 'Hardwood', city: 'Los Angeles', country: 'USA' },
    titles: [
      { name: 'NBA Championship', year: 2020 },
      { name: 'NBA Championship', year: 2010 },
    ],
    history: [
      { year: 1947, event: 'Fundación como Minneapolis Lakers' },
      { year: 1960, event: 'Traslado a Los Ángeles' },
      { year: 1972, event: 'Primer campeonato en LA' },
      { year: 2020, event: 'Campeonato número 17 en honor a Kobe' },
    ],
    players: [
      { firstName: 'LeBron',    lastName: 'James',    jersey: 23, position: 'SF', nationality: 'American', height: 206, weight: 113 },
      { firstName: 'Anthony',   lastName: 'Davis',    jersey: 3,  position: 'PF', nationality: 'American', height: 208, weight: 115 },
      { firstName: 'Austin',    lastName: 'Reaves',   jersey: 15, position: 'SG', nationality: 'American', height: 196, weight: 90  },
      { firstName: "D'Angelo",  lastName: 'Russell',  jersey: 1,  position: 'PG', nationality: 'American', height: 193, weight: 84  },
    ],
  },
  {
    sport: 'nba', league: 'nba-league',
    name: 'Golden State Warriors', shortName: 'GSW', country: 'USA', city: 'San Francisco',
    primaryColor: '#1D428A', secondaryColor: '#FFC72C',
    foundedYear: 1946,
    description: 'Los Warriors son la dinastía NBA de los 2010s con 4 campeonatos en 8 años, liderados por el mejor tirador de la historia, Stephen Curry.',
    tsdbName: 'Golden State Warriors',
    stadium: { name: 'Chase Center', capacity: 18064, inaugurated: 2019, surface: 'Hardwood', city: 'San Francisco', country: 'USA' },
    titles: [
      { name: 'NBA Championship', year: 2022 },
      { name: 'NBA Championship', year: 2018 },
    ],
    history: [
      { year: 1946, event: 'Fundación en Philadelphia' },
      { year: 1962, event: 'Traslado a San Francisco' },
      { year: 2015, event: 'Inicio de la dinastía Warriors' },
      { year: 2022, event: 'Cuarto campeonato en 8 años' },
    ],
    players: [
      { firstName: 'Stephen',   lastName: 'Curry',    jersey: 30, position: 'PG', nationality: 'American', height: 188, weight: 84 },
      { firstName: 'Klay',      lastName: 'Thompson', jersey: 11, position: 'SG', nationality: 'American', height: 198, weight: 98 },
      { firstName: 'Draymond',  lastName: 'Green',    jersey: 23, position: 'PF', nationality: 'American', height: 198, weight: 104 },
      { firstName: 'Andrew',    lastName: 'Wiggins',  jersey: 22, position: 'SF', nationality: 'Canadian', height: 201, weight: 88 },
    ],
  },
  // ---- NFL ----
  {
    sport: 'nfl', league: 'nfl-league',
    name: 'Kansas City Chiefs', shortName: 'KC', country: 'USA', city: 'Kansas City',
    primaryColor: '#E31837', secondaryColor: '#FFB81C',
    foundedYear: 1960,
    description: 'Los Chiefs son la franquicia dominante de la NFL moderna con Patrick Mahomes, ganadores de 4 Super Bowls incluyendo 3 consecutivos.',
    tsdbName: 'Kansas City Chiefs',
    stadium: { name: 'GEHA Field at Arrowhead Stadium', capacity: 76416, inaugurated: 1972, surface: 'Grass', city: 'Kansas City', country: 'USA' },
    titles: [
      { name: 'Super Bowl', year: 2024 },
      { name: 'Super Bowl', year: 2023 },
      { name: 'Super Bowl', year: 2020 },
    ],
    history: [
      { year: 1960, event: 'Fundación como Dallas Texans' },
      { year: 1963, event: 'Traslado a Kansas City' },
      { year: 1970, event: 'Primer Super Bowl' },
      { year: 2024, event: 'Tres Super Bowls consecutivos' },
    ],
    players: [
      { firstName: 'Patrick',   lastName: 'Mahomes',   jersey: 15, position: 'QB', nationality: 'American', height: 188, weight: 104 },
      { firstName: 'Travis',    lastName: 'Kelce',     jersey: 87, position: 'TE', nationality: 'American', height: 196, weight: 113 },
      { firstName: 'Chris',     lastName: 'Jones',     jersey: 95, position: 'LB', nationality: 'American', height: 198, weight: 137 },
      { firstName: 'Rashee',    lastName: 'Rice',      jersey: 4,  position: 'WR', nationality: 'American', height: 185, weight: 93  },
    ],
  },
  {
    sport: 'nfl', league: 'nfl-league',
    name: 'Philadelphia Eagles', shortName: 'PHI', country: 'USA', city: 'Philadelphia',
    primaryColor: '#004C54', secondaryColor: '#A5ACAF',
    foundedYear: 1933,
    description: 'Los Eagles son una de las franquicias históricas de la NFL con base en Philadelphia, Pensilvania.',
    tsdbName: 'Philadelphia Eagles',
    stadium: { name: 'Lincoln Financial Field', capacity: 69796, inaugurated: 2003, surface: 'Grass', city: 'Philadelphia', country: 'USA' },
    titles: [
      { name: 'Super Bowl', year: 2018 },
    ],
    history: [
      { year: 1933, event: 'Fundación de la franquicia' },
      { year: 2018, event: 'Primer Super Bowl de la historia' },
      { year: 2023, event: 'Llegada al Super Bowl LVII' },
    ],
    players: [
      { firstName: 'Jalen',     lastName: 'Hurts',    jersey: 1,  position: 'QB', nationality: 'American', height: 185, weight: 104 },
      { firstName: 'A.J.',      lastName: 'Brown',    jersey: 11, position: 'WR', nationality: 'American', height: 188, weight: 102 },
      { firstName: 'DeVonta',   lastName: 'Smith',    jersey: 6,  position: 'WR', nationality: 'American', height: 185, weight: 77  },
      { firstName: 'Saquon',    lastName: 'Barkley',  jersey: 26, position: 'RB', nationality: 'American', height: 183, weight: 101 },
    ],
  },
];

// ============================================================
// SEED PRINCIPAL
// ============================================================

async function main() {
  console.log('🌱 Iniciando seed de SportsHub...\n');

  // 1. Deportes
  console.log('📌 Creando deportes...');
  const sportMap: Record<string, string> = {};
  for (const s of SPORTS) {
    const sport = await prisma.sport.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
    sportMap[s.slug] = sport.id;
    console.log(`  ✓ ${s.name}`);
  }

  // 2. Posiciones
  console.log('\n📌 Creando posiciones...');
  const posMap: Record<string, string> = {};
  for (const [sportSlug, positions] of Object.entries(POSITIONS)) {
    const sportId = sportMap[sportSlug];
    for (const pos of positions) {
      const p = await prisma.position.upsert({
        where: { code_sportId: { code: pos.code, sportId } },
        update: {},
        create: { ...pos, sportId },
      });
      posMap[`${sportSlug}_${pos.code}`] = p.id;
    }
  }
  console.log('  ✓ Posiciones Soccer, NBA, NFL');

  // 3. Ligas
  console.log('\n📌 Creando ligas...');
  const leagueMap: Record<string, string> = {};
  for (const l of LEAGUES) {
    const league = await prisma.league.upsert({
      where: { slug: l.slug },
      update: {},
      create: {
        name: l.name,
        slug: l.slug,
        country: l.country,
        season: l.season,
        sportId: sportMap[l.sport],
      },
    });
    leagueMap[l.slug] = league.id;
    console.log(`  ✓ ${l.name}`);
  }

  // 4. Equipos, estadios, jugadores
  console.log('\n📌 Creando equipos y jugadores...');
  for (const t of TEAMS_DATA) {
    process.stdout.write(`  → ${t.name}... `);

    // Intentar obtener logo de TheSportsDB
    let logoUrl: string | null = null;
    const tsdbTeam = await getTeamFromTSDB(t.tsdbName);
    if (tsdbTeam) {
      logoUrl = tsdbTeam.strTeamBadge || tsdbTeam.strTeamLogo || null;
    }

    // Estadio
    const stadium = await prisma.stadium.upsert({
      where: { id: (await prisma.stadium.findFirst({ where: { name: t.stadium.name } }))?.id ?? 'new' },
      update: {},
      create: t.stadium,
    });

    // Equipo
    const team = await prisma.team.upsert({
      where: { slug: slug(t.name) },
      update: { logoUrl },
      create: {
        name: t.name,
        shortName: t.shortName,
        slug: slug(t.name),
        logoUrl,
        primaryColor: t.primaryColor,
        secondaryColor: t.secondaryColor,
        foundedYear: t.foundedYear,
        country: t.country,
        city: t.city,
        description: t.description,
        stadiumId: stadium.id,
      },
    });

    // Relación equipo-liga
    await prisma.teamLeague.upsert({
      where: { teamId_leagueId: { teamId: team.id, leagueId: leagueMap[t.league] } },
      update: {},
      create: { teamId: team.id, leagueId: leagueMap[t.league] },
    });

    // Títulos
    for (const title of t.titles) {
      await prisma.title.create({ data: { ...title, teamId: team.id } }).catch(() => {});
    }

    // Historia
    for (const h of t.history) {
      await prisma.teamHistory.create({ data: { ...h, teamId: team.id } }).catch(() => {});
    }

    // Jugadores
    for (const p of t.players) {
      const posKey = `${t.sport}_${p.position}`;
      const positionId = posMap[posKey];
      const playerSlug = slug(`${p.firstName}-${p.lastName}-${t.shortName}`);

      // Buscar foto en TheSportsDB
      let photoUrl: string | null = null;
      const tsdbPlayers = await getPlayersByTeamTSDB(t.tsdbName);
      const match = tsdbPlayers.find((pl: any) =>
        pl.strPlayer?.toLowerCase().includes(p.lastName.toLowerCase())
      );
      if (match) photoUrl = match.strThumb || match.strCutout || null;

      await prisma.player.upsert({
        where: { slug: playerSlug },
        update: { photoUrl },
        create: {
          firstName: p.firstName,
          lastName: p.lastName,
          slug: playerSlug,
          jerseyNumber: p.jersey,
          nationality: p.nationality,
          height: p.height,
          weight: p.weight,
          photoUrl,
          positionId,
          teamId: team.id,
        },
      });
    }

    console.log(`✓ (logo: ${logoUrl ? 'sí' : 'no'})`);
  }

  // 5. Stats de temporada de ejemplo
  console.log('\n📌 Creando stats de temporada...');
  const statsData = [
    { teamSlug: 'real-madrid',          leagueSlug: 'laliga',      season: '2024-25', played: 31, won: 22, drawn: 5, lost: 4,  goalsFor: 71, goalsAgainst: 28, points: 71, position: 1 },
    { teamSlug: 'fc-barcelona',         leagueSlug: 'laliga',      season: '2024-25', played: 31, won: 21, drawn: 2, lost: 8,  goalsFor: 65, goalsAgainst: 35, points: 65, position: 2 },
    { teamSlug: 'manchester-city',      leagueSlug: 'premier',     season: '2024-25', played: 31, won: 18, drawn: 4, lost: 9,  goalsFor: 60, goalsAgainst: 40, points: 58, position: 4 },
    { teamSlug: 'los-angeles-lakers',   leagueSlug: 'nba-league',  season: '2024-25', played: 72, won: 45, drawn: 0, lost: 27, goalsFor: 0,  goalsAgainst: 0,  points: 45, position: 5 },
    { teamSlug: 'golden-state-warriors',leagueSlug: 'nba-league',  season: '2024-25', played: 72, won: 38, drawn: 0, lost: 34, goalsFor: 0,  goalsAgainst: 0,  points: 38, position: 9 },
    { teamSlug: 'kansas-city-chiefs',   leagueSlug: 'nfl-league',  season: '2024-25', played: 17, won: 15, drawn: 0, lost: 2,  goalsFor: 0,  goalsAgainst: 0,  points: 15, position: 1 },
    { teamSlug: 'philadelphia-eagles',  leagueSlug: 'nfl-league',  season: '2024-25', played: 17, won: 14, drawn: 0, lost: 3,  goalsFor: 0,  goalsAgainst: 0,  points: 14, position: 2 },
  ];

  for (const s of statsData) {
    const team   = await prisma.team.findUnique({ where: { slug: s.teamSlug } });
    const league = await prisma.league.findUnique({ where: { slug: s.leagueSlug } });
    if (!team || !league) continue;
    await prisma.teamSeasonStats.upsert({
      where: { teamId_leagueId_season: { teamId: team.id, leagueId: league.id, season: s.season } },
      update: {},
      create: {
        season:       s.season,
        played:       s.played,
        won:          s.won,
        drawn:        s.drawn,
        lost:         s.lost,
        goalsFor:     s.goalsFor,
        goalsAgainst: s.goalsAgainst,
        points:       s.points,
        position:     s.position,
        teamId:       team.id,
        leagueId:     league.id,
      },
    });
  }
  console.log('  ✓ Stats de temporada 2024-25');

  console.log('\n✅ Seed completado exitosamente!');
  console.log(`   ${TEAMS_DATA.length} equipos · ${TEAMS_DATA.reduce((a,t) => a + t.players.length, 0)} jugadores`);
}

main()
  .catch(e => { console.error('❌ Error en seed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
