import { TaskType } from '@/types/types';
import { DatabaseName } from '@/utils/consts';
import Database from '@tauri-apps/plugin-sql';
import { createStore } from 'zustand/vanilla';

export type TasksState = {
  tasks: TaskType[];
};

export type TasksActions = {
  createTask: () => void;
  removeTask: (id: number) => void;
  editTask: (task: TaskType) => void;
  initTasks: () => void;
};

export type TasksStore = TasksState & TasksActions;

export const defaultInitState: TasksState = {
  tasks: [],
};

export const createTasksStore = (initState: TasksState = defaultInitState) => {
  return createStore<TasksStore>()((set, get) => ({
    ...initState,
    initTasks: async () => {
      try {
        const db = await Database.load(DatabaseName);
        const res = await db.select(`SELECT * FROM tasks`);
        set({ tasks: res as TaskType[] });
      } catch (err) {
        console.log(err);
      }
    },
    createTask: async () => {
      const db = await Database.load(DatabaseName);
      try {
        await db.execute('INSERT INTO tasks (name, isComplete, creationDate) VALUES ($1, $2, $3)', [
          'Новая задача',
          0,
          new Date().toISOString(),
        ]);
        get().initTasks();
      } catch (err) {
        console.log(err);
      }
    },
    editTask: async task => {
      const db = await Database.load(DatabaseName);
      try {
        await db.execute(
          `UPDATE tasks
        SET name = $1, deadlineDate = $2, isComplete = $3, description = $4, color = $5, priority = $6
        WHERE id = $7`,
          [
            task.name,
            task.deadlineDate,
            task.isComplete,
            task.description,
            task.color,
            task.priority,
            task.id,
          ],
        );
        get().initTasks();
      } catch (err) {
        console.log(err);
      }
    },
    removeTask: async id => {
      const db = await Database.load(DatabaseName);
      await db.execute(`DELETE FROM tasks WHERE id = $1`, [id]);
      get().initTasks();
    },
  }));
};
