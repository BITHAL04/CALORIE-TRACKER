
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CaloriePredictionInput {
  user_id: string;
  gender: number;
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

interface CaloriePredictionResultProps {
  result: CaloriePredictionResultData;
}

const CaloriePredictionResult: React.FC<CaloriePredictionResultProps> = ({ result }) => {
  const formattedDate = new Date(result.timestamp).toLocaleString();
  const workoutIntensity = getWorkoutIntensity(result.input_data.heart_rate);
  const [showDetails, setShowDetails] = useState(false);
  
  function getWorkoutIntensity(heartRate: number): string {
    if (heartRate < 100) return 'Low';
    if (heartRate < 140) return 'Moderate';
    if (heartRate < 170) return 'High';
    return 'Very High';
  }

  function getIntensityColor(intensity: string): string {
    switch(intensity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-blue-100 text-blue-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  return (
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-nexafit-accent/20 to-nexafit-accent/5 pb-2">
        <CardTitle className="text-xl font-bold text-nexafit-navbar">Calories Burned Results</CardTitle>
        <CardDescription>Based on your workout parameters</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="mb-8">
          <div className="flex justify-center items-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-nexafit-accent/20 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-nexafit-accent to-nexafit-navbar text-white text-center p-6 rounded-full w-40 h-40 flex flex-col justify-center shadow-lg">
                <span className="text-4xl font-bold">{Math.round(result.predicted_calories)}</span>
                <span className="text-sm font-medium">Calories</span>
              </div>
            </div>
          </div>
          
          <p className="text-center text-gray-600 mb-4">
            <span className="font-medium">{result.input_data.duration} minute</span> workout with{' '}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getIntensityColor(workoutIntensity)}`}>
              {workoutIntensity}
            </span>
            {' '}intensity
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Workout Duration</h3>
            <p className="text-xl font-semibold text-nexafit-navbar">{result.input_data.duration} min</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Heart Rate</h3>
            <p className="text-xl font-semibold text-nexafit-navbar">{result.input_data.heart_rate} bpm</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Intensity</h3>
            <p className="text-xl font-semibold text-nexafit-navbar">{workoutIntensity}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Body Temp</h3>
            <p className="text-xl font-semibold text-nexafit-navbar">{result.input_data.body_temp} °C</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-nexafit-navbar border-nexafit-accent/30 hover:bg-nexafit-accent/5"
        >
          {showDetails ? 'Hide' : 'Show'} Personal Stats
        </Button>
        
        {showDetails && (
          <div className="border-t mt-4 pt-4 animate-fade-in">
            <h3 className="text-md font-medium mb-3">Your Personal Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-xs text-gray-500 block">Age</span>
                <span className="font-medium">{result.input_data.age}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-xs text-gray-500 block">Weight</span>
                <span className="font-medium">{result.input_data.weight} kg</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-xs text-gray-500 block">Height</span>
                <span className="font-medium">{result.input_data.height} cm</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-xs text-gray-500 block">Gender</span>
                <span className="font-medium">{result.input_data.gender === 0 ? 'Male' : 'Female'}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 justify-end">
        <p className="text-xs text-gray-500">Prediction made on {formattedDate}</p>
      </CardFooter>
    </Card>
  );
};

export default CaloriePredictionResult;
