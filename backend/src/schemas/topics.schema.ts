import { date, object, preprocess, string, TypeOf } from "zod";

export const createTopicSchema = object({
  body: object({
    name: string({ required_error: "name is required" }),
    description: string({ required_error: "description is required" }),
  }),
});

const dateSchema = preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, date()).optional();

export const searchTweetsSchema = object({
  query: object({
    topicID: string({ required_error: "topicID is required" }),
    startTime: dateSchema,
    endTime: dateSchema,
    query: string().optional(),
    orderBy: string().optional(),
  }),
});

export type CreateTopicInput = TypeOf<typeof createTopicSchema>["body"];
export type UpdateTopicBody = CreateTopicInput;
