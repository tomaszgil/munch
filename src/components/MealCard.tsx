import { Badge, Card, Flex, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";

import type { Meal, MealCategory, MealCreate } from "@/services/meals/types";

import { CategoryBadge } from "@/components/CategoryBadge";

interface BaseMealCardProps {
  name: React.ReactNode;
  category: MealCategory;
  ingredients: string[];
  children?: React.ReactNode;
}

function BaseMealCard({
  name,
  category,
  ingredients,
  children,
}: BaseMealCardProps) {
  return (
    <Card size="2">
      <Flex justify="between" align="center">
        <Flex direction="column" gap="1">
          <Text weight="bold" truncate>
            {name}
          </Text>
          <Flex gap="2" align="center">
            <CategoryBadge category={category} />
            <Flex gap="2" align="center">
              <Text size="2" color="gray" truncate>
                {ingredients.slice(0, 3).join(", ")}
              </Text>
              {ingredients.length > 3 && (
                <Badge color="gray" variant="soft">
                  + {ingredients.length - 3}
                </Badge>
              )}
            </Flex>
          </Flex>
        </Flex>
        {children}
      </Flex>
    </Card>
  );
}

interface MealCardProps {
  meal: Meal;
  children?: React.ReactNode;
}

export function MealCard({ meal, children }: MealCardProps) {
  return (
    <BaseMealCard
      name={
        <Link
          to="/meals/$mealId"
          params={{ mealId: meal.id }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {meal.name}
        </Link>
      }
      category={meal.category}
      ingredients={meal.ingredients}
    >
      {children}
    </BaseMealCard>
  );
}

interface MealSuggestionCardProps {
  meal: MealCreate;
  children?: React.ReactNode;
}

export function MealSuggestionCard({
  meal,
  children,
}: MealSuggestionCardProps) {
  return (
    <BaseMealCard
      name={meal.name}
      category={meal.category}
      ingredients={meal.ingredients}
    >
      {children}
    </BaseMealCard>
  );
}
