
import React, { useState } from 'react';
import { UserProfileProvider, useUserProfile } from '../../context/UserProfileContextCal';
import ProfileDataDisplayCal from './ProfileDataDisplayCal';
import WorkoutDataForm from './WorkoutDataForm';
import LoadingSpinner from '../ui-components/parts/LoadingSpinner';
import SubmitButton from '../ui-components/parts/SubmitButton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Info } from 'lucide-react';

interface CaloriePredictionFormProps {
  onSubmit: (formData: {
    gender: number;
    age: number;
    height: number;
    weight: number;
    duration: number;
    heart_rate: number;
    body_temp: number;
  }) => void;
  isLoading: boolean;
}

interface WorkoutData {
  duration: number;
  heart_rate: number;
  body_temp: number;
}

const CalorieFormContent: React.FC<CaloriePredictionFormProps> = ({ onSubmit, isLoading }) => {
  const { userProfile, profileLoading, profileError } = useUserProfile();
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile || !workoutData) return;
    
    onSubmit({
      gender: userProfile.gender,
      age: userProfile.age,
      height: userProfile.height,
      weight: userProfile.weight,
      ...workoutData
    });
  };
  
  if (profileLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-nexafit-navbar">Track Your Workout Impact</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your workout details to calculate calories burned
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="relative z-50 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
            <div className="flex items-start mb-2">
              <Info className="h-5 w-5 text-nexafit-accent mr-2 mt-0.5" />
              <h3 className="text-sm font-medium">Your Profile Data</h3>
            </div>
            <ProfileDataDisplayCal />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4 inline-flex items-center bg-nexafit-accent/10 text-nexafit-navbar px-2 py-1 rounded">
              <span className="mr-1">💪</span> Workout Details
            </h3>
            <WorkoutDataForm onDataChange={setWorkoutData} />
          </div>
          
          <div className="pt-2">
            <SubmitButton 
              isLoading={isLoading} 
              isDisabled={false}
              text="Calculate Calories"
              loadingText="Calculating..."
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Main export with context provider
const CaloriePredictionForm: React.FC<CaloriePredictionFormProps> = (props) => {
  return (
    <UserProfileProvider>
      <CalorieFormContent {...props} />
    </UserProfileProvider>
  );
};

export default CaloriePredictionForm;
