-- AlterTable
ALTER TABLE "RankingPeriod" ADD COLUMN     "indicatorKeys" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "openalexId" TEXT,
ADD COLUMN     "rorId" TEXT,
ADD COLUMN     "uzbmbId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "University_uzbmbId_key" ON "University"("uzbmbId");

-- CreateIndex
CREATE UNIQUE INDEX "University_rorId_key" ON "University"("rorId");

-- CreateIndex
CREATE UNIQUE INDEX "University_openalexId_key" ON "University"("openalexId");
