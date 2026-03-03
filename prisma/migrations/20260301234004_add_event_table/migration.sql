-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('cinema', 'concert', 'kids', 'standup', 'theater', 'sport');

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "ticket_amount" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "genre" "EventType" NOT NULL DEFAULT 'concert',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_created_at_idx" ON "events"("created_at");

-- CreateIndex
CREATE INDEX "events_event_date_idx" ON "events"("event_date");

-- CreateIndex
CREATE INDEX "events_price_idx" ON "events"("price");
