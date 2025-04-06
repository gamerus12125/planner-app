export type DayEventType = {
  id: number;
  name: string;
  date?: string;
  start: number;
  end: number;
  color: string;
  description: string;
  type: "standard" | "connected";
  rootEventId?: number;
  repeat?: string;
};

export type TaskType = {
  id: number;
  name: string;
  description?: string;
  isComplete: number;
  creationDate?: string;
  deadlineDate: string;
  columnId: number;
  categoryId?: number;
  color?: string;
  orderNumber: number;
  hasDeadline: number;
  priority?: "high" | "middle" | "low"
};

export type CategoryType = {
  id: number;
  name: string;
  description?: string;
  color?: string;
}

export type CategoryColumnType = {
  id: number;
  name: string;
  color?: string;
  categoryId: number;
  orderNumber: number;
}

export type ActionType = {
  id: number;
  name: string;
  description?: string;
  isComplete: number;
  priority?: number;
  createdDate?: string;
  color?: string;
  deadlineDate?: string;
  categoryId?: number;
}

export type ViewType = "list" | "kanban";

export type FilterType = {
  name: string;
  key: string
  sortFunction: (tasks: TaskType[]) => TaskType[]
}

export type PriorityType = {
  name: string;
  key: "high" | "middle" | "low";
}