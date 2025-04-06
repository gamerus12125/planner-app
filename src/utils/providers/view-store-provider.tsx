"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type ViewStore, createViewStore } from "../stores/view-store";

export type ViewStoreApi = ReturnType<typeof createViewStore>;

export const ViewStoreContext = createContext<ViewStoreApi | undefined>(
  undefined
);

export interface ViewStoreProviderProps {
  children: ReactNode;
}

export const ViewStoreProvider = ({
  children,
}: ViewStoreProviderProps) => {
  const storeRef = useRef<ViewStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createViewStore();
  }

  return (
    <ViewStoreContext.Provider value={storeRef.current}>
      {children}
    </ViewStoreContext.Provider>
  );
};

export const useViewStore = <T,>(
  selector: (store: ViewStore) => T
): T => {
  const viewStoreContext = useContext(ViewStoreContext);


  if (!viewStoreContext) {
    throw new Error(`useViewStore must be used within ViewStoreProvider`);
  }

  return useStore(viewStoreContext, selector);
};
