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
import LoadingIndicator from "../components/LoadingIndicator";
import { Tweet } from "../types/tweet.dto";
import { GetTweetFilters, TweetData } from "../types/tweet.dto";
import useTweetApi from "../api-hooks/useTweetApi";
import { LocalizationProvider } from "@mui/x-date-pickers";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DateTime } from "luxon";

type OrderByType = "asc" | "desc";

const TweetsPage = () => {
  const { id = "" } = useParams();
  const { state: topic = {} } = useLocation();
  const [getTweetsTrigger, { isLoading, isError }] = useTweetApi("Get-All");

  // States
  const [tweetsData, setTweetsData] = useState<TweetData | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [startTime, setStartTime] = useState<DateTime | null>(null);
  const [endTime, setEndTime] = useState<DateTime | null>(null);
  const [orderBy, setOrderBy] = useState<OrderByType>("desc");

  // Input callback func
  const searchInputOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value),
    []
  );
  const startTimeOnChange = useCallback(
    (value: any) => setStartTime(value),
    []
  );
  const endTimeOnChange = useCallback((value: any) => setEndTime(value), []);
  const orderByOnChange = (event: SelectChangeEvent) =>
    setOrderBy(event.target.value as OrderByType);

  // Gets all the tweets
  const getTopicTweets = useCallback(
    async (filter: GetTweetFilters) => {
      const paramsObj = Object.entries(filter);
      const searchParams = new URLSearchParams(paramsObj.toString());

      // setIsLoading(true);
      try {
        const res: any = await getTweetsTrigger(searchParams);
        setTweetsData(res?.data);
      } catch (err: any) {
        console.log(err.response?.data);
        if (err.response?.data?.code) {
          toast.error(err.response?.data?.code);
        } else {
          toast.error("Oops An error occurred ");
        }
      }
    },
    [getTweetsTrigger]
  );

  // handles pagination on page change
  const handlePaginationOnChange = (
    e: React.ChangeEvent<unknown>,
    value: number
  ) => {};

  useEffect(() => {
    getTopicTweets({
      topicID: id,
      limit: "20",
      page: "1",
    });
  }, [getTopicTweets, id]);

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
                startTime: startTime ? startTime.toISODate() : "",
                endTime: endTime ? endTime.toISODate() : "",
                orderBy: orderBy,
                query: searchInput,
                limit: "20",
                page: "1",
              });
            }}
          >
            Search
          </Button>
        </section>
        <section className="tweets-sec2">
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DesktopDatePicker
              label="Start Time"
              value={startTime}
              disableMaskedInput
              onChange={startTimeOnChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DesktopDatePicker
              label="End Time"
              value={endTime}
              disableMaskedInput
              onChange={endTimeOnChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <FormControl fullWidth>
            <InputLabel id="orderLabelById">Order By</InputLabel>
            <Select
              labelId="orderLabelById"
              id="demo-simple-select"
              value={orderBy}
              label="Order By"
              onChange={orderByOnChange}
            >
              <MenuItem value={"asc"}>Ascending</MenuItem>
              <MenuItem value={"desc"}>Decending</MenuItem>
            </Select>
          </FormControl>
          <Button
            disabled={isLoading}
            onClick={() => {
              getTopicTweets({
                topicID: id,
                startTime: startTime ? startTime.toISODate() : "",
                endTime: endTime ? endTime.toISODate() : "",
                orderBy: orderBy,
                query: searchInput,
                limit: "20",
                page: "1",
              });
            }}
            variant="contained"
          >
            Filter
          </Button>
        </section>
        {/* SECTION 3 (TWEETS TABLE) */}
        <section>
          {isLoading && <LoadingIndicator />}

          <div className="topic-table-wrapper">
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
              <table className="topic-table" width={"100%"}>
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Tweep Handler</th>
                    <th>Tweet</th>
                  </tr>
                </thead>
                <tbody>
                  {tweetsData.tweets?.map((tweet, index) => (
                    <tr key={`${index}-${tweet.tweetId}`}>
                      <td>{topic?.name}</td>
                      <td>{tweet.text}</td>
                      <td>{tweet.text}</td>
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
          {tweetsData && tweetsData?.meta?.last_page > 1 && (
            <Pagination
              color="primary"
              count={Math.ceil(tweetsData.meta.last_page)}
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
