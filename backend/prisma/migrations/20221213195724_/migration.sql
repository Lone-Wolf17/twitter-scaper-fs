/*
  Warnings:

  - A unique constraint covering the columns `[topic_slug_uniq]` on the table `topics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `topics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_slug_uniq` to the `topics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `topics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "topics" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "topic_slug_uniq" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "topics_topic_slug_uniq_key" ON "topics"("topic_slug_uniq");
