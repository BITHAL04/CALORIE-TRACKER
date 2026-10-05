
import React from 'react';
import Footer from '../components/ui-components/Footer';
import BackgroundElements from '../components/ui-components/BackgroundElements';
import Navbar_global from '../components/ui-components/navbars/Navbar-global';
import ProfileForm from '../components/profile/ProfileForm';
import { ProfileProvider } from '../context/ProfileContext';

const ProfilePage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-nexafit-background text-black overflow-hidden">
      <BackgroundElements />
      <Navbar_global />
      
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-nexafit-navbar">Your Profile</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete your profile to get personalized meal plans and calorie predictions that match your specific needs
          </p>
        </div>
        
        <div className="mx-auto">
          <ProfileProvider>
            <ProfileForm />
          </ProfileProvider>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
