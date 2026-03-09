/*
  Warnings:

  - You are about to drop the column `cityId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cityId` on the `events` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_cityId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_cityId_fkey";

-- DropIndex
DROP INDEX "User_cityId_idx";

-- DropIndex
DROP INDEX "events_cityId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cityId",
ADD COLUMN     "city_id" TEXT NOT NULL DEFAULT 'qwe';

-- AlterTable
ALTER TABLE "events" DROP COLUMN "cityId",
ADD COLUMN     "city_id" TEXT NOT NULL DEFAULT 'qwe';

-- CreateIndex
CREATE INDEX "User_city_id_idx" ON "User"("city_id");

-- CreateIndex
CREATE INDEX "events_city_id_idx" ON "events"("city_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
