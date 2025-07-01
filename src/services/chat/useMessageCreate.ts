import { useCallback } from "react";
import { store } from "./store";
import type { Message, MessageCreate } from "./types";

export const useMessageCreate = () => {
  const createMessage = useCallback((message: MessageCreate) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
    };
    return store.create(newMessage);
  }, []);

  return createMessage;
};
