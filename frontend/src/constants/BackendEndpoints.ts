const baseUrl = "http://localhost:8080";
export const BackendEndpoints = {
  baseUrl,
  createTopic: baseUrl + "/topics/create",
  fetchTopics: (page: number, limit: number) =>
    baseUrl + `/topics/all?page=${page}&limit=${limit}`,
  fetchTopicTweets: baseUrl + "/topics/tweets",
  editTopic: (id: string): string => baseUrl + "/topics/" + id,
  deleteTopic: (id: string): string => baseUrl + "/topics/" + id,
};
