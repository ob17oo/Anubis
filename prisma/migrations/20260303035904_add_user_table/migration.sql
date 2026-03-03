-- CreateEnum
CREATE TYPE "USER_ROLE" AS ENUM ('ADMIN', 'USER', 'MODERATOR');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "event_location" TEXT NOT NULL DEFAULT 'Ростов-на-Дону';

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "role" "USER_ROLE" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
