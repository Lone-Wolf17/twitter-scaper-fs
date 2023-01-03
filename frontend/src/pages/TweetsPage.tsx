import React, {
  useEffect,
  useCallback,
  useState,
  ChangeEvent,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { SearchRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { DateTime } from "luxon";

import Header from "../components/Header";
import "../styles/tweetsPage.css";
import { GetTweetFilters, TweetData } from "../types/tweet.dto";
import useTweetApi from "../api-hooks/useTweetApi";
import TweetsTable from "../components/TweetsTable";
import CustomDatePicker from "../components/CustomDatePicker";

type OrderByType = "asc" | "desc";

const TweetsPage = () => {
  const { id } = useParams();

  const [getTweetsTrigger, { isLoading: getTweetIsLoading, isError }] =
    useTweetApi("Get-All");

  // States
  const [tweetsData, setTweetsData] = useState<TweetData | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const [startDate, setStartTime] = useState<DateTime | null>(null);
  const [endDate, setEndTime] = useState<DateTime | null>(null);
  const [orderBy, setOrderBy] = useState<OrderByType>("desc");

  // Gets all the tweets
  const getTopicTweets = useCallback(
    async (filter: GetTweetFilters) => {
      try {
        const res: any = await getTweetsTrigger(filter);
        setTweetsData(res?.data);

        // scroll page to top
        window.scrollTo(0, 0);
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

  const debouncedSearchFunc = useMemo(() => {
    let timeout: any = null;
    return (paramObject: any) => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        getTopicTweets(paramObject);
        timeout = null;
      }, 1000);
    };
  }, [getTopicTweets]);

  // Input callback func
  const startTimeOnChange = useCallback(
    (value: any) => setStartTime(value),
    []
  );
  const endTimeOnChange = useCallback((value: any) => setEndTime(value), []);

  const orderByOnChange = (event: SelectChangeEvent) =>
    setOrderBy(event.target.value as OrderByType);

  const searchInputOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
      debouncedSearchFunc({
        topicID: id,
        startTime: startDate ? startDate.toISODate() : "",
        endTime: endDate ? endDate.toISODate() : "",
        orderBy: orderBy,
        query: e.target.value.trim(),
        limit: "20",
        page: "1",
      });
    },
    [debouncedSearchFunc, endDate, id, orderBy, startDate]
  );

  // handles pagination on page change
  const handlePaginationOnChange = (
    e: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getTopicTweets({
      topicID: id,
      startTime: startDate ? startDate.toISODate() : "",
      endTime: endDate ? endDate.toISODate() : "",
      orderBy: orderBy,
      query: searchInput.trim(),
      limit: "20",
      page: value.toString(),
    });
  };

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
              role={"searchbox"}
              onChange={searchInputOnChange}
              value={searchInput}
              type="text"
            />
          </div>
        </section>
        <section className="tweets-sec2" style={{ pointerEvents: "auto" }}>
          {/* <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DesktopDatePicker
              label="Start Date"
              value={startDate}
              disableMaskedInput
              onChange={startTimeOnChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider> */}
          {/* <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DesktopDatePicker
              value={endTime}
              disableMaskedInput
              onChange={endTimeOnChange}
              renderInput={(params) => {
                console.log("Picker Params:: ", params);
                return (
                  <TextField
                    {...params}
                    inputProps={{
                      readOnly: true,
                      placeholder: "End Date",
                    }}
                    InputProps={{
                      ...params.InputProps,
                      className: "Mui-disabled",
                    }}
                  />
                );
              }}
            />
          </LocalizationProvider> */}
          <CustomDatePicker
            initialValue={startDate}
            label="Start Date"
            onChange={startTimeOnChange}
          />
          <CustomDatePicker
            initialValue={endDate}
            label="End Date"
            onChange={endTimeOnChange}
          />
          <FormControl fullWidth>
            <InputLabel id="orderLabelById">Order By</InputLabel>
            <Select
              labelId="orderLabelById"
              id="demo-simple-select"
              value={orderBy}
              label="Order By"
              inputProps={{ "data-testid": "orderBySelectBox" }}
              onChange={orderByOnChange}
            >
              <MenuItem value={"asc"}>Ascending</MenuItem>
              <MenuItem value={"desc"}>Decending</MenuItem>
            </Select>
          </FormControl>
          <Button
            data-testid="filterBtn"
            sx={{ alignSelf: "center", pointerEvents: "auto" }}
            disabled={getTweetIsLoading}
            onClick={() => {
              getTopicTweets({
                topicID: id,
                startTime: startDate ? startDate.toISODate() : "",
                endTime: endDate ? endDate.toISODate() : "",
                orderBy: orderBy,
                query: searchInput.trim(),
                limit: "20",
                page: "1",
              });
            }}
            variant="contained"
          >
            Filter
          </Button>
          <Button
            data-testid="resetBtn"
            sx={{ alignSelf: "center", pointerEvents: "auto" }}
            // disabled={getTweetIsLoading}
            onClick={() => {
              getTopicTweets({
                topicID: id,
                limit: "20",
                page: "1",
              });
              setStartTime(null);
              setEndTime(null);
              setSearchInput("");
              setOrderBy("desc");
            }}
            variant="contained"
          >
            Reset
          </Button>
        </section>
        {/* SECTION 3 (TABLE) */}
        <section>
          <TweetsTable
            isLoading={getTweetIsLoading}
            isError={isError}
            parentComponent={"Topic-Tweets"}
            tweetsData={tweetsData}
            paginationOnchange={handlePaginationOnChange}
          />
        </section>
      </main>
    </div>
  );
};

export default TweetsPage;
