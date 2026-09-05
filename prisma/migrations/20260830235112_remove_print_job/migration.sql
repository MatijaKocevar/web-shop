/*
  Warnings:

  - You are about to drop the `PrintJob` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PrintJob" DROP CONSTRAINT "PrintJob_filamentId_fkey";

-- DropForeignKey
ALTER TABLE "PrintJob" DROP CONSTRAINT "PrintJob_fileId_fkey";

-- DropForeignKey
ALTER TABLE "PrintJob" DROP CONSTRAINT "PrintJob_orderItemId_fkey";

-- DropForeignKey
ALTER TABLE "PrintJob" DROP CONSTRAINT "PrintJob_profileId_fkey";

-- DropTable
DROP TABLE "PrintJob";

-- DropEnum
DROP TYPE "PrintJobStatus";
