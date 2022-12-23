-- CreateTable
CREATE TABLE "tweets" (
    "tweetId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "tweets_pkey" PRIMARY KEY ("tweetId")
);

-- AddForeignKey
ALTER TABLE "tweets" ADD CONSTRAINT "tweets_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
