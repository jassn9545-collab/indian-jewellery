-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "number" VARCHAR(20) NOT NULL DEFAULT '',
    "dob" VARCHAR(30),
    "country" VARCHAR(100),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "type" SMALLINT NOT NULL DEFAULT 2,
    "linkHash" INTEGER,
    "isVerified" SMALLINT NOT NULL DEFAULT 0,
    "isSubscribed" SMALLINT NOT NULL DEFAULT 0,
    "refreshToken" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_number_idx" ON "users"("number");

-- CreateIndex
CREATE INDEX "users_isDeleted_idx" ON "users"("isDeleted");

