/*
  Warnings:

  - Added the required column `family_id` to the `pokedex` table without a default value. This is not possible if the table is not empty.
  - Added the required column `form` to the `pokedex` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projections"."pokedex" ADD COLUMN     "classification" TEXT,
ADD COLUMN     "family_id" TEXT NOT NULL,
ADD COLUMN     "form" TEXT NOT NULL;
