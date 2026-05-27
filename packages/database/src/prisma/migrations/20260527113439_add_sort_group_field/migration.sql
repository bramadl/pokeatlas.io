-- AlterTable
ALTER TABLE "projections"."pokedex" ADD COLUMN     "sort_group" INTEGER DEFAULT 0;

-- CreateIndex
CREATE INDEX "pokedex_trainer_ref_sort_group_dex_number_form_priority_idx" ON "projections"."pokedex"("trainer_ref", "sort_group", "dex_number", "form_priority");
