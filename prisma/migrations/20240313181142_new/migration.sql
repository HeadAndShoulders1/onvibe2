/*
  Warnings:

  - Made the column `stream` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "stream" SET NOT NULL,
ALTER COLUMN "stream" SET DATA TYPE JSONB;
