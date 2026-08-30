-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "modelFileId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_modelFileId_fkey" FOREIGN KEY ("modelFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
