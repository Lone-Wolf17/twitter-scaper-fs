const baseUrl = "http://localhost:8080";
export const BackendEndpoints = {
  baseUrl,
  createTopic: baseUrl + "/topics/create",
  fetchTopics: baseUrl + "/topics/all",
  fetchTopicTweets: baseUrl + "/topics/tweets",
};
