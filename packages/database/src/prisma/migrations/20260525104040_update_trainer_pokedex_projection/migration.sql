-- AlterTable
ALTER TABLE "projections"."trainer_pokedex" ADD COLUMN     "is_female" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "trainer_pokedex_trainer_ref_form_category_idx" ON "projections"."trainer_pokedex"("trainer_ref", "form_category");

-- CreateIndex
CREATE INDEX "trainer_pokedex_trainer_ref_is_female_idx" ON "projections"."trainer_pokedex"("trainer_ref", "is_female");
