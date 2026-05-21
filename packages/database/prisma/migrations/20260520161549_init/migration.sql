-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "game";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "trainer";

-- CreateEnum
CREATE TYPE "game"."pokemon_class" AS ENUM ('LEGENDARY', 'MYTHIC');

-- CreateTable
CREATE TABLE "game"."pokemon_types" (
    "template_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "synced_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokemon_types_pkey" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "game"."pokemon_species" (
    "pokemon_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pokedex_number" INTEGER NOT NULL,
    "pokemon_class" "game"."pokemon_class",
    "family_id" TEXT NOT NULL,
    "is_shadow_available" BOOLEAN NOT NULL,
    "synced_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokemon_species_pkey" PRIMARY KEY ("pokemon_id")
);

-- CreateTable
CREATE TABLE "game"."pokemon_forms" (
    "template_id" TEXT NOT NULL,
    "species_id" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "default_sprite" TEXT,
    "shiny_sprite" TEXT,
    "primary_type_id" TEXT,
    "secondary_type_id" TEXT,
    "base_attack" INTEGER NOT NULL,
    "base_defense" INTEGER NOT NULL,
    "base_stamina" INTEGER NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "is_costume" BOOLEAN NOT NULL DEFAULT false,
    "is_temporary_evolution" BOOLEAN NOT NULL DEFAULT false,
    "synced_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokemon_forms_pkey" PRIMARY KEY ("template_id","species_id","form","is_temporary_evolution")
);

-- CreateTable
CREATE TABLE "trainer"."trainers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer"."tracked_pokemons" (
    "id" UUID NOT NULL,
    "pokemon_id" TEXT NOT NULL,
    "trainer_id" UUID NOT NULL,
    "is_shiny_tracked" BOOLEAN NOT NULL,
    "is_shadow_tracked" BOOLEAN NOT NULL,
    "is_purified_tracked" BOOLEAN NOT NULL,
    "is_lucky_tracked" BOOLEAN NOT NULL,
    "is_hundo_tracked" BOOLEAN NOT NULL,
    "is_shiny_shadow_tracked" BOOLEAN NOT NULL,
    "is_shiny_purified_tracked" BOOLEAN NOT NULL,
    "is_shiny_lucky_tracked" BOOLEAN NOT NULL,
    "is_shiny_hundo_tracked" BOOLEAN NOT NULL,
    "is_shiny_lucky_hundo_tracked" BOOLEAN NOT NULL,

    CONSTRAINT "tracked_pokemons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_forms_form_key" ON "game"."pokemon_forms"("form");

-- AddForeignKey
ALTER TABLE "game"."pokemon_forms" ADD CONSTRAINT "pokemon_forms_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "game"."pokemon_species"("pokemon_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game"."pokemon_forms" ADD CONSTRAINT "pokemon_forms_primary_type_id_fkey" FOREIGN KEY ("primary_type_id") REFERENCES "game"."pokemon_types"("template_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game"."pokemon_forms" ADD CONSTRAINT "pokemon_forms_secondary_type_id_fkey" FOREIGN KEY ("secondary_type_id") REFERENCES "game"."pokemon_types"("template_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer"."tracked_pokemons" ADD CONSTRAINT "tracked_pokemons_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "game"."pokemon_forms"("form") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer"."tracked_pokemons" ADD CONSTRAINT "tracked_pokemons_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer"."trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
