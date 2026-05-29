export * from "./prisma/client";

export * from "./prisma/generated/client";
export * from "./prisma/generated/commonInputTypes";
export * from "./prisma/generated/enums";
export * from "./prisma/generated/models";

// ----- Prisma: Projection Handlers --------------------------------------------

// export { handlePokemonTracked } from "./prisma/providers/queries/pokedex/adapter.projection";

// ----- Prisma: Query Services -------------------------------------------------

export { PrismaPokedexServiceAdapter } from "./prisma/providers/queries/pokedex/adapter";

// ----- Prisma: Repositories ---------------------------------------------------

export { PrismaTrainerDexRepositoryAdapter } from "./prisma/providers/repositories/trainer-dex/adapter";
