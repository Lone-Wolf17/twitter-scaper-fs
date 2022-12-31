import { useCallback, useMemo, useState } from "react";
import { returnValue } from "../types/topic.dto";
import { routeType } from "../types/tweet.dto";
import axiosInstance from "../utils/axios-utils";

function TweetApi(routeType: routeType): returnValue {
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
  const getTopicTweets = useCallback(
    (urlParams: string) => {
      setIsLoading(true);
      return new Promise((resolve, reject) => {
        const headers = { "Content-Type": "application/json" };
        axiosInstance
          .get(`/topics/tweets?${urlParams}`, { headers })
          .then((res: any) => {
            onSuccess();
            resolve(res);
          })
          .catch((err: any) => {
            onFailure(err);
            reject(err);
          });
      });
    },
    [onFailure, onSuccess]
  );

  const setTweetBookmarkStatus = useCallback(
    (payload: any) => {
      setIsLoading(true);
      return new Promise((resolve, reject) => {
        const headers = { "Content-Type": "application/json" };
        axiosInstance
          .put(`/topics/tweets/setBookmarkStatus`, payload, {
            headers,
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

  const getBookmarkedTweets = useCallback(() => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      const headers = { "Content-Type": "application/json" };
      axiosInstance
        .get(`/topics/tweets/bookmarked`, {
          headers,
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
  }, [onFailure, onSuccess]);

  const defaultTopic = useCallback(() => {
    return new Promise((resolve, reject) => {
      reject();
    });
  }, []);

  const trigger = useMemo(() => {
    switch (routeType) {
      case "Get-All":
        return getTopicTweets;
      case "Set-Bookmark":
        return setTweetBookmarkStatus;
      case "Get-Bookmarked":
        return getBookmarkedTweets;
      default:
        return defaultTopic;
    }
  }, [
    defaultTopic,
    getBookmarkedTweets,
    getTopicTweets,
    routeType,
    setTweetBookmarkStatus,
  ]);

  return [trigger, { isLoading, isError, error }];
}

export default TweetApi;
