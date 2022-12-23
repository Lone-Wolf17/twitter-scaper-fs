-- DropForeignKey
ALTER TABLE "tweets" DROP CONSTRAINT "tweets_topicId_fkey";

-- AddForeignKey
ALTER TABLE "tweets" ADD CONSTRAINT "tweets_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
