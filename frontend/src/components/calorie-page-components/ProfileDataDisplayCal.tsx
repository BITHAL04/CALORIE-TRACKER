
import React from 'react';
import { useUserProfile } from '../../context/UserProfileContext';

const ProfileDataDisplayCal: React.FC = () => {
  const { userProfile, profileError, profileExists } = useUserProfile();

  if (profileError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {profileError}
        {profileError.includes("create a profile") && (
          <p className="mt-2">
            <a href="/profile" className="underline font-semibold">Create your profile here</a>
          </p>
        )}
      </div>
    );
  }

  if (!userProfile || !profileExists) return null;

  return (
    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
      <h3 className="font-medium mb-1">Using profile data:</h3>
      <p className="text-sm">
        Gender: {userProfile.gender === 0 ? 'Male' : 'Female'}, 
        Age: {userProfile.age} years, 
        Height: {userProfile.height} cm, 
        Weight: {userProfile.weight} kg
      </p>
      <p className="text-xs mt-2">
        <a href="/profile" className="underline">Update profile</a>
      </p>
    </div>
  );
};

export default ProfileDataDisplayCal;
