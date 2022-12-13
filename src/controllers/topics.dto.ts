type CreateTopicsBody = {
  name: string;
  description: string;
};

type ListTopicParams = {
  take?: number;
  skip?: number;
};

type GetByTopicIDParams = {
  topicID?: string;
  page?: number;
  startTime?: string;
  endTime?: string;
  query?: string;
  text?: string;
  orderBy?: "asc" | "desc";
};

export { CreateTopicsBody, ListTopicParams, GetByTopicIDParams };
