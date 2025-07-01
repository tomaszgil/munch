import { useCallback } from "react";

import { store } from "./store";

export function useMessagesReset() {
  return useCallback(() => {
    store.reset();
  }, []);
}
