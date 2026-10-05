
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { ReactNode, useState, useEffect } from 'react';
import LoadingScreen from './ui-components/parts/LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // If auth is loaded and user is signed in, start transition to show content
    if (isLoaded && isSignedIn) {
      // Set timing to complete loading animation before showing content
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 800); // Slightly reduced timing to better coordinate with page animations
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn]);

  // Show loading screen until Clerk has loaded
  if (!isLoaded) {
    return <LoadingScreen isLoading={true} />;
  }

  // Redirect to landing page if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Render children with loading screen that will animate away
  return (
    <>
      <LoadingScreen isLoading={!showContent} />
      {children}
    </>
  );
}
