/*
  Warnings:

  - You are about to drop the column `ISRC` on the `Streams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Streams" DROP COLUMN "ISRC",
ADD COLUMN     "UPC" TEXT;
