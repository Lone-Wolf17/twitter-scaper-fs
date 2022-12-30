import { TextareaAutosize, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import Header from "../components/Header";
import "../styles/topicsPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { EditRounded, DeleteRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { BackendEndpoints } from "../constants/BackendEndpoints";
import LoadingIndicator from "../components/LoadingIndicator";

interface Topics {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
}

const TopicsPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState<Topics[] | null>(null);
  const [isCurrentlyEditingTopic, setIsCurrentlyEditingTopic] = useState(false);
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
    setIsLoading(true);
    try {
      const res = await axios.post(BackendEndpoints.createTopic, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res?.data?.message);
      setName("");
      setDescription("");
      // refetch all topics
      getAllTopics();
    } catch (err: any) {
      console.log(err);
      toast.error(
        `${err?.response?.data?.message} ${err?.response?.data?.code}`
      );
      setName("");
      setDescription("");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTopics = useCallback(async () => {
    // fetchs all topics from db
    setIsLoading(true);
    try {
      // console.log("URL:::: ", BackendEndpoints.fetchTopics);
      // console.log("ENV DOMAIN:::", process.env.REACT_APP_BACKEND_DOMAIN);
      // console.log("ENV File:: ", process.env);
      const res = await axios.get(BackendEndpoints.fetchTopics);
      if (res.data?.success) {
        setTopics(res.data.topics);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.code);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const editTopic = async () => {
    // edit a single topic in db
    try {
    } catch (err) {}
  };

  const deleteTopic = async () => {
    // delete a single topic in db
    try {
    } catch (error) {}
  };

  const handleEditIconClick = (topic: Topics) => {
    // handles feature of editting a topic
    setIsCurrentlyEditingTopic(true);
    setName(topic.name);
    setDescription(topic.description);
  };

  // routes a user to the topic tweet page when a topic is clicked
  const navigateToTopicTweets = (topic: Topics) => {
    navigate(`/tweets/${topic.id}`, { state: topic });
  };

  useEffect(() => {
    // on first render fetch all topics
    getAllTopics();
  }, [getAllTopics]);

  return (
    <div className="topic-wrapper">
      <Header />
      <main>
        {/* SECTION 1 (Add or Edit Tweets) */}
        <section className="topic-create">
          <h1>{`${
            isCurrentlyEditingTopic ? "Edit an existing" : "Add a new"
          } Topic`}</h1>
          <TextField
            inputProps={{
              "data-testid": "topic-name",
            }}
            value={name}
            label={`${isCurrentlyEditingTopic ? "Edit" : "Add"} Topic Name`}
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
          <Button
            onClick={handleAddTopic}
            variant="contained"
            sx={{
              width: "fit-content",
              padding: ".2em 3em",
              alignSelf: "flex-end",
            }}
          >
            {isCurrentlyEditingTopic ? "Edit" : "Add"}
          </Button>
        </section>
        {/* SECTION 2 (Topics Table) */}
        <section className="topic-list">
          <h2>Topics</h2>
          <div style={{
            textAlign:'center'
          }}>
            <LoadingIndicator isLoading={isLoading}/>
          </div>
          <div className="topic-table-wrapper">
            {topics && topics.length > 0 ? (
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
                  {topics?.map((topic, index) => (
                    <tr
                      style={{ cursor: "pointer" }}
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
                      <td>
                        {" "}
                        <DeleteRounded sx={{ cursor: "pointer" }} />{" "}
                      </td>
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
                No Topic Found
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TopicsPage;
