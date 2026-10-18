
import React, { ReactNode } from 'react';
import Footer from '../ui-components/Footer';
import BackgroundElements from '../ui-components/BackgroundElements';
import Navbar_global from '../ui-components/navbars/Navbar-global';

interface AppLayoutProps {
  children: ReactNode;
  navbar?: ReactNode;
  footer?: boolean;
  showBackground?: boolean;
}

/**
 * Main application layout that provides consistent structure for app pages
 */
const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  navbar,
  footer = true,
  showBackground = true 
}) => {
  const NavComponent = navbar || <Navbar_global />;
  
  return (
    <div className="relative min-h-screen bg-nexafit-background text-black overflow-hidden">
      {showBackground && <BackgroundElements />}
      
      {NavComponent}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {footer && <Footer />}
    </div>
  );
};

export default AppLayout;
