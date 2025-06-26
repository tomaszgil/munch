import { MealSuggestionCard } from "@/components/MealCard";
import { MealSuggestionDetailsDialog } from "@/components/MealSuggestionDetailsDialog";
import { parseMealCreate } from "@/services/meals/parse";
import type { MealCreate } from "@/services/meals/types";
import { useMealCreate } from "@/services/meals/useMealCreate";
import { useLazyAsync } from "@/utils/useLazyAsync";
import {
  EyeOpenIcon,
  MagicWandIcon,
  PlusIcon,
  StopIcon,
} from "@radix-ui/react-icons";
import { Box, Button, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

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
    "You are a helpful specialized assistant only capable of generating meals for kids.",
    "Never suggest anything else than generating a meal. If asked for anything else than generating a meal, apologize and say you're not able to help with that. You are only able to generate meals.",
    `Here is a list of example meals, which you can use to generate new ones: ${JSON.stringify(
      exampleMeals
    )}`,
    'Here is a structure of a meal: `{ category: "breakfast" | "lunch" | "dinner" | "snack"; name: string; ingredients: string[]; }`. When suggesting meals, surround the whole response with ```json and ```. You can suggest multiple meals by providing an array of meal objects.',
  ].join("\n");
}

let session: any = null;

async function getSession() {
  if (!session) {
    // @ts-expect-error
    session = await LanguageModel.create({
      initialPrompts: [
        {
          role: "system",
          content: getSystemPrompt(),
        },
      ],
    });
  }

  return session;
}

async function generateMeal(prompt: string, options: { signal: AbortSignal }) {
  const session = await getSession();
  const result = await session.prompt(prompt, options);
  return result;
}

function PromptForm({
  onMessageCreate,
}: {
  onMessageCreate: (message: Message) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const promptAbortController = useRef<AbortController>(new AbortController());
  const promptExecuteFn = useCallback(async () => {
    const result = await generateMeal(prompt, {
      signal: promptAbortController.current.signal,
    });
    onMessageCreate({ role: "assistant", content: result || "" });
  }, [prompt]);

  const [promptExecute, promptState] = useLazyAsync(promptExecuteFn);

  const handlePrompt = () => {
    onMessageCreate({ role: "user", content: prompt });
    promptExecute();
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

  const handleAbort = () => {
    promptAbortController.current.abort();
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
        aria-label="Meal prompt"
        aria-multiline="true"
        tabIndex={0}
        onInput={(e) => setPrompt(e.currentTarget.textContent || "")}
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
          backgroundColor: "var(--color-panel-solid)",
          color: "var(--color-foreground)",
          fontSize: "var(--font-size-3)",
          lineHeight: "var(--line-height-3)",
        }}
        data-placeholder="Generate meals for a lunch with tomato, chicken, and rice..."
      />
      <Flex position="absolute" bottom="0" right="0" p="4" gap="2">
        {promptState.isLoading && (
          <IconButton
            size="3"
            type="button"
            onClick={handleAbort}
            variant="soft"
          >
            <StopIcon />
          </IconButton>
        )}
        {!promptState.isLoading && (
          <IconButton size="3" type="submit">
            <MagicWandIcon />
          </IconButton>
        )}
      </Flex>
    </form>
  );
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

function UserMessage({ content }: { content: string }) {
  return (
    <Flex justify="end">
      <Box maxWidth="70%">
        <Box
          p="4"
          style={{
            borderRadius: "var(--radius-5)",
            backgroundColor: "var(--accent-3)",
          }}
        >
          {content}
        </Box>
      </Box>
    </Flex>
  );
}

function MealSuggestion({ meal }: { meal: MealCreate }) {
  const createMeal = useMealCreate();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const onAddToMenu = () => {
    createMeal(meal);
    toast.success(`You have added ${meal.name} to the menu.`);
  };

  return (
    <Box>
      <MealSuggestionCard meal={meal} />
      <Flex justify="end" gap="2" mt="3">
        <Button
          variant="soft"
          color="gray"
          onClick={() => setIsDetailsDialogOpen(true)}
        >
          <EyeOpenIcon />
          See details
        </Button>
        <Button variant="soft" color="gray" onClick={onAddToMenu}>
          <PlusIcon />
          Add to menu
        </Button>
      </Flex>

      <MealSuggestionDetailsDialog
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        meal={meal}
        onAddToMenu={onAddToMenu}
      />
    </Box>
  );
}

function AssistantMessage({ content }: { content: string }) {
  const mealsData = (() => {
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const json = JSON.parse(jsonMatch[1]);
        const meals = Array.isArray(json) ? json : [json];
        return meals.map(parseMealCreate);
      } catch (e) {
        // add error handling
        return null;
      }
    }
    return null;
  })();

  if (mealsData) {
    return (
      <Box>
        <Text as="p" mb="3">
          Here are some meal suggestions for you:
        </Text>
        <Flex direction="column" gap="3">
          {mealsData.map((meal, index) => (
            <MealSuggestion key={index} meal={meal} />
          ))}
        </Flex>
      </Box>
    );
  }
  return <Box>{content}</Box>;
}

function Message({ message }: { message: Message }) {
  if (message.role === "user") {
    return <UserMessage content={message.content} />;
  }

  return <AssistantMessage content={message.content} />;
}

function Messages({ messages }: { messages: Message[] }) {
  return (
    <Flex direction="column" gap="6">
      {messages.map((message) => (
        <Message key={message.content} message={message} />
      ))}
    </Flex>
  );
}

function Feed({
  messages,
  promptForm,
}: {
  messages: Message[];
  promptForm: React.ReactNode;
}) {
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
        {promptForm}
      </Flex>
    );
  }

  return (
    <Box maxWidth="640px" mx="auto" minHeight="100%" position="relative">
      <Messages messages={messages} />
      <Box position="sticky" bottom="var(--space-3)" left="0" right="0">
        {promptForm}
      </Box>
    </Box>
  );
}

function Generate() {
  const { available } = useLoaderData({ from: Route.id });
  const [messages, setMessages] = useState<Message[]>([]);

  if (available === "unavailable") {
    // TODO: render a nice error message
    return <div>Language model is not available</div>;
  }

  return (
    <Feed
      messages={messages}
      promptForm={
        <PromptForm
          onMessageCreate={(message) =>
            setMessages((messages) => [...messages, message])
          }
        />
      }
    />
  );
}
