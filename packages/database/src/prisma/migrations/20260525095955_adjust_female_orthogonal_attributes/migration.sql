-- AlterEnum
BEGIN;
CREATE TYPE "game"."form_category_new" AS ENUM ('ALTERNATE_FORM', 'BASE_FORM', 'COSTUME_VARIANT', 'TEMPORARY_EVOLUTION_FORM', 'REGIONAL_VARIANT');
ALTER TABLE "game"."pokemon_forms" ALTER COLUMN "form_category" DROP DEFAULT;
ALTER TABLE "game"."pokemon_forms" ALTER COLUMN "form_category" TYPE "game"."form_category_new" USING ("form_category"::text::"game"."form_category_new");
ALTER TYPE "game"."form_category" RENAME TO "form_category_old";
ALTER TYPE "game"."form_category_new" RENAME TO "form_category";
DROP TYPE "game"."form_category_old";
ALTER TABLE "game"."pokemon_forms" ALTER COLUMN "form_category" SET DEFAULT 'BASE_FORM';
COMMIT;

-- AlterTable
ALTER TABLE "game"."pokemon_forms" ADD COLUMN     "is_female" BOOLEAN NOT NULL DEFAULT false;
