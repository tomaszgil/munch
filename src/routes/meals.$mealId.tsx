import { useState } from "react";
import { toast } from "sonner";
import {
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  Button,
  Separator,
  Text,
} from "@radix-ui/themes";
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  ChevronLeftIcon,
  Pencil1Icon,
  TrashIcon,
  StarFilledIcon,
  StarIcon,
} from "@radix-ui/react-icons";

import { useMealQuery } from "@/services/meals/useMealQuery";
import { useMealDelete } from "@/services/meals/useMealDelete";
import { useMealUpdate } from "@/services/meals/useMealUpdate";

import { MealDetails } from "@/components/MealDetails";
import { UpdateMealDialog } from "@/components/UpdateMealDialog";
import { DeleteMealDialog } from "@/components/DeleteMealDialog";
import { ContentErrorBoundary } from "@/components/ContentErrorBoundary";

export const Route = createFileRoute("/meals/$mealId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mealId } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const meal = useMealQuery(mealId);
  const deleteMeal = useMealDelete();
  const updateMeal = useMealUpdate();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const navigateToMeals = () => {
    navigate({
      to: "/meals",
      search: {
        category: "all",
        search: "",
        favorite: false,
        sortKey: "updatedAt",
        sortDirection: "desc",
      },
    });
  };

  if (!meal) {
    return (
      <ContentErrorBoundary>
        <Box maxWidth="960px" mx="auto">
          <Flex direction="column" align="center" gap="2" py="9">
            <Heading size="4" align="center">
              Meal not found
            </Heading>
            <Text color="gray" align="center" mb="3">
              This meal might have been deleted or was never here in the first
              place.
            </Text>
            <Button variant="soft" onClick={navigateToMeals}>
              Back to meals
            </Button>
          </Flex>
        </Box>
      </ContentErrorBoundary>
    );
  }

  const handleDelete = () => {
    const deletedMeal = deleteMeal(mealId);
    setIsDeleteDialogOpen(false);
    toast.success(`You have deleted ${deletedMeal?.name}.`);
    navigateToMeals();
  };

  const handleUpdate = (id: string, mealUpdate: any) => {
    const updatedMeal = updateMeal(id, mealUpdate);
    setIsEditDialogOpen(false);
    toast.success(`You have updated ${updatedMeal?.name}.`);
  };

  const handleToggleFavorite = () => {
    const updatedMeal = updateMeal(mealId, { favorite: !meal.favorite });
    if (updatedMeal) {
      toast.success(
        updatedMeal.favorite
          ? `Added ${updatedMeal.name} to favorites.`
          : `Removed ${updatedMeal.name} from favorites.`
      );
    }
  };

  return (
    <>
      <Box maxWidth="960px" mx="auto">
        <Flex align="center" mt="4" mb="5" gap="3">
          <IconButton
            variant="ghost"
            color="gray"
            size="1"
            onClick={() =>
              canGoBack ? router.history.back() : navigateToMeals()
            }
          >
            <ChevronLeftIcon width={24} height={24} />
          </IconButton>
          <Flex align="center" gap="2">
            <Heading as="h1" size="6" truncate>
              {meal?.name}
            </Heading>
            {meal.favorite && (
              <StarFilledIcon color="var(--amber-9)" width={24} height={24} />
            )}
          </Flex>
        </Flex>
        <Card size="3">
          <Flex justify="between" mb="4" gap="4">
            <Button variant="soft" onClick={handleToggleFavorite}>
              {meal.favorite ? <StarFilledIcon /> : <StarIcon />}
              {meal.favorite ? "Remove from favorites" : "Add to favorites"}
            </Button>

            <Flex gap="4">
              <Button
                variant="soft"
                color="gray"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil1Icon />
                Edit
              </Button>
              <Button
                variant="soft"
                color="red"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <TrashIcon />
                Delete
              </Button>
            </Flex>
          </Flex>
          <Separator orientation="horizontal" size="4" my="5" />

          <MealDetails meal={meal} />
        </Card>
      </Box>

      <UpdateMealDialog
        key={JSON.stringify(meal)}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleUpdate}
        meal={meal}
      />

      <DeleteMealDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
      />
    </>
  );
}
