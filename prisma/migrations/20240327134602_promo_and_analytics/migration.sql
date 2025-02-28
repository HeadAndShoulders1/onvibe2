-- AlterTable
ALTER TABLE "Streams" ADD COLUMN     "ISRC" TEXT;

-- CreateTable
CREATE TABLE "Promo" (
    "id" SERIAL NOT NULL,
    "releaseID" INTEGER,
    "General_text" TEXT,
    "playlists" TEXT,
    "key_facts" TEXT,
    "release_promotion" TEXT,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);
