-- CreateTable
CREATE TABLE "ProductFilamentUsage" (
    "id" TEXT NOT NULL,
    "grams" DOUBLE PRECISION NOT NULL,
    "filamentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductFilamentUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductFilamentUsage_productId_filamentId_key" ON "ProductFilamentUsage"("productId", "filamentId");

-- AddForeignKey
ALTER TABLE "ProductFilamentUsage" ADD CONSTRAINT "ProductFilamentUsage_filamentId_fkey" FOREIGN KEY ("filamentId") REFERENCES "Filament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFilamentUsage" ADD CONSTRAINT "ProductFilamentUsage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
