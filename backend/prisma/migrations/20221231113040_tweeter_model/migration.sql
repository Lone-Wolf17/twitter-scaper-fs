/*
  Warnings:

  - Added the required column `tweeterId` to the `tweets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tweets" ADD COLUMN     "tweeterId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Tweeter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Tweeter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tweets" ADD CONSTRAINT "tweets_tweeterId_fkey" FOREIGN KEY ("tweeterId") REFERENCES "Tweeter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
