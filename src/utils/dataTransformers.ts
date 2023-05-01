import { FoodItem, OpenFoodFactsFoodItem } from "@/types/foodItem";

export const convertOpenFoodFactsFoodItemToFoodItem = (
  foodItem: OpenFoodFactsFoodItem
): FoodItem => {
  // It seems the API sometimes returns a string and sometimes a number, so we need to check it here.
  // @todo confirm that the API does return different types
  const kcal =
    typeof foodItem.nutriments["energy-kcal_100g"] === "string"
      ? parseFloat(foodItem.nutriments["energy-kcal_100g"])
      : foodItem.nutriments["energy-kcal_100g"];
  const carbohydrate =
    typeof foodItem.nutriments.carbohydrates_100g === "string"
      ? parseFloat(foodItem.nutriments.carbohydrates_100g)
      : foodItem.nutriments.carbohydrates_100g;

  return {
    id: parseInt(foodItem.id),
    name: foodItem.product_name,
    description: foodItem.generic_name,
    is_raw: false,
    image_url: foodItem.image_url,
    kcal: kcal,
    water: null,
    protein: parseFloat(foodItem.nutriments.proteins_100g),
    fat: parseFloat(foodItem.nutriments.fat_100g),
    carbohydrate: carbohydrate,
    fiber: parseFloat(foodItem.nutriments.fiber_100g),
    alcohol: null,
    created_at: new Date().toDateString(),
    updated_at: new Date().toDateString(),
    categories: [],
    // categories: foodItem.categories_tags.map((category) => {
    //   return {
    //     id: null,
    //     name: category,
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   };
    // }),
    food_regions: [],
    serving_size: parseFloat(foodItem.serving_size),
    source: "openfoodfacts",
  };
};
