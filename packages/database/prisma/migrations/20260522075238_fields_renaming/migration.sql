-- CreateEnum
CREATE TYPE "game"."pokemon_classification" AS ENUM ('LEGENDARY', 'MYTHIC');

-- AlterTable
ALTER TABLE "game"."pokemon_species"
RENAME COLUMN "pokemon_class" TO "pokemon_classification";

-- AlterTable
ALTER TABLE "game"."pokemon_species"
ALTER COLUMN "pokemon_classification" TYPE "game"."pokemon_classification" USING CAST(
  CAST("pokemon_classification" AS text) AS "game"."pokemon_classification"
);

-- DropEnum
DROP TYPE "game"."pokemon_class";

-- DropForeignKey
ALTER TABLE "trainer"."tracked_pokemons"
DROP CONSTRAINT "tracked_pokemons_pokemon_id_fkey";

-- AlterTable
ALTER TABLE "trainer"."tracked_pokemons"
RENAME COLUMN "pokemon_id" TO "pokemon_form";

-- AddForeignKey
ALTER TABLE "trainer"."tracked_pokemons" ADD CONSTRAINT "tracked_pokemons_pokemon_form_fkey" FOREIGN KEY ("pokemon_form") REFERENCES "game"."pokemon_forms" ("form") ON DELETE CASCADE ON UPDATE CASCADE;