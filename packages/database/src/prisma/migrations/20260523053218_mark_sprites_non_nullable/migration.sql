/*
  Warnings:

  - Made the column `default_sprite` on table `pokemon_forms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image_url` on table `trainer_pokedex` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "game"."pokemon_forms" ALTER COLUMN "default_sprite" SET NOT NULL;

-- AlterTable
ALTER TABLE "projections"."trainer_pokedex" ALTER COLUMN "image_url" SET NOT NULL;
