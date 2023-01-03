import React from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { Bookmark, BookmarkBorder } from "@mui/icons-material";

import Pagination from "@mui/material/Pagination";

import { Tweet, TweetData } from "../types/tweet.dto";

import { Topics } from "../types/topic.dto";

import "../styles/tweetsTable.css";

import useTweetApi from "../api-hooks/useTweetApi";

import { toast } from "react-toastify";
import { response } from "msw";

export interface TweetsTablePropType {
  tweetsData: TweetData | null;

  isLoading: boolean;

  isError: boolean;

  topic?: Topics;

  paginationOnchange: (e: React.ChangeEvent<unknown>, value: number) => void;
  parentComponent: "BookmarkedTweets" | "Topic-Tweets";
}

function TweetsTable({
  tweetsData,
  isLoading,
  isError,
  parentComponent,
  paginationOnchange,
}: TweetsTablePropType) {
  const [setTweetBookmarkStatusTrigger] = useTweetApi("Set-Bookmark");

  const bookmarkIconClick = async (tweet: Tweet, status: boolean) => {
    const bodyData = JSON.stringify({
      tweetId: tweet.tweetId,

      bookmarked: status,
    });

    try {
      const res: any = await setTweetBookmarkStatusTrigger(bodyData);

      // console.log(res);

      toast.success(
        `Tweet ${status ? "" : "removed from "}bookmarked successfully`
      );

      // Update tweetData array
      const index = tweetsData?.tweets.findIndex(
        (element) => element.tweetId === tweet.tweetId
      )!;
      if (parentComponent === "BookmarkedTweets") {
        // Removed from list
        tweetsData?.tweets.splice(index, 1);
      } else {
        console.log(res?.data.tweet);
        tweetsData!.tweets![index] = {
          ...res?.data.tweet,
        };
        console.log(tweetsData!.tweets![index]);
      }
    } catch (err: any) {
      console.log(err);
      if (err.response.status === 500 || !err.response?.data?.code) {
        toast.error("Oops An error occurred ");
      } else {
        toast.error(err.response?.data?.code);
      }
    }
  };

  return (
    <>
      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress size={30} color="primary" />
        </div>
      )}

      <div className="tweet-table-wrapper">
        {isError ? (
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              marginTop: "2em",
            }}
          >
            An Error occurred while trying to fetch tweets
          </p>
        ) : tweetsData && tweetsData.tweets?.length > 0 ? (
          <table className="tweet-table" width={"100%"}>
            <thead>
              <tr>
                <th>Date</th>

                <th>Topic</th>

                <th>Tweep Handler</th>

                <th>Tweet</th>

                <th>Bookmark</th>
              </tr>
            </thead>

            <tbody>
              {tweetsData.tweets?.map((tweet, index) => (
                <tr
                  data-testid="tweetTableItems"
                  key={`${index}-${tweet.tweetId}`}
                >
                  <td>
                    {new Date(tweet?.createdAt).toLocaleString("en-uk", {
                      hour12: true,
                    })}
                  </td>
                  <td>{tweet?.topic?.name}</td>

                  <td>{`@${tweet?.tweeter?.username}`}</td>

                  <td>{tweet?.text}</td>
                  <td>
                    {tweet.bookmarked ? (
                      <Bookmark
                        data-testid={`unBookmarkIcon-${tweet.tweetId}`}
                        onClick={() => bookmarkIconClick(tweet, false)}
                      />
                    ) : (
                      <BookmarkBorder
                        data-testid={`bookmarkIcon-${tweet.tweetId}`}
                        onClick={() => bookmarkIconClick(tweet, true)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : tweetsData?.tweets?.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              marginTop: "2em",
            }}
          >
            No Tweet Found
          </p>
        ) : (
          <></>
        )}
      </div>

      {/* PAGINATION */}

      {tweetsData && tweetsData?.tweets.length > 0 && !isError && (
        <Pagination
          color="primary"
          count={Math.ceil(tweetsData.meta.last_page)}
          size="large"
          onChange={paginationOnchange}
          sx={{ display: "flex", justifyContent: "center" }}
        />
      )}
    </>
  );
}

export default TweetsTable;
