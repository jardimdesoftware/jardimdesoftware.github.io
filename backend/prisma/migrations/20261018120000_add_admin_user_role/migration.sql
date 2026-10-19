-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'EDITOR';

-- Users that existed before roles had full access, so they stay ADMIN.
UPDATE "AdminUser" SET "role" = 'ADMIN';
