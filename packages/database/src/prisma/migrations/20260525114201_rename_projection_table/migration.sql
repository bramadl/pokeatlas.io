/*
  Warnings:

  - You are about to drop the `trainer_pokedex` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "projections"."trainer_pokedex";

-- CreateTable
CREATE TABLE "projections"."pokedex" (
    "pokemon_ref" TEXT NOT NULL,
    "trainer_ref" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "shiny_image_url" TEXT,
    "pokemon_name" TEXT NOT NULL,
    "dex_number" INTEGER NOT NULL,
    "primary_type" TEXT NOT NULL,
    "secondary_type" TEXT,
    "form_category" TEXT,
    "form_priority" INTEGER NOT NULL DEFAULT 0,
    "is_female" BOOLEAN NOT NULL DEFAULT false,
    "tracked_states" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokedex_pkey" PRIMARY KEY ("trainer_ref","pokemon_ref")
);

-- CreateIndex
CREATE INDEX "pokedex_trainer_ref_dex_number_form_priority_idx" ON "projections"."pokedex"("trainer_ref", "dex_number", "form_priority");

-- CreateIndex
CREATE INDEX "pokedex_trainer_ref_form_category_idx" ON "projections"."pokedex"("trainer_ref", "form_category");

-- CreateIndex
CREATE INDEX "pokedex_trainer_ref_is_female_idx" ON "projections"."pokedex"("trainer_ref", "is_female");
