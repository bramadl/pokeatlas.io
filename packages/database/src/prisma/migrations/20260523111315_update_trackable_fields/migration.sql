-- DropColumn
ALTER TABLE "trainer"."tracked_pokemons" 
DROP COLUMN "is_tracked",
ADD COLUMN "tracked_states" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AddIndex
CREATE UNIQUE INDEX "tracked_pokemons_pokemon_form_trainer_id_key" 
ON "trainer"."tracked_pokemons"("pokemon_form", "trainer_id");