
import React, { useState, useEffect } from 'react';
import { useUserDiet } from '../../context/UserDietContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface MealPlanInputs {
  diet_type: string;
  max_calories: string;
  selectedIntolerances: string[];
}

interface MealPlanInputFormProps {
  onDataChange: (data: {
    diet_type: string | null;
    max_calories: number | null;
    intolerances: string[] | null;
  }) => void;
  dietTypes: Array<{ value: string; label: string }>;
  intoleranceOptions: Array<{ value: string; label: string }>;
}

const MealPlanInputForm: React.FC<MealPlanInputFormProps> = ({ 
  onDataChange, 
  dietTypes, 
  intoleranceOptions 
}) => {
  const { userDiet } = useUserDiet();
  const [formData, setFormData] = useState<MealPlanInputs>({
    diet_type: '',
    max_calories: '',
    selectedIntolerances: []
  });

  // Set initial values from user profile when available
  useEffect(() => {
    if (userDiet) {
      setFormData(prev => ({
        ...prev,
        diet_type: userDiet.meal_type || '',
        selectedIntolerances: userDiet.intolerances || []
      }));
    }
  }, [userDiet]);

  // Update parent component when form data changes
  useEffect(() => {
    onDataChange({
      diet_type: formData.diet_type || null,
      max_calories: formData.max_calories ? parseInt(formData.max_calories) : null,
      intolerances: formData.selectedIntolerances.length > 0 ? formData.selectedIntolerances : null
    });
  }, [formData, onDataChange]);

  const handleDietTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({...formData, diet_type: e.target.value});
  };

  const handleCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, max_calories: e.target.value});
  };

  const handleIntoleranceChange = (value: string) => {
    const updatedIntolerances = formData.selectedIntolerances.includes(value)
      ? formData.selectedIntolerances.filter(item => item !== value)
      : [...formData.selectedIntolerances, value];
    
    setFormData({...formData, selectedIntolerances: updatedIntolerances});
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="diet-type" className="text-sm font-medium text-gray-700">
          Diet Type {userDiet?.meal_type && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              From profile
            </span>
          )}
        </Label>
        <select
          id="diet-type"
          value={formData.diet_type}
          onChange={handleDietTypeChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-nexafit-accent focus:border-nexafit-accent bg-white shadow-sm"
        >
          <option value="">No specific diet</option>
          {dietTypes.map((diet) => (
            <option key={diet.value} value={diet.value}>
              {diet.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500">Choose a diet that matches your preferences or health needs</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-calories" className="text-sm font-medium text-gray-700">
          Maximum Calories Per Day
        </Label>
        <Input
          id="max-calories"
          type="number"
          value={formData.max_calories}
          onChange={handleCaloriesChange}
          placeholder="e.g. 2000"
          className="w-full focus:border-nexafit-accent focus:ring-nexafit-accent/20"
        />
        <p className="text-xs text-gray-500">Set a daily calorie target for your meal plan</p>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700 block">
          Food Intolerances {userDiet?.intolerances && userDiet.intolerances.length > 0 && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              From profile
            </span>
          )}
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {intoleranceOptions.map((intolerance) => (
            <div key={intolerance.value} className="flex items-center space-x-2">
              <input
                id={`intolerance-${intolerance.value}`}
                type="checkbox"
                checked={formData.selectedIntolerances.includes(intolerance.value)}
                onChange={() => handleIntoleranceChange(intolerance.value)}
                className="h-4 w-4 text-nexafit-accent focus:ring-nexafit-accent/40 border-gray-300 rounded transition-colors"
              />
              <Label
                htmlFor={`intolerance-${intolerance.value}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {intolerance.label}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">Select any food intolerances or allergies you have</p>
      </div>
    </div>
  );
};

export default MealPlanInputForm;
