export * from "./prisma/client";

export * from "./prisma/generated/client";
export * from "./prisma/generated/commonInputTypes";
export * from "./prisma/generated/enums";
export * from "./prisma/generated/models";

// ----- Prisma: Projection Handlers --------------------------------------------

export { handlePokemonTracked } from "./prisma/providers/queries/pokedex/adapter.projection";

// ----- Prisma: Query Services -------------------------------------------------

export { PrismaPokedexServiceAdapter } from "./prisma/providers/queries/pokedex/adapter";
export { PrismaPokemonCatalogAdapter } from "./prisma/providers/queries/pokemon-catalog/adapter";

// ----- Prisma: Repositories ---------------------------------------------------

export { PrismaPokedexRepositoryAdapter } from "./prisma/providers/repositories/pokedex/adapter";
