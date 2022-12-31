import React from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { Bookmark, BookmarkBorder } from "@mui/icons-material";

import Pagination from "@mui/material/Pagination";

import { Tweet, TweetData } from "../types/tweet.dto";

import { Topics } from "../types/topic.dto";

import "../styles/tweetTable.css";

import useTweetApi from "../api-hooks/useTweetApi";

import { toast } from "react-toastify";

interface propType {
  tweetsData: TweetData | null;

  isLoading: boolean;

  isError: boolean;

  topic?: Topics;

  paginationOnchange: (e: React.ChangeEvent<unknown>, value: number) => void;
}

function TweetsTable({
  tweetsData,
  isLoading,
  isError,
  topic,
  paginationOnchange,
}: propType) {
  const [setTweetBookmarkStatusTrigger] = useTweetApi("Set-Bookmark");

  const bookmarkIconClick = async (tweet: Tweet, status: boolean) => {
    const bodyData = JSON.stringify({
      tweetId: tweet.tweetId,

      bookmarked: status,
    });

    try {
      const res: any = await setTweetBookmarkStatusTrigger(bodyData);

      toast.success(
        `Tweet ${status ? "" : "removed from "}bookmarked successfully`
      );

      // Update tweetData array

      for (let i = 0; i < tweetsData?.tweets!?.length; i++) {
        const item = tweetsData?.tweets[i];

        if (item?.tweetId === res?.data?.topic?.tweetId) {
          tweetsData?.tweets.splice(i, 1, {
            ...res?.data?.topic,
            tweeter: item?.tweeter,
          });

          i = tweetsData?.tweets!?.length;
        }
      }
    } catch (err: any) {
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
                <th>Bookmark</th>

                <th>Topic</th>

                <th>Tweep Handler</th>

                <th>Tweet</th>
              </tr>
            </thead>

            <tbody>
              {tweetsData.tweets?.map((tweet, index) => (
                <tr key={`${index}-${tweet.tweetId}`}>
                  <td>
                    {tweet.bookmarked ? (
                      <Bookmark
                        onClick={() => bookmarkIconClick(tweet, false)}
                      />
                    ) : (
                      <BookmarkBorder
                        onClick={() => bookmarkIconClick(tweet, true)}
                      />
                    )}
                  </td>

                  <td>{topic?.name}</td>

                  <td>{`@${tweet?.tweeter?.username}`}</td>

                  <td>{tweet?.text}</td>
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

      {tweetsData && tweetsData?.meta?.last_page > 1 && !isError && (
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
