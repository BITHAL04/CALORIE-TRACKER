
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { useProfileContext } from '../../context/ProfileContext';
import { 
  GenderSelector, 
  NumberInput, 
  DietTypeSelector, 
  IntolerancesSelector, 
  SubmitButton,
  StatusMessages,
  LoadingSpinner
} from './FormComponents';

const ProfileForm: React.FC = () => {
  const { 
    profile, 
    isLoading, 
    isSaving, 
    error, 
    success, 
    profileExists,
    updateProfile, 
    saveProfile 
  } = useProfileContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateProfile({ 
      [name]: name === 'gender' ? parseInt(value) : value 
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProfile({ 
      [name]: parseFloat(value) 
    });
  };

  const handleIntoleranceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    updateProfile({ 
      intolerances: selectedValues.length > 0 ? selectedValues : null 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-nexafit-navbar">Personal Profile</CardTitle>
        <CardDescription className="text-gray-600">
          {profileExists ? 'Update your profile details below' : 'Create your profile to personalize your experience'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <StatusMessages error={error} success={success} />
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-700">
              Your profile information helps us personalize your meal plans and calorie predictions.
            </p>
          </div>
          
          <GenderSelector 
            value={profile.gender} 
            onChange={handleChange} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <NumberInput 
              id="age" 
              label="Age" 
              value={profile.age} 
              onChange={handleNumberChange}
              min={1}
              max={120}
              placeholder="Your age"
            />
            
            <NumberInput 
              id="height" 
              label="Height (cm)" 
              value={profile.height} 
              onChange={handleNumberChange}
              min={50}
              max={250}
              step={0.1}
              placeholder="Your height in cm"
            />
          </div>
          
          <NumberInput 
            id="weight" 
            label="Weight (kg)" 
            value={profile.weight} 
            onChange={handleNumberChange}
            min={20}
            max={500}
            step={0.1}
            placeholder="Your weight in kg"
          />
          
          <DietTypeSelector 
            value={profile.meal_type} 
            onChange={handleChange} 
          />
          
          <IntolerancesSelector 
            value={profile.intolerances} 
            onChange={handleIntoleranceChange} 
          />
          
          <div className="pt-4">
            <SubmitButton 
              isSaving={isSaving} 
              profileExists={profileExists} 
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
