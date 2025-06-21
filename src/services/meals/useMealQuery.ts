import { useCallback, useSyncExternalStore } from "react";
import { store } from "./store";
import type { Meal } from "./types";

export const useMealQuery = (id: string) => {
  const getMeal = useCallback(() => store.getById(id), [id]);
  return useSyncExternalStore<Meal | undefined>(store.subscribe, getMeal);
};
