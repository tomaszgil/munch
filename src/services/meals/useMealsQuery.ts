import { useSyncExternalStore } from "react";
import { store } from "./store";
import type { Meal } from "./types";

export const useMealsQuery = () => {
  return useSyncExternalStore<Meal[]>(store.subscribe, store.get);
};
