import { TextareaAutosize, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";

import Header from "../components/Header";
import "../styles/topicsPage.css";
import { BackendEndpoints } from "../constants/BackendEndpoints";

const TopicsPage = () => {
  const [name, setname] = useState("");
  const [description, setDescription] = useState("");

  const onNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setname(e.target.value),
    []
  );
  const onChangeDescription = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value),
    []
  );

  const handleAddTopic = async () => {
    const payload = JSON.stringify({
      name: name,
      description: description,
    });

    try {
      const res = await axios.post(BackendEndpoints.createTopic, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getAllTopics = async () => {
      try {
        const res = await axios.get(BackendEndpoints.fetchTopics);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    getAllTopics();
  }, []);

  return (
    <div className="topic-wrapper">
      <Header />
      <main>
        <section className="topic-create">
          <h1>Add a new topic</h1>
          <TextField
            value={name}
            label="Add Topic Name"
            variant="outlined"
            onChange={onNameChange}
          />
          <TextareaAutosize
            value={description}
            aria-label="empty textarea"
            placeholder="Description"
            onChange={onChangeDescription}
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
            Add
          </Button>
        </section>
        <section className="topic-list">
          <h2>Topics</h2>
        </section>
      </main>
    </div>
  );
};

export default TopicsPage;
