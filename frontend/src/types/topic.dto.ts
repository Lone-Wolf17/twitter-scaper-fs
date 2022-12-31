interface Topics {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
}

interface IsCurrentlyEditingTopic {
  value: boolean;
  topic: null | Topics;
}

type routeType = "Get-All" | "Add-New" | "Edit" | "Delete";

type TriggerType = (param?: any) => Promise<unknown>;

type returnValue = [
  TriggerType,
  {
    isLoading: boolean;
    isError: boolean;
    error: object | null;
  }
];

export type {
  Topics,
  IsCurrentlyEditingTopic,
  TriggerType,
  routeType,
  returnValue,
};
