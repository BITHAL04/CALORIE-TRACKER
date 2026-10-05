import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

export interface UserProfile {
  gender: number;
  age: number;
  height: number;
  weight: number;
  intolerances: string[] | null;
  meal_type: string | null;
}

interface ProfileContextType {
  profile: UserProfile;
  profileExists: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  success: string | null;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  saveProfile: () => Promise<void>;
  resetMessages: () => void;
}

const defaultProfile: UserProfile = {
  gender: 0,
  age: 30,
  height: 170,
  weight: 70,
  intolerances: null,
  meal_type: null
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [profileExists, setProfileExists] = useState<boolean>(false);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoaded || !user) return;
      
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile/${user.id}`
        );
        setProfile({
          gender: response.data.gender,
          age: response.data.age,
          height: response.data.height,
          weight: response.data.weight,
          intolerances: response.data.intolerances,
          meal_type: response.data.meal_type
        });
        setProfileExists(true);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          // Profile doesn't exist yet, which is fine
          setProfileExists(false);
        } else {
          console.error('Error fetching profile:', err);
          setError('Failed to load profile data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [isLoaded, user]);

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const saveProfile = async () => {
    if (!isLoaded || !user) {
      setError("You must be logged in to save your profile");
      return;
    }
    
    setIsSaving(true);
    resetMessages();
    
    try {
      const endpoint = profileExists 
        ? `${import.meta.env.VITE_API_URL}/user/profile/${user.id}` 
        : `${import.meta.env.VITE_API_URL}/user/profile`;
      
      const method = profileExists ? 'put' : 'post';
      
      await axios({
        method,
        url: endpoint,
        data: {
          ...profile,
          user_id: user.id
        },
        headers: { 'Content-Type': 'application/json' }
      });
      
      setSuccess(profileExists ? 'Profile updated successfully!' : 'Profile created successfully!');
      setProfileExists(true);
    } catch (err) {
      console.error('Error saving profile:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'Failed to save profile');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      profileExists,
      isLoading,
      isSaving,
      error,
      success,
      updateProfile,
      saveProfile,
      resetMessages
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};