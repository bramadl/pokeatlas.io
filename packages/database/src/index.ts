export * from "./prisma/client";

export * from "./prisma/generated/client";
export * from "./prisma/generated/commonInputTypes";
export * from "./prisma/generated/enums";
export * from "./prisma/generated/models";

// ----- Prisma: Query Services -------------------------------------------------
export { PrismaPokedexQueryService } from "./prisma/providers/queries/pokedex/query.service";
