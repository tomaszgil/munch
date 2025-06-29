import { useCallback } from "react";

import { store } from "./store";

export function useMealDelete() {
  return useCallback((mealId: string) => {
    return store.delete(mealId);
  }, []);
}
