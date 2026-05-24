/*
  Warnings:

  - Added the required column `primary_type` to the `trainer_pokedex` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projections"."trainer_pokedex" ADD COLUMN     "primary_type" TEXT NOT NULL,
ADD COLUMN     "secondary_type" TEXT;
