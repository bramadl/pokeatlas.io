-- AlterTable
ALTER TABLE "views"."trainer_pokedex"
RENAME COLUMN "trainerId" TO "trainer_ref";

ALTER TABLE "views"."trainer_pokedex"
RENAME COLUMN "pokemonRef" TO "pokemon_ref";

ALTER TABLE "views"."trainer_pokedex"
RENAME COLUMN "pokemonName" TO "pokemon_name";

ALTER TABLE "views"."trainer_pokedex"
RENAME COLUMN "dexNumber" TO "dex_number";

ALTER TABLE "views"."trainer_pokedex"
RENAME COLUMN "imageUrl" TO "image_url";

ALTER TABLE "views"."trainer_pokedex"
RENAME COLUMN "shinyImageUrl" TO "shiny_image_url";

ALTER TABLE "views"."trainer_pokedex"
RENAME COLUMN "isTracked" TO "is_tracked";

ALTER TABLE "views"."trainer_pokedex"
RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "views"."trainer_pokedex"
RENAME COLUMN "updatedAt" TO "updated_at";

-- AlterTable
UPDATE "views"."trainer_pokedex"
SET
  "is_tracked" = FALSE
WHERE
  "is_tracked" IS NULL;

ALTER TABLE "views"."trainer_pokedex"
ALTER COLUMN "is_tracked"
SET
  NOT NULL;

-- AlterTable
ALTER TABLE "views"."trainer_pokedex"
DROP CONSTRAINT "trainer_pokedex_pkey";

ALTER TABLE "views"."trainer_pokedex" ADD CONSTRAINT "trainer_pokedex_pkey" PRIMARY KEY ("trainer_ref", "pokemon_ref");

-- DropForeignKey
DROP INDEX IF EXISTS "views"."trainer_pokedex_trainerId_dexNumber_idx";

CREATE INDEX "trainer_pokedex_trainer_ref_dex_number_idx" ON "views"."trainer_pokedex" ("trainer_ref", "dex_number");