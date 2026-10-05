import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ExternalLink, X } from "lucide-react";

interface Nutrient {
    name: string;
    amount: number;
    unit: string;
}

interface Recipe {
    id: number;
    title: string;
    image: string;
    sourceUrl: string;
    readyInMinutes: number;
    servings: number;
    summary: string;
    healthScore: number;
    nutrition?: {
        nutrients: Nutrient[];
    };
}

interface MealPlanResult {
    user_id: string;
    request_data: {
    diet_type: string | null;
    max_calories: number | null;
    intolerances: string[] | null;
    meal_type: string | null;
    };
    recipes: Recipe[];
    timestamp: string;
}

interface MealPlanResultsProps {
    mealPlan: MealPlanResult;
}

const MealPlanResults: React.FC<MealPlanResultsProps> = ({ mealPlan }) => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [uniqueRecipes, setUniqueRecipes] = useState<Recipe[]>([]);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Filter out duplicate recipes when mealPlan changes
    useEffect(() => {
        if (mealPlan && mealPlan.recipes) {
            // Create a Map with recipe ID as key to remove duplicates
            const recipeMap = new Map<number, Recipe>();
            
            mealPlan.recipes.forEach(recipe => {
                // Only add if this recipe ID isn't already in our map
                if (!recipeMap.has(recipe.id)) {
                    recipeMap.set(recipe.id, recipe);
                }
            });
            
            // Convert the Map values back to an array
            setUniqueRecipes(Array.from(recipeMap.values()));
        }
    }, [mealPlan]);

    // Function to extract calories from recipe summary
    const extractCaloriesFromSummary = (summary: string): number => {
        if (!summary) return 0;
        
        // Strip HTML tags for cleaner text
        const cleanSummary = summary.replace(/<\/?[^>]+(>|$)/g, "");
        
        // Look for calories pattern: number followed by "calories"
        const caloriesRegex = /(\d+)\s*calories/i;
        const match = cleanSummary.match(caloriesRegex);
        
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
        
        return 0;
    };

    const getCalories = (recipe: Recipe): number => {
        // First try to get calories from nutrition object if available
        if (recipe.nutrition) {
            const calories = recipe.nutrition.nutrients.find(n => n.name === "Calories");
            if (calories) return calories.amount;
        }
        
        // If nutrition data is not available or doesn't contain calories,
        // extract calories from the summary
        return extractCaloriesFromSummary(recipe.summary);
    };

    const stripHtml = (html: string): string => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const RecipeDetails = ({ recipe }: { recipe: Recipe }) => (
        <div className="space-y-4">
            <div>
                <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-auto rounded-lg mb-4 object-cover"
                    style={{ maxHeight: "300px" }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-food.jpg';
                    }}
                />

                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-100 p-2 rounded">
                        <p className="text-sm font-medium">{getCalories(recipe).toFixed(0)}</p>
                        <p className="text-xs text-gray-500">Calories</p>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                        <p className="text-sm font-medium">{recipe.readyInMinutes}</p>
                        <p className="text-xs text-gray-500">Minutes</p>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                        <p className="text-sm font-medium">{recipe.servings}</p>
                        <p className="text-xs text-gray-500">Servings</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-sm text-gray-700 mb-4 max-h-[200px] overflow-y-auto">
                    {stripHtml(recipe.summary)}
                </p>

                {recipe.nutrition && (
                    <>
                        <h3 className="text-lg font-medium mb-2">Nutrition Facts</h3>
                        <div className="space-y-1">
                            {recipe.nutrition.nutrients
                            .filter(nutrient => 
                            ['Calories', 'Fat', 'Carbohydrates', 'Protein', 'Fiber'].includes(nutrient.name)
                            )
                            .map(nutrient => (
                            <div key={nutrient.name} className="flex justify-between text-sm">
                                <span>{nutrient.name}</span>
                                <span>{nutrient.amount.toFixed(1)} {nutrient.unit}</span>
                            </div>
                            ))
                            }
                        </div>
                    </>
                )}

                <Button 
                    className="mt-4 w-full"
                    variant="default"
                    onClick={() => window.open(recipe.sourceUrl, '_blank')}
                >
                    View Full Recipe <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    return (
        <div className="relative z-50 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Weekly Meal Plan</h2>

                <div className="text-sm text-gray-600 mb-4">
                    <p>
                        <span className="font-medium">Diet type:</span> {mealPlan.request_data.diet_type || 'None specified'}
                    </p>
                    {mealPlan.request_data.max_calories && (
                    <p>
                        <span className="font-medium">Target calories:</span> {mealPlan.request_data.max_calories} per day
                    </p>
                    )}
                    {mealPlan.request_data.intolerances && mealPlan.request_data.intolerances.length > 0 && (
                    <p>
                        <span className="font-medium">Intolerances:</span> {mealPlan.request_data.intolerances.join(', ')}
                    </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {uniqueRecipes.map((recipe) => (
                    <div 
                        key={recipe.id} 
                        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedRecipe(recipe)}
                    >
                        <div className="h-48 w-full overflow-hidden">
                            <img 
                                src={recipe.image} 
                                alt={recipe.title} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/loader-test.webp';
                                }}
                            />
                        </div>
                        <div className="p-3">
                            <h3 className="font-medium text-sm line-clamp-2">{recipe.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {getCalories(recipe).toFixed(0)} cal · {recipe.readyInMinutes} min
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            {/* Recipe Modal - Using Dialog for desktop and Drawer for mobile */}
            {isDesktop ? (
                <Dialog open={selectedRecipe !== null} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        {selectedRecipe && (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="pr-8">{selectedRecipe.title}</DialogTitle>
                                    <DialogDescription>
                                        Health Score: {selectedRecipe.healthScore}/100
                                    </DialogDescription>
                                </DialogHeader>
                                <RecipeDetails recipe={selectedRecipe} />
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer open={selectedRecipe !== null} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
                    <DrawerContent className="max-h-[90vh] overflow-y-auto px-4">
                        {selectedRecipe && (
                            <>
                                <DrawerHeader className="text-left">
                                    <DrawerTitle className="pr-8">{selectedRecipe.title}</DrawerTitle>
                                    <DrawerDescription>
                                        Health Score: {selectedRecipe.healthScore}/100
                                    </DrawerDescription>
                                </DrawerHeader>
                                <div className="px-4 pb-8">
                                    <RecipeDetails recipe={selectedRecipe} />
                                </div>
                                <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                </DrawerClose>
                            </>
                        )}
                    </DrawerContent>
                </Drawer>
            )}
        </div>
    );
};

export default MealPlanResults;