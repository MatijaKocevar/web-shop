-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "filamentId" TEXT;

-- AlterTable
ALTER TABLE "PrintJob" ADD COLUMN     "filamentId" TEXT;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_filamentId_fkey" FOREIGN KEY ("filamentId") REFERENCES "Filament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintJob" ADD CONSTRAINT "PrintJob_filamentId_fkey" FOREIGN KEY ("filamentId") REFERENCES "Filament"("id") ON DELETE SET NULL ON UPDATE CASCADE;
