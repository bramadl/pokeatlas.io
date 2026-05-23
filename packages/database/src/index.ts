export * from "./prisma/client";

export * from "./prisma/generated/client";
export * from "./prisma/generated/commonInputTypes";
export * from "./prisma/generated/enums";
export * from "./prisma/generated/models";

// ----- Prisma: Query Services -------------------------------------------------
export { PrismaTrainerPokedexQueryService } from "./prisma/providers/queries/trainer-pokedex/query.service";
