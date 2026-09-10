/*
  Warnings:

  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductFilamentUsage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductStockLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductFilamentUsage" DROP CONSTRAINT "ProductFilamentUsage_filamentId_fkey";

-- DropForeignKey
ALTER TABLE "ProductFilamentUsage" DROP CONSTRAINT "ProductFilamentUsage_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductStockLog" DROP CONSTRAINT "ProductStockLog_productId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stock";

-- DropTable
DROP TABLE "ProductFilamentUsage";

-- DropTable
DROP TABLE "ProductStockLog";
