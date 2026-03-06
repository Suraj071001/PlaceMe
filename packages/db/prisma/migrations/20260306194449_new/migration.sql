/*
  Warnings:

  - You are about to drop the column `branch` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[batchId]` on the table `GoogleChatConfig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `batchId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "branch",
ADD COLUMN     "batchId" TEXT NOT NULL,
ADD COLUMN     "branchId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GoogleChatConfig_batchId_key" ON "GoogleChatConfig"("batchId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
