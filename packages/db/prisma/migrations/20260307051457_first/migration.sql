/*
  Warnings:

  - You are about to drop the column `openings` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `registration` on the `Student` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'EMAIL', 'PHONE', 'YES_NO', 'CHECKBOX', 'MULTIPLE_CHOICE', 'DATE', 'FILE_UPLOAD', 'URL');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "openings";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "registration",
ADD COLUMN     "skills" TEXT[];

-- CreateTable
CREATE TABLE "OTP" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationForm" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT,
    "formId" TEXT NOT NULL,

    CONSTRAINT "FormSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestion" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "systemNote" TEXT,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "FormQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobApplicationForm" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JobApplicationForm_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "OTP_email_idx" ON "OTP"("email");

-- CreateIndex
CREATE INDEX "_JobApplicationForm_B_index" ON "_JobApplicationForm"("B");

-- AddForeignKey
ALTER TABLE "ApplicationForm" ADD CONSTRAINT "ApplicationForm_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSection" ADD CONSTRAINT "FormSection_formId_fkey" FOREIGN KEY ("formId") REFERENCES "ApplicationForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "FormSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FormQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicationForm" ADD CONSTRAINT "_JobApplicationForm_A_fkey" FOREIGN KEY ("A") REFERENCES "ApplicationForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicationForm" ADD CONSTRAINT "_JobApplicationForm_B_fkey" FOREIGN KEY ("B") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
