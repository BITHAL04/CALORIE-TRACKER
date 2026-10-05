
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import Navbar_global from '../components/ui-components/navbars/Navbar-global';
import Footer from '../components/ui-components/Footer';
import BackgroundElements from '../components/ui-components/BackgroundElements';
import CaloriePredictionForm from '../components/calorie-page-components/CaloriePredictionForm';
import CaloriePredictionResult from '../components/calorie-page-components/CaloriePredictionResult';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

interface CaloriePredictionInput {
  user_id: string;
  gender: number;  // 0 for male, 1 for female
  age: number;
  height: number;
  weight: number;
  duration: number;
  heart_rate: number;
  body_temp: number;
}

interface CaloriePredictionResultData {
  user_id: string;
  input_data: CaloriePredictionInput;
  predicted_calories: number;
  timestamp: string;
}

const CaloriePredictor = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<CaloriePredictionResultData | null>(null);
  
  const handleSubmit = async (formData: Omit<CaloriePredictionInput, 'user_id'>) => {
    if (!isLoaded || !user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to predict calories",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<CaloriePredictionResultData>(
        `${import.meta.env.VITE_API_URL}/predict-calories`,
        {
          ...formData,
          user_id: user.id
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      setPredictionResult(response.data);
      toast({
        title: "Success!",
        description: `Calculated ${Math.round(response.data.predicted_calories)} calories burned`,
      });
    } catch (err) {
      console.error('Error predicting calories:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'Failed to predict calories');
        toast({
          title: "Error",
          description: err.response.data.detail || 'Failed to predict calories',
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
          Workout Calorie Calculator
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Track the calories you burn during workouts based on your personal profile and activity metrics
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-5">
            <CaloriePredictionForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading}
            />
          </div>
          
          <div className="lg:col-span-7">
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
                    <p className="text-gray-600 font-medium">Calculating your calories...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                  </div>
                </CardContent>
              </Card>
            ) : predictionResult ? (
              <CaloriePredictionResult result={predictionResult} />
            ) : (
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg h-full">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-nexafit-accent/10 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">🔥</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3 text-nexafit-navbar">Ready to calculate your calories?</h2>
                  <p className="text-gray-600 max-w-md">
                    Fill out the form with your workout details to get an accurate estimate of calories burned during your exercise session.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-left max-w-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-nexafit-navbar">Personal Profile</p>
                      <p className="text-xs text-gray-500">We use your age, weight, height, and gender for accurate calculations</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-nexafit-navbar">Workout Data</p>
                      <p className="text-xs text-gray-500">Your heart rate, duration and body temperature help estimate intensity</p>
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

export default CaloriePredictor;
