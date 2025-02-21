-- CreateTable
CREATE TABLE "Streams" (
    "id" SERIAL NOT NULL,
    "date" TEXT,
    "stream" INTEGER,
    "UserID" INTEGER,

    CONSTRAINT "Streams_pkey" PRIMARY KEY ("id")
);
