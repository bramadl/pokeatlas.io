-- AlterTable
ALTER TABLE "trainer"."tracked_pokemons"
DROP COLUMN "is_hundo_tracked",
DROP COLUMN "is_lucky_hundo_tracked",
DROP COLUMN "is_lucky_purified_tracked",
DROP COLUMN "is_lucky_tracked",
DROP COLUMN "is_purifiedHundo_tracked",
DROP COLUMN "is_purified_tracked",
DROP COLUMN "is_shadow_hundo_tracked",
DROP COLUMN "is_shadow_tracked",
DROP COLUMN "is_shiny_hundo_tracked",
DROP COLUMN "is_shiny_lucky_hundo_tracked",
DROP COLUMN "is_shiny_lucky_purified_hundo_tracked",
DROP COLUMN "is_shiny_lucky_purified_tracked",
DROP COLUMN "is_shiny_lucky_tracked",
DROP COLUMN "is_shiny_purified_hundo_tracked",
DROP COLUMN "is_shiny_purified_tracked",
DROP COLUMN "is_shiny_shadow_hundo_tracked",
DROP COLUMN "is_shiny_shadow_tracked",
DROP COLUMN "is_shiny_tracked",
ALTER COLUMN "is_tracked"
SET
  NOT NULL;