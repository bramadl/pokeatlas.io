-- 1. Tambah kolom boolean baru secara aman dengan default false
ALTER TABLE "game"."pokemon_forms" ADD COLUMN "is_costume" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "game"."pokemon_forms" ADD COLUMN "is_temporary_evolution" BOOLEAN NOT NULL DEFAULT false;

-- 2. Pindahkan status orthogonal ke kolom baru berdasarkan kategori aslinya saat ini
UPDATE "game"."pokemon_forms" 
SET "is_costume" = true 
WHERE "form_category" = 'COSTUME_VARIANT';

UPDATE "game"."pokemon_forms" 
SET "is_temporary_evolution" = true 
WHERE "form_category" = 'TEMPORARY_EVOLUTION_FORM';

-- 3. Normalkan form_category yang tadinya bertumpuk ke BASE_FORM
-- Data REGIONAL_VARIANT (57 baris) dan ALTERNATE_FORM (326 baris) TIDAK AKAN TERSENTUH
UPDATE "game"."pokemon_forms"
SET "form_category" = 'BASE_FORM'
WHERE "form_category" IN ('COSTUME_VARIANT', 'TEMPORARY_EVOLUTION_FORM');

-- 4. Ubah struktur Enum form_category di PostgreSQL
CREATE TYPE "game"."form_category_new" AS ENUM ('ALTERNATE_FORM', 'BASE_FORM', 'REGIONAL_FORM');

ALTER TABLE "game"."pokemon_forms" ALTER COLUMN "form_category" DROP DEFAULT;

-- Mengubah tipe data ke enum baru (PostgreSQL otomatis memetakan REGIONAL_VARIANT lama ke REGIONAL_FORM baru secara aman)
ALTER TABLE "game"."pokemon_forms" 
  ALTER COLUMN "form_category" TYPE "game"."form_category_new" 
  USING (
    CASE 
      WHEN "form_category" = 'REGIONAL_VARIANT' THEN 'REGIONAL_FORM'::"game"."form_category_new"
      ELSE "form_category"::text::"game"."form_category_new"
    END
  );

ALTER TABLE "game"."pokemon_forms" ALTER COLUMN "form_category" SET DEFAULT 'BASE_FORM';

-- Hapus enum lama dan rename yang baru agar sinkron dengan Prisma
DROP TYPE "game"."form_category";
ALTER TYPE "game"."form_category_new" RENAME TO "form_category";
