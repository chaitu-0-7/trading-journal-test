/*
  Warnings:

  - You are about to drop the column `tradeType` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `goodBad` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longShort` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "tradeType",
ADD COLUMN     "goodBad" TEXT NOT NULL,
ADD COLUMN     "longShort" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
