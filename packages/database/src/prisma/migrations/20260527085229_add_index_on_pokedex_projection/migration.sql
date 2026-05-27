-- CreateIndex
CREATE INDEX "pokedex_trainer_ref_family_id_idx" ON "projections"."pokedex"("trainer_ref", "family_id");

-- CreateIndex
CREATE INDEX "pokedex_trainer_ref_pokemon_name_idx" ON "projections"."pokedex"("trainer_ref", "pokemon_name");
