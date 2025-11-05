export type DayEventType = {
  id: number;
  name: string;
  date?: string;
  start: number;
  end: number;
  color?: string;
  description?: string;
  repeat?: string;
};

export type TaskType = {
  id: number;
  name: string;
  description?: string;
  isComplete: number;
  creationDate: string;
  deadlineDate?: string;
  color?: string;
  priority?: 'high' | 'middle' | 'low';
};

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
};

export type FilterType = {
  name: string;
  key: string;
  sortFunction: (tasks: TaskType[]) => TaskType[];
};

export type PriorityType = {
  name: string;
  key: 'high' | 'middle' | 'low';
};
