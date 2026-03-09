-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userLocation" TEXT NOT NULL DEFAULT 'Ростов-на-Дону',
ALTER COLUMN "image_url" SET DEFAULT '/static/default/default-user.svg';
