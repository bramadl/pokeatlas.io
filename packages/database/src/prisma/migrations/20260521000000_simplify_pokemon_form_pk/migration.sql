-- AlterTable
ALTER TABLE trainer.tracked_pokemons
DROP CONSTRAINT IF EXISTS "tracked_pokemons_pokemon_id_fkey";

-- DropForeignKey
ALTER TABLE game.pokemon_forms
DROP CONSTRAINT IF EXISTS "pokemon_forms_pkey";

-- DropForeignKey
DROP INDEX IF EXISTS game."pokemon_forms_form_key";

-- AlterTable
ALTER TABLE game.pokemon_forms ADD CONSTRAINT "pokemon_forms_pkey" PRIMARY KEY (form);

-- AlterTable
ALTER TABLE trainer.tracked_pokemons ADD CONSTRAINT "tracked_pokemons_pokemon_id_fkey" FOREIGN KEY (pokemon_id) REFERENCES game.pokemon_forms (form) ON DELETE CASCADE;