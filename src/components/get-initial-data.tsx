import { useEventsStore } from '@/utils/providers/events-store-provider';
import { useTasksStore } from '@/utils/providers/tasks-store-provider';

export const GetInitialData = () => {
  const initTasks = useTasksStore(store => store.initTasks);
  const initEvents = useEventsStore(store => store.initEvents);
  initTasks();
  initEvents();
  return null;
};
