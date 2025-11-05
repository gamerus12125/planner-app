'use client';

import { createTasksStore, TasksStore } from '@/stores/tasks-store';
import { type ReactNode, createContext, useContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';

export type TasksStoreApi = ReturnType<typeof createTasksStore>;

export const TasksStoreContext = createContext<TasksStoreApi | undefined>(undefined);

export interface TasksStoreProviderProps {
  children: ReactNode;
}

export const TasksStoreProvider = ({ children }: TasksStoreProviderProps) => {
  const storeRef = useRef<TasksStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createTasksStore();
  }

  useEffect(() => {
    storeRef.current?.getState().initTasks();
  }, []);

  return (
    <TasksStoreContext.Provider value={storeRef.current}>{children}</TasksStoreContext.Provider>
  );
};

export const useTasksStore = <T,>(selector: (store: TasksStore) => T): T => {
  const tasksStoreContext = useContext(TasksStoreContext);

  if (!tasksStoreContext) {
    throw new Error(`useTasksStore must be used within TasksStoreProvider`);
  }

  return useStore(tasksStoreContext, selector);
};
