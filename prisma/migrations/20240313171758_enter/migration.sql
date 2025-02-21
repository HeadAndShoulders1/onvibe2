/*
  Warnings:

  - You are about to drop the column `strean` on the `Release` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stream";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stream" JSON;
