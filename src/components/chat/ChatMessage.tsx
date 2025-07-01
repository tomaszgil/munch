import { useState } from "react";
import { toast } from "sonner";
import { Callout, Box, Button, Flex, Text, Badge } from "@radix-ui/themes";
import {
  ExclamationTriangleIcon,
  EyeOpenIcon,
  CheckIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

import { parseMealCreate } from "@/services/meals/parse";
import type { MealCreate } from "@/services/meals/types";
import { useMealCreate } from "@/services/meals/useMealCreate";

import { MealCard, MealSuggestionCard } from "@/components/MealCard";
import { MealSuggestionDetailsDialog } from "@/components/MealSuggestionDetailsDialog";

import { useAsync } from "@/utils/useAsync";
import type { Message } from "@/services/chat/types";
import { useMealQuery } from "@/services/meals/useMealQuery";
import { useAddMealToMessage } from "@/services/chat/useAddMealToMessage";

function UserMessage({
  content,
  cancelled,
}: {
  content: string;
  cancelled?: boolean;
}) {
  return (
    <Flex justify="end">
      <Box maxWidth="70%">
        <Box
          p="4"
          style={{
            borderRadius: "var(--radius-5)",
            backgroundColor: cancelled ? "var(--gray-3)" : "var(--accent-3)",
          }}
        >
          <Text color={cancelled ? "gray" : undefined}>{content}</Text>
        </Box>
      </Box>
    </Flex>
  );
}

function MealSuggestion({
  meal,
  savedMealId,
  onAddToMenu,
}: {
  meal: MealCreate;
  savedMealId?: string;
  onAddToMenu: () => void;
}) {
  const savedMeal = useMealQuery(savedMealId ?? "");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  return (
    <Box>
      {savedMeal ? (
        <MealCard meal={savedMeal} />
      ) : (
        <MealSuggestionCard meal={meal} />
      )}

      <Flex justify="end" align="center" gap="2" mt="3" minHeight="32px">
        {savedMeal ? (
          <Badge color="green">
            <CheckIcon />
            Meal added to menu
          </Badge>
        ) : (
          <>
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
          </>
        )}
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

function parseMealsFromContent(content: string) {
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    try {
      const json = JSON.parse(jsonMatch[1]);
      const meals = Array.isArray(json) ? json : [json];
      return Promise.resolve(meals.map(parseMealCreate));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  return Promise.resolve(null);
}

function AssistantMessage({
  id,
  content,
  meals,
}: {
  id: string;
  content: string;
  meals?: Array<{ index: number; id: string }>;
}) {
  const { isError, data } = useAsync(parseMealsFromContent, [content]);
  const createMeal = useMealCreate();
  const addMealToMessage = useAddMealToMessage();

  if (isError) {
    return (
      <Callout.Root color="red">
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>Failed to generate meal. Please try again.</Callout.Text>
      </Callout.Root>
    );
  }

  const onAddToMenu = (meal: MealCreate, index: number) => {
    const newMeal = createMeal(meal);
    addMealToMessage(id, { index, id: newMeal.id });
    toast.success(`You have added ${meal.name} to the menu.`);
  };

  if (data) {
    return (
      <Box>
        <Text as="p" mb="3">
          Here are some meal suggestions for you:
        </Text>
        <Flex direction="column" gap="3">
          {data.map((meal, index) => (
            <MealSuggestion
              key={index}
              meal={meal}
              onAddToMenu={() => onAddToMenu(meal, index)}
              savedMealId={meals?.find(({ index: i }) => i === index)?.id}
            />
          ))}
        </Flex>
      </Box>
    );
  }

  return <Box>{content}</Box>;
}

export function ChatMessage({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <UserMessage content={message.content} cancelled={message.cancelled} />
    );
  }

  return (
    <AssistantMessage
      id={message.id}
      meals={message.meals}
      content={message.content}
    />
  );
}
