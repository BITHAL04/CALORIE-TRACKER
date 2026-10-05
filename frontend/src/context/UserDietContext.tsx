import React, { createContext, useState, useEffect, useContext, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

export interface UserDiet {
  gender: number;
  age: number;
  height: number;
  weight: number;
  intolerances: string[] | null;
  meal_type: string | null;
}

interface DietContextType {
  userDiet: UserDiet | null;
  dietLoading: boolean;
  dietError: string | null;
  refetchDiet: () => Promise<void>;
}

const UserDietContext = createContext<DietContextType>({
  userDiet: null,
  dietLoading: true,
  dietError: null,
  refetchDiet: async () => {}
});

export const UserDietProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [userDiet, setUserDiet] = useState<UserDiet | null>(null);
  const [dietLoading, setDietLoading] = useState<boolean>(true);
  const [dietError, setDietError] = useState<string | null>(null);

  const fetchUserDiet = useCallback(async () => {
    if (!isLoaded || !user) {
      setDietLoading(false);
      return;
    }
    
    setDietLoading(true);
    setDietError(null);
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile/${user.id}`
      );
      
      setUserDiet(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        console.log("User profile not found, using default values");
      } else {
        console.error('Error fetching profile:', err);
        setDietError('Failed to load profile data');
      }
    } finally {
      setDietLoading(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    fetchUserDiet();
  }, [fetchUserDiet]);

  return (
    <UserDietContext.Provider value={{ 
      userDiet, 
      dietLoading, 
      dietError, 
      refetchDiet: fetchUserDiet 
    }}>
      {children}
    </UserDietContext.Provider>
  );
};

export const useUserDiet = () => useContext(UserDietContext);