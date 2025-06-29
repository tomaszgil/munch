import { useCallback, useRef, useState } from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

import { useLazyAsync } from "@/utils/useAsync";

import { getSession } from "@/services/chat/session";
import type { Message } from "@/components/chat/ChatMessage";
import { Feed } from "@/components/chat/Feed";
import { PromptForm } from "@/components/chat/PromptForm";

export const Route = createFileRoute("/generate/")({
  component: Generate,
  loader: async () => {
    const available: "available" | "unavailable" =
      // @ts-expect-error
      await LanguageModel.availability();
    return { available };
  },
});

async function generateMeal(prompt: string, options: { signal: AbortSignal }) {
  const session = await getSession();
  const result = await session.prompt(prompt, options);
  return result;
}

function Generate() {
  const { available } = useLoaderData({ from: Route.id });

  const [messages, setMessages] = useState<Message[]>([]);

  const promptAbortController = useRef<AbortController>(new AbortController());
  const promptExecuteFn = useCallback(async (prompt: string) => {
    const result = await generateMeal(prompt, {
      signal: promptAbortController.current.signal,
    });
    setMessages((messages) => [
      ...messages,
      { role: "assistant", content: result || "" },
    ]);
  }, []);

  const [promptExecute, promptState] = useLazyAsync(promptExecuteFn);

  if (available === "unavailable") {
    // TODO: render a nice error message
    return <div>Language model is not available</div>;
  }

  return (
    <Feed
      messages={messages}
      isLoading={promptState.isLoading}
      form={
        <PromptForm
          isLoading={promptState.isLoading}
          onSubmit={(prompt) => {
            setMessages((messages) => [
              ...messages,
              { role: "user", content: prompt },
            ]);

            promptExecute(prompt);
          }}
          onAbort={() => {
            promptAbortController.current.abort();
          }}
        />
      }
    />
  );
}
