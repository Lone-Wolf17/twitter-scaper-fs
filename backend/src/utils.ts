import slugify from "slugify";

interface PaginationParams<T> {
  current_page?: number;
  limit?: number;
  item_count: number;
}

export function paginateResult<T>({
  current_page = 1,
  limit = 50,
  item_count,
}: PaginationParams<T>) {
  const last_page = Math.ceil(item_count / limit);
  return {
    meta: {
      current_page,
      limit,
      last_page: last_page === 0 ? 1 : last_page,
      prev_page: current_page === 1 ? null : current_page - 1,
      next_page: current_page >= last_page ? null : Number(current_page) + 1,
    },
  };
}

export const slugifyTopic = (topic: string) =>
  slugify(topic, { replacement: "_" });

interface BackendErrorTemplate {
  code: string;
  message: string;
  status: boolean;
  errors?: any;
}
