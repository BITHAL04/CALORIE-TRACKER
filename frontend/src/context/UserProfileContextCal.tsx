import React, { createContext, useState, useEffect, useContext, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

export interface UserProfile {
  gender: number;
  age: number;
  height: number;
  weight: number;
}

interface ProfileContextType {
  userProfile: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  refetchProfile: () => Promise<void>;
}

const UserProfileContext = createContext<ProfileContextType>({
  userProfile: null,
  profileLoading: true,
  profileError: null,
  refetchProfile: async () => {}
});

export const UserProfileProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);

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
      
      setUserProfile({
        gender: response.data.gender,
        age: response.data.age,
        height: response.data.height,
        weight: response.data.weight
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setProfileError("You need to create a profile before calculating calories");
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
      refetchProfile: fetchUserProfile 
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);