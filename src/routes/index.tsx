import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
  DataList,
} from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { useMealsQuery } from "@/services/meals/useMealsQuery";
import { CategoryBadge } from "@/components/CategoryBadge";
import { MealCard } from "@/components/MealCard";
import type { MealCategory } from "@/services/meals/types";

const orderedCategories = ["breakfast", "lunch", "dinner", "snack"] as const;

export const Route = createFileRoute("/")({
  component: App,
});

function RecentMeals() {
  const meals = useMealsQuery();
  const recentMeals = [...meals]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  if (recentMeals.length === 0) {
    return (
      <Flex direction="column" align="center" gap="2" py="6">
        <Heading size="4" align="center">
          No meals available
        </Heading>
        <Text color="gray" align="center">
          You haven't added any meals yet.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="3">
      {recentMeals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </Flex>
  );
}

function Analytics() {
  const meals = useMealsQuery();
  const mealsByCategory = meals.reduce(
    (acc, meal) => {
      acc[meal.category] = (acc[meal.category] || 0) + 1;
      return acc;
    },
    {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
    } as Record<MealCategory, number>
  );

  return (
    <Grid columns="2" gap="4">
      <Flex direction="column" gap="1">
        <Text size="6" weight="bold">
          {meals.length}
        </Text>
        <Text size="2" color="gray">
          Total Meals
        </Text>
      </Flex>
      <DataList.Root>
        {orderedCategories.map((category) => (
          <DataList.Item key={category}>
            <DataList.Label>
              <CategoryBadge category={category as any} />
            </DataList.Label>
            <DataList.Value>{mealsByCategory[category]}</DataList.Value>
          </DataList.Item>
        ))}
      </DataList.Root>
    </Grid>
  );
}

function App() {
  return (
    <Box maxWidth="960px" mx="auto">
      <Heading as="h1" size="6" mt="3" mb="5">
        Dashboard
      </Heading>

      <Grid columns={{ initial: "1", md: "2" }} gap="4">
        <Card size="3">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">
              Recent Meals
            </Heading>
            <Text size="2" color="gray" mb="4">
              View your most recent meal entries.
            </Text>
            <RecentMeals />
          </Flex>
        </Card>

        <Card size="3">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">
              Random Meal Drawer
            </Heading>
            <Text size="2" color="gray">
              Draw a random meal from the database.
            </Text>
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">
              Meal Analytics
            </Heading>
            <Text size="2" color="gray" mb="4">
              View analytics for your meal entries.
            </Text>
            <Analytics />
          </Flex>
        </Card>
      </Grid>
    </Box>
  );
}
