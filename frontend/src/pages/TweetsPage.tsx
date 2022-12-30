import axios from "axios";
import React, { useEffect, useCallback, useState, ChangeEvent } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { SearchRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";

import Header from "../components/Header";
import "../styles/tweetsPage.css";
import { BackendEndpoints } from "../constants/BackendEndpoints";

interface Tweet {
  createdAt: string;
  text: string;
  topicId: string;
  tweetId: string;
  updatedAt: string;
}

type TweetUrlParams =
  | "topicID"
  | "startTime"
  | "endTime"
  | "orderyBy"
  | "query";

const TweetsPage = () => {
  const { id = "" } = useParams();
  const { state: topic = {} } = useLocation();

  // States
  const [tweets, setTweets] = useState<Tweet[] | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [currentTweetArrayStartIndex, setCurrentTweetArrayStartIndex] =
    useState(0);
  const [tweetPerPage, setTweetPerPage] = useState(20);

  // Input callback func
  const searchInputOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value),
    []
  );

  // Gets all the tweets
  const getTopicTweets = useCallback(
    async (paramsObj: Record<TweetUrlParams, string>) => {
      const searchParams = new URLSearchParams(paramsObj.toString());

      try {
        const res = await axios.get(
          BackendEndpoints.fetchTopicTweets + `?${searchParams}`
        );
        console.log(res);
        setTweets(res.data.tweets);
      } catch (err: any) {
        console.log(err);
        toast.error(err.response?.data?.code);
      }
    },
    []
  );

  const getHandler = (tweet: string) => {
    const match = tweet.match(/(@.+?)\s/i);
    if (match) {
      return match[1];
    } else {
      // console.log(tweet)
      return tweet;
    }
  };

  // handles pagination on page change
  const handlePaginationOnChange = (
    e: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentTweetArrayStartIndex((value - 1) * tweetPerPage);
    setCurrentPageIndex(value);
  };

  useEffect(() => {
    getTopicTweets({
      topicID: id,
      startTime: "",
      endTime: "",
      orderyBy: "",
      query: "",
    });
  });

  return (
    <div className="tweets-wrapper">
      <Header />
      <main>
        {/* SECTION 1 (SEARCH) */}
        <section className="tweets-sec1">
          <div className="tweets-searchBar">
            <SearchRounded />
            <input
              onChange={searchInputOnChange}
              value={searchInput}
              type="text"
            />
          </div>
          <Button
            disabled={searchInput === ""}
            variant="contained"
            onClick={() => {
              getTopicTweets({
                topicID: id,
                startTime: "",
                endTime: "",
                orderyBy: "",
                query: searchInput,
              });
            }}
          >
            Search
          </Button>
        </section>
        {/* SECTION 2 (TWEETS TABLE) */}
        <section>
          <div className="topic-table-wrapper">
            {tweets && tweets?.length > 0 ? (
              <table className="topic-table" width={"100%"}>
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Tweep Handler</th>
                    <th>Tweet</th>
                  </tr>
                </thead>
                <tbody>
                  {tweets
                    ?.slice(
                      currentTweetArrayStartIndex,
                      tweetPerPage * currentPageIndex
                    )
                    .map((tweet, index) => (
                      <tr key={`${index}-${tweet.tweetId}`}>
                        <td>{topic?.name}</td>
                        <td>{getHandler(tweet.text)}</td>
                        <td>{tweet.text}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "1.2rem",
                  marginTop: "2em",
                }}
              >
                No Tweet Found
              </p>
            )}
          </div>
          {/* PAGINATION */}
          {tweets && tweets.length > 0 && (
            <Pagination
              color="primary"
              count={Math.ceil(tweets.length / tweetPerPage)}
              size="large"
              onChange={handlePaginationOnChange}
              sx={{ display: "flex", justifyContent: "center" }}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default TweetsPage;
