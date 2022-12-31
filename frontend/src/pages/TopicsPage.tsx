import {
  Pagination,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";

import Header from "../components/Header";
import "../styles/topicsPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { EditRounded, DeleteRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { BackendEndpoints } from "../constants/BackendEndpoints";
import LoadingIndicator from "../components/LoadingIndicator";
import { IsCurrentlyEditingTopic, Topics } from "../types/topic.dto";
import useTopicApi from "../api-hooks/useTopicApi";

const TopicsPage = () => {
  const navigate = useNavigate();
  const [
    getTopicTrigger,
    { isLoading: getTopicIsLoading, isError: getTopicIsError },
  ] = useTopicApi("Get-All");
  const [addTopicTrigger, { isLoading: addTopicIsLoading }] =
    useTopicApi("Add-New");
  const [editTopicTrigger, { isLoading: editTopicIsLoading }] =
    useTopicApi("Edit");
  const [deleteTopicTrigger] = useTopicApi("Delete");

  // const [isLoading, setIsLoading] = useState(false);

  const [topicsData, setTopicsData] = useState<{
    topics: Topics[];
    meta: any;
  } | null>(null);

  const [isCurrentlyEditingTopic, setIsCurrentlyEditingTopic] =
    useState<IsCurrentlyEditingTopic>({ value: false, topic: null });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    []
  );
  const onDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value),
    []
  );

  const handleAddTopic = async () => {
    const payload = JSON.stringify({
      name: name,
      description: description,
    });
    // setIsLoading(true);
    try {
      const res: any = await addTopicTrigger(payload);

      toast.success(res?.data?.message);
      setName("");
      setDescription("");
      // refetch all topics
      handleGetAllTopics();
    } catch (err: any) {
      console.log(err);
      if (err?.response?.data?.errors[0]?.message)
        toast.error(err?.response?.data?.errors[0]?.message);
      else toast.error("Sorry an error occurred, try again later");
      setName("");
      setDescription("");
    }
  };

  const handleGetAllTopics = useCallback(
    async (page = 1, limit = 50) => {
      // fetchs all topics from db
      getTopicTrigger({ page, limit }).then((res: any) => {
        setTopicsData({ topics: res?.data?.topics, meta: res?.data?.meta });
      });
    },
    [getTopicTrigger]
  );

  const handleEditTopic = async () => {
    // edit a single topic in db

    // ignore edit if user didnt make any change
    const shouldIgnore =
      name === isCurrentlyEditingTopic.topic?.name &&
      description === isCurrentlyEditingTopic.topic.description;

    if (shouldIgnore) {
      setName("");
      setDescription("");
      return;
    }
    // setIsLoading(true);

    try {
      const payload = JSON.stringify({
        name,
        description,
      });

      await editTopicTrigger({
        payload,
        id: isCurrentlyEditingTopic.topic?.id,
      });
      toast.success("Topic Edited Successfully");
      setName("");
      setDescription("");

      setIsCurrentlyEditingTopic({ value: false, topic: null });

      // refetch all topics
      handleGetAllTopics(Number(topicsData?.meta.current_page), 50);
    } catch (err: any) {
      toast.error(
        `${err?.response?.data?.message} ${err?.response?.data?.code}`
      );
    }
  };

  const handleDeleteTopic = async (topic: Topics) => {
    // delete a single topic in db
    try {
      const res: any = await deleteTopicTrigger(topic.id);
      toast.success(res?.data?.message);

      //remove deleted item
      const newArr = topicsData!?.topics.filter((item) => item.id !== topic.id);
      setTopicsData({ meta: topicsData?.meta, topics: newArr });
    } catch (err: any) {
      toast.error(
        `${err?.response?.data?.message} ${err?.response?.data?.code}`
      );
    }
  };

  const handleEditIconClick = (topic: Topics) => {
    // handles feature of editting a topic
    setIsCurrentlyEditingTopic({ value: true, topic });
    setName(topic.name);
    setDescription(topic.description);
  };

  // handles pagination on page change
  const handlePaginationOnchange = (
    e: React.ChangeEvent<unknown>,
    value: number
  ) => {
    handleGetAllTopics(value);
  };

  // routes a user to the topic tweet page when a topic is clicked
  const navigateToTopicTweets = (topic: Topics) => {
    navigate(`/topics/tweets/${topic.id}`, { state: topic });
  };

  useEffect(() => {
    // on first render fetch all topics
    handleGetAllTopics();
  }, [handleGetAllTopics]);

  return (
    <div className="topic-wrapper">
      <Header />
      <main>
        {/* SECTION 1 (Add or Edit Tweets) */}
        <section className="topic-create">
          <h1>{`${
            isCurrentlyEditingTopic.value ? "Edit an existing" : "Add a new"
          } Topic`}</h1>
          <TextField
            inputProps={{
              "data-testid": "topic-name",
            }}
            value={name}
            label={`${
              isCurrentlyEditingTopic.value ? "Edit" : "Add"
            } Topic Name`}
            variant="outlined"
            onChange={onNameChange}
          />
          <TextareaAutosize
            data-testid="topic-desc"
            value={description}
            aria-label="empty textarea"
            placeholder="Description"
            onChange={onDescriptionChange}
            style={{
              maxWidth: "100%",
              minWidth: "100%",
              maxHeight: "400px",
              minHeight: "100px",
            }}
          />
          {addTopicIsLoading || editTopicIsLoading ? (
            <Typography
              component={"div"}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <LoadingIndicator size={20} />
            </Typography>
          ) : (
            <Button
              onClick={() =>
                isCurrentlyEditingTopic.value
                  ? handleEditTopic()
                  : handleAddTopic()
              }
              variant="contained"
              sx={{
                width: "fit-content",
                padding: ".2em 3em",
                alignSelf: "flex-end",
              }}
            >
              {isCurrentlyEditingTopic.value ? "Edit" : "Add"}
            </Button>
          )}
        </section>
        {/* SECTION 2 (Topics Table) */}
        <section className="topic-list">
          <h2>Topics</h2>
          <div
            style={{
              textAlign: "center",
            }}
          >
            {getTopicIsLoading ? (
              <LoadingIndicator />
            ) : getTopicIsError ? (
              <p>An Error Ocurred While Fetching, Please try again later</p>
            ) : (
              <></>
            )}
          </div>
          <div className="topic-table-wrapper">
            {topicsData && topicsData.topics.length > 0 ? (
              <table className="topic-table" width={"100%"}>
                <thead>
                  <tr>
                    <th>Date-Created</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {topicsData?.topics?.map((topic, index) => (
                    <tr
                      style={{
                        opacity:
                          isCurrentlyEditingTopic.topic?.id === topic.id
                            ? 0.4
                            : 1,
                      }}
                      id={`topic-${topic.id}`}
                      key={`${index}-${topic.id}`}
                    >
                      <td onClick={() => navigateToTopicTweets(topic)}>
                        {new Date(topic.createdAt).toLocaleString()}
                      </td>
                      <td onClick={() => navigateToTopicTweets(topic)}>
                        {topic.name}
                      </td>
                      <td onClick={() => navigateToTopicTweets(topic)}>
                        {topic.description}
                      </td>
                      <td onClick={() => handleEditIconClick(topic)}>
                        <EditRounded sx={{ cursor: "pointer" }} />
                      </td>
                      <td onClick={() => handleDeleteTopic(topic)}>
                        <DeleteRounded sx={{ cursor: "pointer" }} />{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : topicsData?.topics?.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "1.2rem",
                  marginTop: "2em",
                }}
              >
                No Topic Found
              </p>
            ) : (
              <></>
            )}
          </div>
          {/* PAGINATION */}
          {topicsData?.meta?.last_page > 1 && (
            <Pagination
              color="primary"
              count={topicsData?.meta?.last_page}
              size="large"
              onChange={handlePaginationOnchange}
              sx={{ display: "flex", justifyContent: "center" }}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default TopicsPage;
