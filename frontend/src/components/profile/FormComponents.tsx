
import React from 'react';
import { dietTypes, intoleranceOptions } from '../../utils/mealPlanOptions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, User, Info } from 'lucide-react';

// Gender Selection Component
export const GenderSelector: React.FC<{
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="mb-2">
      <Label className="text-sm font-medium text-gray-700 block mb-2">
        Gender
      </Label>
      <div className="flex gap-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="0"
            checked={value === 0}
            onChange={onChange}
            className="form-radio h-4 w-4 text-nexafit-accent focus:ring-nexafit-accent/40 transition-colors"
          />
          <span className="text-gray-700">Male</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="1"
            checked={value === 1}
            onChange={onChange}
            className="form-radio h-4 w-4 text-nexafit-accent focus:ring-nexafit-accent/40 transition-colors"
          />
          <span className="text-gray-700">Female</span>
        </label>
      </div>
    </div>
  );
};

// Number Input Component
export const NumberInput: React.FC<{
  id: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
}> = ({ id, label, value, onChange, min, max, step = 1, placeholder }) => {
  return (
    <div className="mb-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700 block mb-2">
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value === 0 ? "" : value}
        onChange={onChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className="w-full focus:ring-nexafit-accent focus:border-nexafit-accent transition-colors"
        required
      />
    </div>
  );
};

// Diet Type Selector Component
export const DietTypeSelector: React.FC<{
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <Label htmlFor="meal_type" className="text-sm font-medium text-gray-700 block mb-2">
        Preferred Diet Type
      </Label>
      <select
        id="meal_type"
        name="meal_type"
        value={value || ""}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-nexafit-accent focus:border-nexafit-accent bg-white shadow-sm transition-colors"
      >
        <option value="">No specific diet</option>
        {dietTypes.map(diet => (
          <option key={diet.value} value={diet.value}>
            {diet.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">Choose a diet that matches your preferences or health needs</p>
    </div>
  );
};

// Intolerances Selector Component
export const IntolerancesSelector: React.FC<{
  value: string[] | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="intolerances" className="text-sm font-medium text-gray-700 block mb-2">
          Food Intolerances
        </Label>
        <span className="text-xs text-nexafit-accent/80">
          Hold Ctrl to select multiple
        </span>
      </div>
      
      <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-nexafit-accent focus-within:border-nexafit-accent transition-shadow">
        <select
          id="intolerances"
          name="intolerances"
          multiple
          value={value || []}
          onChange={onChange}
          className="w-full py-2 px-3 border-none rounded-md focus:outline-none h-32"
        >
          {intoleranceOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs text-gray-500 mt-1">Select any food intolerances or allergies you have</p>
    </div>
  );
};

// Submit Button Component
export const SubmitButton: React.FC<{
  isSaving: boolean;
  profileExists: boolean;
}> = ({ isSaving, profileExists }) => {
  return (
    <button
      type="submit"
      disabled={isSaving}
      className="w-full py-2.5 px-4 bg-gradient-to-r from-nexafit-accent to-nexafit-accent-dark text-white text-sm font-medium rounded-md hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-nexafit-accent focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center"
    >
      {isSaving ? (
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Saving...</span>
        </div>
      ) : (
        <span>{profileExists ? 'Update Profile' : 'Create Profile'}</span>
      )}
    </button>
  );
};

// Status Messages Component
export const StatusMessages: React.FC<{
  error: string | null;
  success: string | null;
}> = ({ error, success }) => {
  if (!error && !success) return null;
  
  return (
    <div className="mb-6">
      {error && (
        <div className="flex items-center p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      {success && (
        <div className="flex items-center p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-nexafit-accent"></div>
        <div className="absolute top-0 left-0 animate-ping opacity-40 rounded-full h-12 w-12 border border-nexafit-accent"></div>
      </div>
      <p className="mt-4 text-nexafit-navbar font-medium">Loading your profile...</p>
    </div>
  );
};
