-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email_auth" BOOLEAN DEFAULT false,
    "email_code" TEXT,
    "message_status" TEXT DEFAULT 'read',
    "license_status" TEXT DEFAULT 'Not fill',
    "last_name" TEXT,
    "first_name" TEXT,
    "middle_name" TEXT,
    "place_of_birth" TEXT,
    "passport_received_by" TEXT,
    "passport_office_id" TEXT,
    "registration_address" TEXT,
    "bank_name" TEXT,
    "balance" INTEGER DEFAULT 0,
    "date_birth" TIMESTAMP(3),
    "number_phone" TEXT,
    "passport_serial_number" INTEGER,
    "passport_number_number" INTEGER,
    "signature" TEXT,
    "passport_date_received" TIMESTAMP(3),
    "bank_account_number" BIGINT,
    "inn" BIGINT,
    "admin" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscribe" (
    "id" SERIAL NOT NULL,
    "id_subscribe" INTEGER,
    "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "UserID" INTEGER,

    CONSTRAINT "Subscribe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Release" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "title" TEXT,
    "version" TEXT,
    "cover_path" TEXT,
    "cover_small_path" TEXT,
    "meta_language" TEXT,
    "error" TEXT[],
    "type" TEXT,
    "artist" TEXT[],
    "featartist" TEXT[],
    "date_release" TIMESTAMP(3),
    "genre" TEXT,
    "p_line" TEXT,
    "owner" INTEGER,
    "upc" TEXT,
    "fio" TEXT,
    "status" TEXT,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tracks" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "order" INTEGER,
    "title" TEXT,
    "version" TEXT,
    "artist" TEXT[],
    "featartist" TEXT[],
    "genre" TEXT,
    "isrc" TEXT,
    "is_instrumental" BOOLEAN,
    "is_curse" BOOLEAN,
    "track_wav" TEXT,
    "track_mp3" TEXT,
    "releaseId" INTEGER,
    "owner" INTEGER,

    CONSTRAINT "Tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Smartlinks" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "title" TEXT,
    "version" TEXT,
    "artist" TEXT[],
    "featartist" TEXT[],
    "url" TEXT,
    "cover" TEXT,
    "owner" INTEGER,

    CONSTRAINT "Smartlinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartlinksURL" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "platform" TEXT,
    "url" TEXT,
    "cover" TEXT,
    "smartlinkID" INTEGER,

    CONSTRAINT "SmartlinksURL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "title" TEXT,
    "status" TEXT,
    "owner" INTEGER,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Smartlinks_url_key" ON "Smartlinks"("url");
