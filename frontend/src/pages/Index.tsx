
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/ui-components/headers/Header';
import Navbar from '../components/ui-components/navbars/Navbar';
import MainContent from '../components/content-components/MainContent';
import SecondaryContent from '../components/content-components/SecondaryContent';
import AppLayout from '../components/layouts/AppLayout';

const Index = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Immediately redirect without rendering the landing page if user is signed in
    if (isSignedIn) {
      navigate('/home', { replace: true });
      return;
    }
    
    // Only run the animation observer if we're actually showing the landing page
    if (!isSignedIn) {
      // Add animation class to elements when they are in view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      }, { threshold: 0.1 });

      // Observe all sections
      document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [isSignedIn, navigate]);

  // Don't render anything if we're signed in - prevents flash of landing page
  if (isSignedIn) {
    return null;
  }

  return (
    <AppLayout navbar={<Navbar />} footer>
      <Header />
      
      <section className="opacity-0 transition-opacity duration-500">
        <MainContent />
      </section>
      
      <section className="opacity-0 transition-opacity duration-500">
        <SecondaryContent />
      </section>
    </AppLayout>
  );
};

export default Index;
