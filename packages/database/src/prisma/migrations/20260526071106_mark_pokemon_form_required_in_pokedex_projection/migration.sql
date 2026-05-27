/*
  Warnings:

  - Made the column `form_category` on table `pokedex` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "projections"."pokedex" ALTER COLUMN "form_category" SET NOT NULL;
