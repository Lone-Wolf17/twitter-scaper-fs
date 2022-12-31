import { useCallback, useMemo, useState } from "react";

import { returnValue, routeType, Topics } from "../types/topic.dto";

import axiosInstance from "../utils/axios-utils";

function TopicApi(routeType: routeType): returnValue {
  const [isLoading, setIsLoading] = useState(false);

  const [isError, setIsError] = useState(false);

  const [error, setError] = useState<object | null>(null);

  const onSuccess = useCallback(() => {
    setError(null);

    setIsLoading(false);

    setIsError(false);
  }, []);

  const onFailure = useCallback((err: any) => {
    setError(err);

    setIsLoading(false);

    setIsError(true);
  }, []);

  const getAllTopics = useCallback(
    ({ page, limit }: { page: number; limit: number }) => {
      setIsLoading(true);

      return new Promise((resolve, reject) => {
        axiosInstance
          .get(`/topics/all??page=${page}&limit=${limit}`)
          .then((res) => {
            onSuccess();

            resolve(res);
          })
          .catch((err) => {
            onFailure(err);

            reject(err);
          });
      });
    },
    [onFailure, onSuccess]
  );

  const addTopic = useCallback(
    (bodyData: Pick<Topics, "name" | "description">) => {
      setIsLoading(true);

      return new Promise((resolve, reject) => {
        axiosInstance

          .post("/topics/create", bodyData, {
            headers: { "Content-Type": "application/json" },
          })

          .then((res) => {
            onSuccess();

            resolve(res);
          })

          .catch((err) => {
            onFailure(err);

            reject(err);
          });
      });
    },
    [onFailure, onSuccess]
  );

  const editTopic = useCallback(
    ({
      bodyData,
      id,
    }: {
      bodyData: Pick<Topics, "name" | "description">;
      id: string;
    }) => {
      setIsLoading(true);

      return new Promise((resolve, reject) => {
        axiosInstance

          .put(`/topics/${id}`, bodyData, {
            headers: { "Content-Type": "application/json" },
          })

          .then((res) => {
            onSuccess();

            resolve(res);
          })

          .catch((err) => {
            onFailure(err);

            reject(err);
          });
      });
    },
    [onFailure, onSuccess]
  );

  const deleteTopic = useCallback(
    (id: string) => {
      setIsLoading(true);

      return new Promise((resolve, reject) => {
        axiosInstance

          .delete(`/topics/${id}`)

          .then((res) => {
            onSuccess();

            resolve(res);
          })

          .catch((err) => {
            onFailure(err);

            reject(err);
          });
      });
    },
    [onFailure, onSuccess]
  );

  const defaultTopic = useCallback(() => {
    return new Promise((resolve, reject) => {});
  }, []);

  const trigger = useMemo(() => {
    switch (routeType) {
      case "Get-All":
        return getAllTopics;

      case "Add-New":
        return addTopic;

      case "Edit":
        return editTopic;

      case "Delete":
        return deleteTopic;

      default:
        return defaultTopic;
    }
  }, [addTopic, deleteTopic, editTopic, getAllTopics, defaultTopic, routeType]);

  return [trigger, { isLoading, isError, error }];
}

export default TopicApi;
