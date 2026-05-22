/*
  Warnings:

  - Made the column `primary_type_id` on table `pokemon_forms` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "game"."pokemon_forms" DROP CONSTRAINT "pokemon_forms_primary_type_id_fkey";

-- DropForeignKey
ALTER TABLE "trainer"."tracked_pokemons" DROP CONSTRAINT "tracked_pokemons_pokemon_id_fkey";

-- AlterTable
ALTER TABLE "game"."pokemon_forms" ALTER COLUMN "primary_type_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "game"."pokemon_forms" ADD CONSTRAINT "pokemon_forms_primary_type_id_fkey" FOREIGN KEY ("primary_type_id") REFERENCES "game"."pokemon_types"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer"."tracked_pokemons" ADD CONSTRAINT "tracked_pokemons_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "game"."pokemon_forms"("form") ON DELETE CASCADE ON UPDATE CASCADE;
