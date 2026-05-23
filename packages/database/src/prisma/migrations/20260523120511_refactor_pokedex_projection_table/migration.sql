/*
  Warnings:

  - You are about to drop the column `is_tracked` on the `trainer_pokedex` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projections"."trainer_pokedex" DROP COLUMN "is_tracked",
ADD COLUMN     "tracked_states" TEXT[] DEFAULT ARRAY[]::TEXT[];
