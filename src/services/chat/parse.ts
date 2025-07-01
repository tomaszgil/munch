import { MessageSchema } from "./types";
import type { Message } from "./types";

export const parseMessage = (message: Message) => {
  return MessageSchema.parse(message);
};
