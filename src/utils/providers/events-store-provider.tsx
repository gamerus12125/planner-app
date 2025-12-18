'use client';

import { createEventsStore, EventsStore } from '@/stores/events-store';
import { type ReactNode, createContext, useContext, useState } from 'react';
import { useStore } from 'zustand';

export type EventsStoreApi = ReturnType<typeof createEventsStore>;

export const EventsStoreContext = createContext<EventsStoreApi | undefined>(undefined);

export interface EventsStoreProviderProps {
  children: ReactNode;
}

export const EventsStoreProvider = ({ children }: EventsStoreProviderProps) => {
  const [store] = useState(() => createEventsStore());

  return <EventsStoreContext.Provider value={store}>{children}</EventsStoreContext.Provider>;
};

export const useEventsStore = <T,>(selector: (store: EventsStore) => T): T => {
  const eventsStoreContext = useContext(EventsStoreContext);

  if (!eventsStoreContext) {
    throw new Error(`useEventsStore must be used within EventsStoreProvider`);
  }

  return useStore(eventsStoreContext, selector);
};
