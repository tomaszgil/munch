import { useCallback } from "react";
import { store } from "./store";

export function useMealDelete() {
  return useCallback((mealId: string) => {
    store.delete(mealId);
  }, []);
}
