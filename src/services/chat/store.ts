import type { Message, MessageUpdate } from "./types";
import { parseMessage } from "./parse";

const key = "v1/messages";

let resultString: string = "";
let resultParsed: Array<Message> = [];

export const store = {
  subscribe: (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  },
  get: () => {
    const storedString = localStorage.getItem(key) || "";
    if (storedString !== resultString) {
      const rawResultParsed = storedString ? JSON.parse(storedString) : [];
      resultParsed = rawResultParsed.map(parseMessage);
      resultString = storedString;
    }
    return resultParsed;
  },
  getById: (id: string) => {
    return store.get().find((message) => message.id === id);
  },
  set: (value: Array<Message>) => {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("storage"));
  },
  create: (message: Message) => {
    const updatedMessages = [...store.get(), message];
    store.set(updatedMessages);
    return message;
  },
  update: (id: string, updates: MessageUpdate) => {
    const updatedMessages = store
      .get()
      .map((message) =>
        message.id === id ? { ...message, ...updates } : message
      );
    store.set(updatedMessages);
    return updatedMessages.find((message) => message.id === id);
  },
  reset: () => {
    store.set([]);
  },
};
