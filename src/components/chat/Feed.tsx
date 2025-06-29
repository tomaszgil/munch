import { useLayoutEffect } from "react";
import { Box, Flex, Heading } from "@radix-ui/themes";

import type { Message } from "./ChatMessage";
import { ChatMessage } from "./ChatMessage";

function Messages({ messages }: { messages: Message[] }) {
  return (
    <Flex direction="column" gap="6">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </Flex>
  );
}

export function Feed({
  messages,
  isLoading,
  form,
}: {
  messages: Message[];
  isLoading: boolean;
  form: React.ReactNode;
}) {
  // Auto-scroll to bottom when messages change
  useLayoutEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, isLoading]);

  if (messages.length === 0) {
    return (
      <Flex
        width="640px"
        mx="auto"
        minHeight="100%"
        direction="column"
        justify="center"
        align="center"
        gap="6"
        py="9"
      >
        <Heading as="h1" size="6">
          What's on the menu today?
        </Heading>
        {form}
      </Flex>
    );
  }

  return (
    <Flex direction="column" width="640px" mx="auto" height="100%" gap="6">
      <Flex
        direction="column"
        gap="6"
        width="100%"
        style={{
          flex: "1",
          overflow: "auto",
        }}
      >
        <Messages messages={messages} />
        {isLoading && (
          <Box
            as="div"
            width="24px"
            height="24px"
            style={{
              borderRadius: "50%",
              backgroundColor: "var(--accent-9)",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        )}
      </Flex>
      <Box position="sticky" bottom="4" left="0" right="0">
        {form}
      </Box>
    </Flex>
  );
}
