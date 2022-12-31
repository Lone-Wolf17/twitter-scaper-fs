import { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import TweetsTable from "../components/TweetsTable";
import useTweetApi from "../api-hooks/useTweetApi";
import { TweetData } from "../types/tweet.dto";
import { toast } from "react-toastify";

function BookmarkedTweetsPage() {
  const [
    getBookMarkedTweetsTrigger,
    { isLoading: getBookmarkedIsLoading, isError },
  ] = useTweetApi("Get-Bookmarked");

  // States
  const [tweetsData, setTweetsData] = useState<TweetData | null>(null);

  // Gets all bookmarked tweets
  const getbookmarkedTweets = useCallback(async () => {
    try {
      const res: any = await getBookMarkedTweetsTrigger();
      setTweetsData(res?.data);

      // scroll page to top
      window.scrollTo(0, 0);
    } catch (err: any) {
      if (err.response.status === 500 || !err.response?.data?.code) {
        toast.error("Oops An error occurred ");
      } else {
        toast.error(err.response?.data?.code);
      }
    }
  }, [getBookMarkedTweetsTrigger]);

  const handlePaginationOnchange = (
    e: React.ChangeEvent<unknown>,
    value: number
  ) => {};

  useEffect(() => {
    getbookmarkedTweets();
  }, [getbookmarkedTweets]);
  return (
    <div>
      <Header />
      <main>
        <h1 style={{ textAlign: "center", marginBottom: "1em" }}>
          View and manage your bookmarked tweeets
        </h1>
        <TweetsTable
          isLoading={getBookmarkedIsLoading}
          isError={isError}
          parentComponent={"BookmarkedTweets"}
          tweetsData={tweetsData}
          paginationOnchange={handlePaginationOnchange}
        />
      </main>
    </div>
  );
}

export default BookmarkedTweetsPage;
