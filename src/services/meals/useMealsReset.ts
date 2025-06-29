import { useCallback } from "react";

import { store } from "./store";

export function useMealsReset() {
  return useCallback(() => {
    store.reset();
  }, []);
}
