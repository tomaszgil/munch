import { useCallback, useRef, useState } from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

import { useLazyAsync } from "@/utils/useAsync";

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
    "You are a creative chef, specializing in designing healthy, appealing, and balanced meal ideas for children.",
    "Never suggest anything else than generating a meal. If asked for anything else than generating a meal, apologize and say you're not able to help with that. You are only able to generate meals.",
    `Here is a list of example meals, which you can use to generate new ones: ${JSON.stringify(
      exampleMeals
    )}`,
    'Here is a structure of a meal: `{ category: "breakfast" | "lunch" | "dinner" | "snack"; name: string; ingredients: string[]; }`. When suggesting meals, surround the whole response with ```json and ```. You can suggest multiple meals by providing an array of meal objects.',
    "Prioritize balanced complex carbs, lean protein, healthy fats, minimal added sugar and salt, plenty of fruits/veggies.",
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
