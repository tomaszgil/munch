import { MagicWandIcon } from "@radix-ui/react-icons";
import { Box, Card, Flex, Heading, IconButton } from "@radix-ui/themes";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/generate/")({
  component: Generate,
  loader: async () => {
    const available: "available" | "unavailable" =
      // @ts-expect-error
      await LanguageModel.availability();
    return { available };
  },
});

const exampleMeals = [
  {
    name: "Mini Pancakes with Berries",
    category: "breakfast",
    ingredients: [
      "Pancake mix",
      "Milk",
      "Eggs",
      "Mixed berries",
      "Maple syrup",
    ],
  },
  {
    name: "Peanut Butter and Banana Sandwich",
    category: "lunch",
    ingredients: ["Bread", "Peanut butter", "Banana"],
  },
  {
    name: "Fish Sticks with Sweet Potato Fries",
    category: "dinner",
    ingredients: ["Fish sticks", "Sweet potatoes", "Olive oil", "Salt"],
  },
  {
    name: "Fruit Smoothie",
    category: "snack",
    ingredients: ["Banana", "Spinach", "Milk", "Yogurt", "Frozen berries"],
  },
];

function getSystemPrompt() {
  return [
    "You are a helpful assistant specialized in generating meals for kids.",
    "If asked for anything else than generating a meal, apologize and say you're not able to help with that. You are only able to generate meals.",
    `Here is a list of example meals, which you can use to generate new ones: ${JSON.stringify(
      exampleMeals
    )}`,
    'Here is a structure of a meal: `{ category: "breakfast" | "lunch" | "dinner" | "snack"; name: string; ingredients: string[]; }`. When suggesting a meal, surround the whole meal with ```json and ```',
  ].join("\n");
}

async function generateMeal(prompt: string) {
  // @ts-expect-error
  const session = await LanguageModel.create({
    initialPrompts: [
      {
        role: "system",
        content: getSystemPrompt(),
      },
    ],
  });

  // Prompt the model and wait for the whole result to come back.
  const result = await session.prompt(prompt);
  return result;
}

function GenerateForm({
  onMessageCreate,
}: {
  onMessageCreate: (message: Message) => void;
}) {
  const [content, setContent] = useState("");

  const handlePrompt = () => {
    onMessageCreate({ role: "user", content });
    generateMeal(content).then((result) => {
      onMessageCreate({ role: "assistant", content: result });
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handlePrompt();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePrompt();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ position: "relative", width: "100%" }}
    >
      <Box
        as="div"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Generate a meal prompt"
        aria-multiline="true"
        tabIndex={0}
        onInput={(e: React.FormEvent<HTMLDivElement>) =>
          setContent(e.currentTarget.textContent || "")
        }
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          minHeight: "120px",
          borderRadius: "var(--radius-5)",
          padding: "var(--space-4)",
          paddingBottom: "64px",
          boxShadow: "var(--shadow-3)",
          outline: "none",
          border: "1px solid transparent",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-foreground)",
          fontSize: "var(--font-size-3)",
          lineHeight: "var(--line-height-3)",
        }}
        data-placeholder="Generate a meal for a lunch with tomato, chicken, and rice..."
      />
      <Box position="absolute" bottom="0" right="0" p="4">
        <IconButton size="3" type="submit">
          <MagicWandIcon />
        </IconButton>
      </Box>
    </form>
  );
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

function Message({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <Box>
        <Card>{message.content}</Card>
      </Box>
    );
  }

  return <Box>{message.content}</Box>;
}

function Messages({ messages }: { messages: Message[] }) {
  return (
    <Flex direction="column" gap="4">
      {messages.map((message) => (
        <Message key={message.content} message={message} />
      ))}
    </Flex>
  );
}

function Generate() {
  const { available } = useLoaderData({ from: Route.id });
  const [messages, setMessages] = useState<Message[]>([]);

  if (available === "unavailable") {
    // TODO: render a nice error message
    return <div>Language model is not available</div>;
  }

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
      >
        <Heading as="h1" size="6">
          What's on the menu today?
        </Heading>
        <GenerateForm
          onMessageCreate={(message) =>
            setMessages((messages) => [...messages, message])
          }
        />
      </Flex>
    );
  }

  return (
    <Box maxWidth="640px" mx="auto" minHeight="100%" position="relative">
      <Messages messages={messages} />
      <Box position="absolute" bottom="0" left="0" right="0">
        <GenerateForm
          onMessageCreate={(message) =>
            setMessages((messages) => [...messages, message])
          }
        />
      </Box>
    </Box>
  );
}
