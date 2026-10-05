
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/AppContextProvider";
import Index from "./pages/Index";
import Home from "./pages/Home";
import MealPlanner from "./pages/MealPlanner";
import CaloriePredictor from "./pages/CaloriePredictor"
import ProfilePage from "./pages/ProfilePage"
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactPage from "./pages/ContactPage";
import HelpCenter from "./pages/HelpCenter";
import AboutUs from "./pages/AboutUs";
import AboutCreator from "./pages/AboutCreator";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import ForumPage from "./pages/ForumPage";
import PostDetail from "./components/forum-components/PostDetail";
import EditPostForm from "./components/forum-components/EditPostForm";
import LoadingScreen from "./components/ui-components/parts/LoadingScreen";

// Make sure to use the env variable and provide a fallback for development
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xlcmsuYXBwLmRldi1zYWN1by5sY2wtZGVtby0xNDEuMzguMS4xLjkxMTYxLjE';

const App = () => {
  const [appLoading, setAppLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <BrowserRouter>
        <AppContextProvider>
          <Toaster />
          <Sonner />
          <LoadingScreen isLoading={appLoading} />
          
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/calorie-tracker" element={
              <ProtectedRoute>
                <CaloriePredictor />
              </ProtectedRoute>
            } />
            <Route path="/meal-planner" element={
              <ProtectedRoute>
                <MealPlanner />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/forum" element={
              <ProtectedRoute>
                <ForumPage />
              </ProtectedRoute>
            } />
            <Route path="/forum/post/:postId" element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            } />
            <Route path="/forum/edit/:postId" element={
              <ProtectedRoute>
                <EditPostForm />
              </ProtectedRoute>
            } />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/about-creator" element={<AboutCreator />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppContextProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
};

export default App;
