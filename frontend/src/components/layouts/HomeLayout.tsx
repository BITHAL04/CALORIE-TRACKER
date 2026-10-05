
import React, { ReactNode, useEffect, useState } from 'react';
import Navbar_home from '../ui-components/navbars/Navbar-home';
import AppLayout from './AppLayout';

interface HomeLayoutProps {
  children: ReactNode;
}

/**
 * Specialized layout for the home page with animations
 */
const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after loading screen completes
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout navbar={<Navbar_home />} footer>
      <div className={`animate-fade-in transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </AppLayout>
  );
};

export default HomeLayout;
