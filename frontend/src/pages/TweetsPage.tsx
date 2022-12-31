import React, {
  useEffect,
  useCallback,
  useState,
  ChangeEvent,
  useMemo,
} from "react";
import { useParams} from "react-router-dom";
import { toast } from "react-toastify";
import { SearchRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
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

import Header from "../components/Header";
import "../styles/tweetsPage.css";
import { GetTweetFilters, TweetData } from "../types/tweet.dto";
import useTweetApi from "../api-hooks/useTweetApi";
import TweetsTable from "../components/TweetsTable";

type OrderByType = "asc" | "desc";

const TweetsPage = () => {
  const { id = "" } = useParams();
  
  const [getTweetsTrigger, { isLoading: getTweetIsLoading, isError }] =
    useTweetApi("Get-All");
  
  // States
  const [tweetsData, setTweetsData] = useState<TweetData | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const [startTime, setStartTime] = useState<DateTime | null>(null);
  const [endTime, setEndTime] = useState<DateTime | null>(null);
  const [orderBy, setOrderBy] = useState<OrderByType>("desc");

  // Gets all the tweets
  const getTopicTweets = useCallback(
    async (filter: GetTweetFilters) => {
      const filterParams = { ...filter };
      // remove invalid params
      if (!filterParams.startTime) delete filterParams.startTime;
      if (!filterParams.endTime) delete filterParams.endTime;
      if (!filterParams.query) delete filterParams.query;
      if (!filterParams.bookmarked) delete filterParams.bookmarked;

      const params = Object.entries(filterParams);
      const searchParams = new URLSearchParams(params.toString());

      // setIsLoading(true);
      try {
        const res: any = await getTweetsTrigger(searchParams);
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
        startTime: startTime ? startTime.toISODate() : "",
        endTime: endTime ? endTime.toISODate() : "",
        orderBy: orderBy,
        query: e.target.value.trim(),
        limit: "20",
        page: "1",
      });
    },
    [debouncedSearchFunc, endTime, id, orderBy, startTime]
  );

  // handles pagination on page change
  const handlePaginationOnChange = (
    e: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getTopicTweets({
      topicID: id,
      startTime: startTime ? startTime.toISODate() : "",
      endTime: endTime ? endTime.toISODate() : "",
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
               onChange={searchInputOnChange}
               value={searchInput}
               type="text"
             />
           </div>
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
             sx={{ alignSelf: "center" }}
             disabled={getTweetIsLoading}
             onClick={() => {
               getTopicTweets({
                 topicID: id,
                 startTime: startTime ? startTime.toISODate() : "",
                 endTime: endTime ? endTime.toISODate() : "",
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
             sx={{ alignSelf: "center" }}
             disabled={getTweetIsLoading}
             onClick={() => {
               getTopicTweets({
                 topicID: id,
                 limit: "20",
                 page: "1",
               });
               setStartTime(null);
               setEndTime(null);
               setSearchInput("");
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
