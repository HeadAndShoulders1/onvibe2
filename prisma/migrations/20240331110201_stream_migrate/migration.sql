/*
  Warnings:

  - You are about to drop the column `UserID` on the `Streams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Streams" DROP COLUMN "UserID",
ADD COLUMN     "platform" TEXT;
