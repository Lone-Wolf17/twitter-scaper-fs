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
};

export { CreateTopicsBody, ListTopicParams, GetByTopicIDParams };
