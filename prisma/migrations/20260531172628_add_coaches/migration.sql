-- CreateEnum
CREATE TYPE "CoachRole" AS ENUM ('HEAD_COACH', 'ASSISTANT', 'GK_COACH', 'FITNESS', 'ANALYST');

-- CreateTable
CREATE TABLE "coaches" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nationality" TEXT,
    "birthDate" TIMESTAMP(3),
    "birthPlace" TEXT,
    "photoUrl" TEXT,
    "biography" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_season_teams" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "role" "CoachRole" NOT NULL DEFAULT 'HEAD_COACH',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coach_season_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_stats" (
    "id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "played" INTEGER NOT NULL DEFAULT 0,
    "won" INTEGER NOT NULL DEFAULT 0,
    "drawn" INTEGER NOT NULL DEFAULT 0,
    "lost" INTEGER NOT NULL DEFAULT 0,
    "titlesWon" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coachId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "seasonId" TEXT,

    CONSTRAINT "coach_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coaches_slug_key" ON "coaches"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "coach_season_teams_coachId_teamId_seasonId_key" ON "coach_season_teams"("coachId", "teamId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "coach_stats_coachId_teamId_season_key" ON "coach_stats"("coachId", "teamId", "season");

-- AddForeignKey
ALTER TABLE "coach_season_teams" ADD CONSTRAINT "coach_season_teams_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_season_teams" ADD CONSTRAINT "coach_season_teams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_season_teams" ADD CONSTRAINT "coach_season_teams_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_stats" ADD CONSTRAINT "coach_stats_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_stats" ADD CONSTRAINT "coach_stats_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_stats" ADD CONSTRAINT "coach_stats_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
