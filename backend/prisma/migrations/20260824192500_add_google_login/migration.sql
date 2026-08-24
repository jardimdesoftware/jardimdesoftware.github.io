-- AlterTable
ALTER TABLE "AdminUser" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ADD COLUMN "googleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_googleId_key" ON "AdminUser"("googleId");
