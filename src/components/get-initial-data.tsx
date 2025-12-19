'use client';
import { useEventsStore } from '@/utils/providers/events-store-provider';
import { useTasksStore } from '@/utils/providers/tasks-store-provider';
import { useEffect } from 'react';

export const GetInitialData = () => {
  const initTasks = useTasksStore(store => store.initTasks);
  const initEvents = useEventsStore(store => store.initEvents);

  useEffect(() => {
    initTasks();
    initEvents();
  });

  return null;
};
