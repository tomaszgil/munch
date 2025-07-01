import { useCallback } from "react";

import { store } from "./store";
import type { MessageUpdate } from "./types";

export const useMessageUpdate = () => {
  const updateMessage = useCallback((id: string, updates: MessageUpdate) => {
    return store.update(id, updates);
  }, []);

  return updateMessage;
};
