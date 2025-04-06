import { ViewType } from "@/types/types";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";

export type ViewState = {
  view: ViewType;
};

export type ViewActions = {
  setView: (view: ViewType) => void;
};

export type ViewStore = ViewState & ViewActions;

export const defaultInitState: ViewState = {
  view: "kanban",
};

export const createViewStore = (initState: ViewState = defaultInitState) => {
  return createStore<ViewStore>()(
    persist(
      (set) => ({
        ...initState,
        setView: (view: ViewType) => set(() => ({ view })),
      }),
      {
        name: "view-store",
      }
    )
  );
};
