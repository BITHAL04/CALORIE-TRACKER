
import React, { createContext, useState, useEffect, useContext, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

// Unified user profile type that includes all needed fields
export interface UserProfile {
  gender: number;
  age: number;
  height: number;
  weight: number;
  intolerances: string[] | null;
  meal_type: string | null;
}

interface ProfileContextType {
  userProfile: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  profileExists: boolean;
  refetchProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  gender: 0,
  age: 30,
  height: 170,
  weight: 70,
  intolerances: null,
  meal_type: null
};

const UserProfileContext = createContext<ProfileContextType>({
  userProfile: null,
  profileLoading: true,
  profileError: null,
  profileExists: false,
  refetchProfile: async () => {}
});

export const UserProfileProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState<boolean>(false);

  const fetchUserProfile = useCallback(async () => {
    if (!isLoaded || !user) {
      setProfileLoading(false);
      return;
    }
    
    setProfileLoading(true);
    setProfileError(null);
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile/${user.id}`
      );
      
      const profileData = {
        gender: response.data.gender,
        age: response.data.age,
        height: response.data.height,
        weight: response.data.weight,
        intolerances: response.data.intolerances,
        meal_type: response.data.meal_type
      };
      
      setUserProfile(profileData);
      setProfileExists(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setProfileExists(false);
        console.log("User profile not found, using default values");
        setUserProfile(defaultProfile);
      } else {
        console.error('Error fetching profile:', err);
        setProfileError('Failed to load profile data');
      }
    } finally {
      setProfileLoading(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <UserProfileContext.Provider value={{ 
      userProfile, 
      profileLoading, 
      profileError,
      profileExists,
      refetchProfile: fetchUserProfile 
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
