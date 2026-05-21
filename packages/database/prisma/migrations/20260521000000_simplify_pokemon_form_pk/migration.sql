-- Migration: simplify PokemonForm primary key
-- Composite PK (templateId, speciesId, form, isTemporaryEvolution) → form @id
-- Step 1: drop FK on TrackedPokemon first (depends on the unique index)
ALTER TABLE trainer.tracked_pokemons
DROP CONSTRAINT IF EXISTS "tracked_pokemons_pokemon_id_fkey";

-- Step 2: drop composite PK
ALTER TABLE game.pokemon_forms
DROP CONSTRAINT IF EXISTS "pokemon_forms_pkey";

-- Step 3: drop standalone unique index
DROP INDEX IF EXISTS game."pokemon_forms_form_key";

-- Step 4: form becomes sole PK
ALTER TABLE game.pokemon_forms ADD CONSTRAINT "pokemon_forms_pkey" PRIMARY KEY (form);

-- Step 5: recreate FK pointing to new PK
ALTER TABLE trainer.tracked_pokemons ADD CONSTRAINT "tracked_pokemons_pokemon_id_fkey" FOREIGN KEY (pokemon_id) REFERENCES game.pokemon_forms (form) ON DELETE CASCADE;