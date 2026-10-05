
import React, { useState } from 'react';
import { useUserDiet } from '../../context/UserDietContext';
import DietProfileAlert from './DietProfileAlert';
import MealPlanInputForm from './MealPlanInputForm';
import LoadingSpinner from '../ui-components/parts/LoadingSpinner';
import SubmitButton from '../ui-components/parts/SubmitButton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface MealPlanFormProps {
  onSubmit: (formData: {
    diet_type: string | null;
    max_calories: number | null;
    intolerances: string[] | null;
    meal_type: string | null;
  }) => void;
  dietTypes: Array<{ value: string; label: string }>;
  intoleranceOptions: Array<{ value: string; label: string }>;
  isLoading: boolean;
}

interface FormData {
  diet_type: string | null;
  max_calories: number | null;
  intolerances: string[] | null;
}

const MealPlanForm: React.FC<MealPlanFormProps> = ({ 
  onSubmit, 
  dietTypes, 
  intoleranceOptions,
  isLoading 
}) => {
  const { dietLoading } = useUserDiet();
  const [formData, setFormData] = useState<FormData>({
    diet_type: null,
    max_calories: null,
    intolerances: null
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      ...formData,
      meal_type: null // Not implementing meal type selection in this version
    });
  };
  
  if (dietLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-nexafit-navbar">Personalize Your Meal Plan</CardTitle>
        <CardDescription className="text-gray-600">
          Customize your nutrition preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="relative z-50 space-y-6">
          <div className="mb-4">
            <DietProfileAlert />
          </div>
          
          <MealPlanInputForm 
            onDataChange={setFormData}
            dietTypes={dietTypes}
            intoleranceOptions={intoleranceOptions}
          />
          
          <div className="pt-2">
            <SubmitButton 
              isLoading={isLoading} 
              isDisabled={false}
              text="Create Meal Plan"
              loadingText="Generating Plan..."
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MealPlanForm;
