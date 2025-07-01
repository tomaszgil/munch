import { z } from "zod/v4";

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  cancelled: z.boolean().optional(),
  meals: z.array(z.object({ index: z.number(), id: z.string() })).optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export const MessageCreateSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export type MessageCreate = z.infer<typeof MessageCreateSchema>;
export type MessageUpdate = Partial<Omit<Message, "id">>;
