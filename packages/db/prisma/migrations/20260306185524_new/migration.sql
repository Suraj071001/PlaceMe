/*
  Warnings:

  - You are about to drop the column `departmentId` on the `Batch` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `GoogleChatConfig` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `GoogleChatConfig` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `GoogleChatConfig` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[batchId,webhookUrl]` on the table `GoogleChatConfig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branchId` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webhookUrl` to the `GoogleChatConfig` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_departmentId_fkey";

-- DropIndex
DROP INDEX "GoogleChatConfig_batchId_spaceId_key";

-- AlterTable
ALTER TABLE "Batch" DROP COLUMN "departmentId",
ADD COLUMN     "branchId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GoogleChatConfig" DROP COLUMN "key",
DROP COLUMN "spaceId",
DROP COLUMN "token",
ADD COLUMN     "webhookUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleChatConfig_batchId_webhookUrl_key" ON "GoogleChatConfig"("batchId", "webhookUrl");

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
