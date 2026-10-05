
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import Footer from '../components/ui-components/Footer';
import BackgroundElements from '../components/ui-components/BackgroundElements';
import MealPlanForm from '../components/meal-planner-components/MealPlanForm';
import MealPlanResults from '../components/meal-planner-components/MealPlanResults';
import { dietTypes, intoleranceOptions } from '../utils/mealPlanOptions';
import Navbar_global from '@/components/ui-components/navbars/Navbar-global';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

interface MealPlanRequest {
    diet_type: string | null;
    max_calories: number | null;
    intolerances: string[] | null;
    meal_type: string | null;
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
        nutrients: Array<{
        name: string;
        amount: number;
        unit: string;
        }>;
    };
}

interface MealPlanResult {
    user_id: string;
    request_data: MealPlanRequest;
    recipes: Recipe[];
    timestamp: string;
}

const MealPlanner = () => {
    const { user, isLoaded } = useUser();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [mealPlanResult, setMealPlanResult] = useState<MealPlanResult | null>(null);
    
    const handleSubmit = async (formData: MealPlanRequest) => {
        if (!isLoaded || !user) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to create a meal plan",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post<MealPlanResult>(
                `${import.meta.env.VITE_API_URL}/meal-plan`,
                formData,
                {
                    params: { user_id: user.id },
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            
            setMealPlanResult(response.data);
            toast({
                title: "Success!",
                description: `Created a meal plan with ${response.data.recipes.length} recipes`,
            });
        } catch (err) {
            console.error('Error fetching meal plan:', err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.detail || 'Failed to generate meal plan');
                toast({
                    title: "Error",
                    description: err.response.data.detail || 'Failed to generate meal plan',
                    variant: "destructive"
                });
            } else {
                setError('An unexpected error occurred');
                toast({
                    title: "Error",
                    description: "An unexpected error occurred",
                    variant: "destructive"
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-nexafit-background text-black overflow-hidden">
            <BackgroundElements />
            <Navbar_global />

            <div className="relative z-10 container mx-auto px-4 py-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-nexafit-navbar">
                    Personalized Meal Planner
                </h1>
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                    Create a customized weekly meal plan tailored to your dietary preferences and nutritional needs
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
                    <div className="lg:col-span-4">
                        <MealPlanForm 
                            onSubmit={handleSubmit} 
                            dietTypes={dietTypes} 
                            intoleranceOptions={intoleranceOptions}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="lg:col-span-8">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {isLoading ? (
                            <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg h-full flex items-center justify-center">
                                <CardContent className="w-full">
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-nexafit-accent mb-4"></div>
                                        <p className="text-gray-600 font-medium">Creating your meal plan...</p>
                                        <p className="text-sm text-gray-500 mt-2">This may take a moment as we craft the perfect menu for you</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : mealPlanResult ? (
                            <MealPlanResults mealPlan={mealPlanResult} />
                        ) : (
                            <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg h-full">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-20 h-20 bg-nexafit-accent/10 rounded-full flex items-center justify-center mb-6">
                                        <span className="text-3xl">🍽️</span>
                                    </div>
                                    <h2 className="text-xl font-semibold mb-3 text-nexafit-navbar">Ready to create your meal plan?</h2>
                                    <p className="text-gray-600 max-w-md">
                                        Fill out the form to generate a personalized weekly meal plan based on your dietary preferences and nutritional needs.
                                    </p>
                                    <div className="mt-6 grid grid-cols-2 gap-4 text-left max-w-sm">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-nexafit-navbar">Dietary Preferences</p>
                                            <p className="text-xs text-gray-500">Choose from various diets like vegetarian, keto, or paleo</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-nexafit-navbar">Nutritional Goals</p>
                                            <p className="text-xs text-gray-500">Set calorie limits and specify intolerances for healthy meals</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MealPlanner;
