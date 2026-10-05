
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WorkoutData {
  duration: number;
  heart_rate: number;
  body_temp: number;
}

interface WorkoutDataFormProps {
  onDataChange: (data: WorkoutData) => void;
}

const WorkoutDataForm: React.FC<WorkoutDataFormProps> = ({ onDataChange }) => {
  const [duration, setDuration] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [bodyTemp, setBodyTemp] = useState<string>('');

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(e.target.value);
    updateParent(e.target.value, heartRate, bodyTemp);
  };

  const handleHeartRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeartRate(e.target.value);
    updateParent(duration, e.target.value, bodyTemp);
  };

  const handleBodyTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBodyTemp(e.target.value);
    updateParent(duration, heartRate, e.target.value);
  };

  const updateParent = (dur: string, hr: string, bt: string) => {
    const isComplete = dur && hr && bt;
    if (isComplete) {
      onDataChange({
        duration: parseFloat(dur),
        heart_rate: parseFloat(hr),
        body_temp: parseFloat(bt)
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-2">
        <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
          Workout Duration (minutes)
        </Label>
        <Input
          id="duration"
          type="number"
          min="1"
          max="300"
          value={duration}
          onChange={handleDurationChange}
          className="w-full focus:border-nexafit-accent focus:ring-nexafit-accent/20"
          placeholder="30"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Enter how long your workout lasted</p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="heart-rate" className="text-sm font-medium text-gray-700">
          Average Heart Rate (bpm)
        </Label>
        <Input
          id="heart-rate"
          type="number"
          min="40"
          max="220"
          value={heartRate}
          onChange={handleHeartRateChange}
          className="w-full focus:border-nexafit-accent focus:ring-nexafit-accent/20"
          placeholder="120"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Your average heart rate during exercise</p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="body-temp" className="text-sm font-medium text-gray-700">
          Body Temperature (°C)
        </Label>
        <Input
          id="body-temp"
          type="number"
          min="35"
          max="41"
          step="0.1"
          value={bodyTemp}
          onChange={handleBodyTempChange}
          className="w-full focus:border-nexafit-accent focus:ring-nexafit-accent/20"
          placeholder="37.0"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Your body temperature during workout</p>
      </div>
    </div>
  );
};

export default WorkoutDataForm;
