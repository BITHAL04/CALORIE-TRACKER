import React from 'react';
import { useUserDiet } from '../../context/UserDietContext';

const DietProfileAlert: React.FC = () => {
  const { userDiet, dietError } = useUserDiet();

  if (dietError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {dietError}
      </div>
    );
  }

  if (!userDiet) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <p>You haven't created a profile yet. <a href="/profile" className="underline font-semibold">Create a profile</a> to save your preferences.</p>
      </div>
    );
  }

  return null;
};

export default DietProfileAlert;