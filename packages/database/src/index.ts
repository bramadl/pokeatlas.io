export * from "./prisma/client";

export * from "./prisma/generated/client";
export * from "./prisma/generated/commonInputTypes";
export * from "./prisma/generated/enums";
export * from "./prisma/generated/models";

// ----- Prisma: Projection Handlers --------------------------------------------

export { handlePokemonTracked } from "./prisma/projections/update-pokedex-projection.handler";

// ----- Prisma: Query Services -------------------------------------------------

export { PrismaPokedexQueryService } from "./prisma/providers/queries/pokedex/query.service";
export { PrismaPokemonCatalogAdapter } from "./prisma/providers/queries/pokemon-catalog/adapter";

// ----- Prisma: Repositories ---------------------------------------------------

export { PrismaPokedexRepositoryAdapter } from "./prisma/providers/repositories/pokedex/adapter";
