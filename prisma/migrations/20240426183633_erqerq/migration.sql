/*
  Warnings:

  - Made the column `entryAvg` on table `Trade` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Trade" ALTER COLUMN "entryAvg" SET NOT NULL,
ALTER COLUMN "exitAvg" DROP NOT NULL;
