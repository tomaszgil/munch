import { useCallback, useRef } from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Box, Callout, Code, Heading, Text } from "@radix-ui/themes";
import { CrossCircledIcon } from "@radix-ui/react-icons";

import { useLazyAsync } from "@/utils/useAsync";

import { createSession, getSession } from "@/services/chat/session";
import { Feed } from "@/components/chat/Feed";
import { PromptForm } from "@/components/chat/PromptForm";
import { useMessages } from "@/services/chat/useMessages";
import { useMessageCreate } from "@/services/chat/useMessageCreate";
import { useMessagesReset } from "@/services/chat/useMessagesReset";
import { useMessageUpdate } from "@/services/chat/useMessageUpdate";
import type { Message } from "@/services/chat/types";

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

createSession();

function Generate() {
  const { available } = useLoaderData({ from: Route.id });

  const messages = useMessages();
  const pendingMessage = useRef<Message | null>(null);
  const createMessage = useMessageCreate();
  const updateMessage = useMessageUpdate();
  const resetMessages = useMessagesReset();

  const promptAbortController = useRef<AbortController>(new AbortController());
  const promptExecuteFn = useCallback(async (prompt: string) => {
    const result = await generateMeal(prompt, {
      signal: promptAbortController.current.signal,
    });
    createMessage({ role: "assistant", content: result || "" });
  }, []);

  const [promptExecute, promptState] = useLazyAsync(promptExecuteFn);

  if (available === "unavailable") {
    return (
      <Box maxWidth="960px" mx="auto">
        <Callout.Root size="3" color="red">
          <Callout.Icon>
            <CrossCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            <Heading as="h2" size="3" mb="2">
              Language model is not available
            </Heading>
            <Text>
              This feature currently works with the built-in Gemini Nano model
              only in Chrome. To enable it:
            </Text>
            <Text as="div" mt="2">
              <ol style={{ margin: 0, paddingLeft: "1.5rem" }}>
                <li>Ensure you are using Chrome as your browser</li>
                <li>
                  Go to <Code>chrome://flags</Code> in your address bar
                </li>
                <li>Enable the "Prompt API for Gemini Nano" flag</li>
                <li>Restart Chrome</li>
              </ol>
            </Text>
          </Callout.Text>
        </Callout.Root>
      </Box>
    );
  }

  return (
    <Feed
      messages={messages}
      isLoading={promptState.isLoading}
      form={
        <PromptForm
          isLoading={promptState.isLoading}
          onSubmit={(prompt) => {
            pendingMessage.current = createMessage({
              role: "user",
              content: prompt,
            });
            promptExecute(prompt);
          }}
          onAbort={() => {
            promptAbortController.current.abort();
            promptAbortController.current = new AbortController();

            if (pendingMessage.current) {
              updateMessage(pendingMessage.current.id, { cancelled: true });
              pendingMessage.current = null;
            }
          }}
          onClearSession={() => {
            createSession();
            resetMessages();
          }}
        />
      }
    />
  );
}
