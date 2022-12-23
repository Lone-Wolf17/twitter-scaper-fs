import { date, object, preprocess, string, TypeOf } from "zod";

const pageNumberSchema = string()
  .refine((s) => {
    const n = Number(s);
    return !Number.isNaN(n) && Number.isInteger(n) && n > 0;
  })
  .transform(Number)
  .optional();

const paginationLimitSchema = string()
  .refine((s) => {
    const n = Number(s);
    return !Number.isNaN(n) && Number.isInteger(n) && n > 0;
  })
  .transform(Number)
  .optional();

const dateSchema = preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, date()).optional();

export const createTopicSchema = object({
  body: object({
    name: string({ required_error: "name is required" }),
    description: string({ required_error: "description is required" }),
  }),
});

export const fetchTopicsSchema = object({
  query: object({
    page: pageNumberSchema,
    limit: paginationLimitSchema,
  }),
});

export const fetchTweetsSchema = object({
  query: object({
    topicID: string({ required_error: "topicID is required" })
      .uuid()
      .optional(),
    startTime: dateSchema,
    endTime: dateSchema,
    query: string().optional(),
    orderBy: string().optional(),
    page: pageNumberSchema,
    limit: paginationLimitSchema,
  }),
});

export type CreateTopicInput = TypeOf<typeof createTopicSchema>["body"];
export type UpdateTopicBody = CreateTopicInput;
export type FetchTopicsInput = TypeOf<typeof fetchTopicsSchema>["query"];
export type FetchTweetsInput = TypeOf<typeof fetchTweetsSchema>["query"];
