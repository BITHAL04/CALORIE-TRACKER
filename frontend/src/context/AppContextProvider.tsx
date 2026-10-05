
import React, { ReactNode } from 'react';
import { UserProfileProvider } from './UserProfileContextCal';
import { UserDietProvider } from './UserDietContext';
import { ProfileProvider } from './ProfileContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a single query client instance
const queryClient = new QueryClient();

interface AppProviderProps {
  children: ReactNode;
}

/**
 * AppContextProvider centralizes all context providers to avoid nesting hell
 * and make the component tree cleaner
 */
export const AppContextProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProfileProvider>
          <UserProfileProvider>
            <UserDietProvider>
              {children}
            </UserDietProvider>
          </UserProfileProvider>
        </ProfileProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
