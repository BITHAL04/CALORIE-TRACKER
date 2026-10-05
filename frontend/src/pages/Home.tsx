
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import HeaderImage from '../components/ui-components/headers/HeaderImage';
import FeatureOverlay from '../components/content-components/FeatureOverlay';
import ImageCarousel from '../components/ui-components/parts/ImageCarousel';
import HomeLayout from '../components/layouts/HomeLayout';

const Home = () => {
  const { user, isLoaded } = useUser();
  const [username, setUsername] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set username when user data is loaded
    if (isLoaded && user) {
      setUsername(user.firstName || user.username || 'User');
    }
    
    // Trigger animations after loading screen completes
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isLoaded, user]);

  return (
    <HomeLayout>
      <section>
        <HeaderImage 
          imagePath="/header-image-home.webp"
          shrinkDelay={2500}
        />
      </section>
      
      <section className={`px-8 sm:px-16 md:px-24 lg:px-32 -mt-16 md:-mt-24 relative z-10 transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
        <FeatureOverlay username={username} />
      </section>
      
      <section className={`mt-16 px-4 transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'}`}>
        <h2 className="text-2xl font-medium mb-4">Latest insights from the world of nutrition and health</h2>
        <ImageCarousel 
          images={[
            "/carousel-img-1.webp",
            "/carousel-img-2.webp",
            "/carousel-img-3.webp"
          ]} 
        />
      </section>
    </HomeLayout>
  );
};

export default Home;
