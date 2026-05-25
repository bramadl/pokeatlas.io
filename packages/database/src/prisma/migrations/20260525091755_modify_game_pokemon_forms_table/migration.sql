-- CreateEnum
CREATE TYPE "game"."form_category" AS ENUM (
  'ALTERNATE_FORM',
  'BASE_FORM',
  'COSTUME_VARIANT',
  'FEMALE_VARIANT',
  'TEMPORARY_EVOLUTION_FORM',
  'REGIONAL_VARIANT'
);

-- AlterEnum
ALTER TYPE "game"."pokemon_classification" ADD VALUE 'ULTRA_BEAST';

-- AlterTable
ALTER TABLE "game"."pokemon_forms"
DROP COLUMN "is_costume",
DROP COLUMN "is_temporary_evolution",
ADD COLUMN "form_category" "game"."form_category" NOT NULL DEFAULT 'BASE_FORM',
ADD COLUMN "is_default_form" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "is_trackable" BOOLEAN NOT NULL DEFAULT false;