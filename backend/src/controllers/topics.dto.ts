type CreateTopicsBody = {
  name: string;
  description: string;
};

type UpdateTopicBody = CreateTopicsBody;

type ListTopicParams = {
  limit?: number;
  page?: number;
};

type GetByTopicIDParams = {
  topicID?: string;
  startTime?: string;
  endTime?: string;
  query?: string;
  orderBy?: "asc" | "desc";
};

export {
  CreateTopicsBody,
  ListTopicParams,
  GetByTopicIDParams,
  UpdateTopicBody,
};
