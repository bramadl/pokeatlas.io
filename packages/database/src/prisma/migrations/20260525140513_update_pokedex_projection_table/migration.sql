-- AlterTable
ALTER TABLE "projections"."pokedex"
ADD COLUMN "is_costume" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "is_temporary_evolution" BOOLEAN NOT NULL DEFAULT false;