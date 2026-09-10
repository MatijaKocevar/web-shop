-- CreateEnum
CREATE TYPE "StockReason" AS ENUM ('ORDER', 'STOCK_PRINT', 'FAILURE', 'RESTOCK', 'CORRECTION');

-- AlterTable
ALTER TABLE "Filament" ADD COLUMN     "lowStockThresholdGrams" INTEGER NOT NULL DEFAULT 500,
ADD COLUMN     "stockGrams" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "grams" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "FilamentStockLog" (
    "id" TEXT NOT NULL,
    "deltaGrams" INTEGER NOT NULL,
    "reason" "StockReason" NOT NULL,
    "note" TEXT,
    "orderItemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filamentId" TEXT NOT NULL,

    CONSTRAINT "FilamentStockLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FilamentStockLog" ADD CONSTRAINT "FilamentStockLog_filamentId_fkey" FOREIGN KEY ("filamentId") REFERENCES "Filament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilamentStockLog" ADD CONSTRAINT "FilamentStockLog_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
