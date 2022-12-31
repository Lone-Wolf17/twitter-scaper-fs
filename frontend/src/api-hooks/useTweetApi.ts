import { refType } from "@mui/utils";
import { useCallback, useMemo, useState } from "react";
import { returnValue } from "../types/topic.dto";
import { routeType } from "../types/tweet.dto";
import axiosInstance from '../utils/axios-utils';

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
        axiosInstance
          .get(`/topics/tweets?${urlParams}`)
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

  const defaultTopic = useCallback(() => {
    return new Promise((resolve, reject) => {
      reject();
    });
  }, []);

  const trigger = useMemo(() => {
    switch (routeType) {
      case "Get-All":
        return getTopicTweets;
      default:
        return defaultTopic;
    }
  }, [defaultTopic, getTopicTweets, routeType]);
  return [trigger, { isLoading, isError, error }];
}

export default TweetApi;