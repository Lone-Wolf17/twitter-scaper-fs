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

      return new Promise(async (resolve, reject) => {
        try {
          const res = axiosInstance.get(
            `/topics/all?page=${page}&limit=${limit}`
          );

          onSuccess();

          resolve(res);
        } catch (err) {
          onFailure(err);

          reject(err);
        }
      });
    },
    [onFailure, onSuccess]
  );

  const addTopic = useCallback(
    (bodyData: Pick<Topics, "name" | "description">) => {
      setIsLoading(true);

      return new Promise(async (resolve, reject) => {
        try {
          const res = await axiosInstance.post("/topics/create", bodyData, {
            headers: { "Content-Type": "application/json" },
          });
          onSuccess();
          resolve(res);
        } catch (err) {
          onFailure(err);
          reject(err);
        }
      });
    },
    [onFailure, onSuccess]
  );

  const editTopic = useCallback(
    ({
      payload,
      id,
    }: {
      payload: Pick<Topics, "name" | "description">;
      id: string;
    }) => {
      setIsLoading(true);

      return new Promise(async (resolve, reject) => {
        try {
          const res = await axiosInstance.put(`/topics/${id}`, payload, {
            headers: { "Content-Type": "application/json" },
          });
          onSuccess();
          resolve(res);
        } catch (err) {
          onFailure(err);
          reject(err);
        }
      });
    },
    [onFailure, onSuccess]
  );

  const deleteTopic = useCallback(
    (id: string) => {
      setIsLoading(true);

      return new Promise(async (resolve, reject) => {
        try {
          const res = await axiosInstance.delete(`/topics/${id}`);
          onSuccess();
          resolve(res);
        } catch (err) {
          onFailure(err);
          reject(err);
        }
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
