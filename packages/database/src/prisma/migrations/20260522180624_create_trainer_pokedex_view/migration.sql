-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "views";

-- CreateTable
CREATE TABLE
  "views"."trainer_pokedex" (
    "pokemonRef" TEXT NOT NULL,
    "trainerId" UUID NOT NULL,
    "pokemonName" TEXT NOT NULL,
    "dexNumber" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "shinyImageUrl" TEXT,
    "isTracked" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "trainer_pokedex_pkey" PRIMARY KEY ("trainerId", "pokemonRef")
  );

-- CreateIndex
CREATE INDEX "trainer_pokedex_trainerId_dexNumber_idx" ON "views"."trainer_pokedex" ("trainerId", "dexNumber");