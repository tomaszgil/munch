import { useSyncExternalStore } from "react";

import { store } from "./store";
import type { Message } from "./types";

export const useMessages = () => {
  return useSyncExternalStore<Array<Message>>(store.subscribe, store.get);
};
