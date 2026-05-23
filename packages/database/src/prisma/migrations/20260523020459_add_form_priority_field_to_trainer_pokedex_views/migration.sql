-- DropIndex
DROP INDEX "views"."trainer_pokedex_trainer_ref_dex_number_idx";

-- AlterTable
ALTER TABLE "views"."trainer_pokedex" ADD COLUMN     "form_priority" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "trainer_pokedex_trainer_ref_dex_number_form_priority_idx" ON "views"."trainer_pokedex"("trainer_ref", "dex_number", "form_priority");
