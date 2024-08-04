export type DayEvent = {
  id: number;
  name: string;
  date?: Date;
  start: number;
  end: number;
  color: string;
  description: string;
  type: "standard" | "connected";
  rootEventId?: number;
  repeat?: string;
};

export type Task = {
  id: number;
  name: string;
  isComplete: number;
};
