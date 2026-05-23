-- AlterTable
ALTER TABLE "trainer"."tracked_pokemons"
ADD COLUMN "is_lucky_hundo_tracked" BOOLEAN DEFAULT false,
ADD COLUMN "is_lucky_purified_tracked" BOOLEAN DEFAULT false,
ADD COLUMN "is_purifiedHundo_tracked" BOOLEAN DEFAULT false,
ADD COLUMN "is_shadow_hundo_tracked" BOOLEAN DEFAULT false,
ADD COLUMN "is_shiny_lucky_purified_hundo_tracked" BOOLEAN DEFAULT false,
ADD COLUMN "is_shiny_lucky_purified_tracked" BOOLEAN DEFAULT false,
ADD COLUMN "is_shiny_purified_hundo_tracked" BOOLEAN DEFAULT false,
ADD COLUMN "is_shiny_shadow_hundo_tracked" BOOLEAN DEFAULT false;