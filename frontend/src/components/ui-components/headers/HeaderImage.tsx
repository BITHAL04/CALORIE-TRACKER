
import { useEffect, useState } from 'react';

interface HeaderImageProps {
  imagePath?: string;
  initialHeight?: string;
  shrinkHeight?: string;
  children?: React.ReactNode;
  shrinkDelay?: number;
  showGradientOverlay?: boolean;
  className?: string;
}

const HeaderImage = ({
  imagePath = "/header-image-home.webp",
  initialHeight = 'h-[95vh]',
  shrinkHeight = 'h-[65vh]',
  children,
  shrinkDelay = 2200,
  showGradientOverlay = true,
  className = '',
}: HeaderImageProps) => {
  const [isShrinked, setIsShrinked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // First make it visible
    const visibleTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Then auto-shrink the hero after a delay (for initial animation)
    const shrinkTimer = setTimeout(() => {
      setIsShrinked(true);
    }, shrinkDelay);
    
    // Listen to scroll to determine if we should shrink the hero
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsShrinked(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(shrinkTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [shrinkDelay]);

  return (
    <header className={`w-full px-4 pt-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}>
      <div 
        className={`
          relative w-full rounded-3xl overflow-hidden shadow-lg 
          transition-all duration-1000 ease-out
          ${isShrinked ? shrinkHeight : initialHeight}
        `}
      >
        <img 
          src={imagePath} 
          alt="NexaFit header" 
          className="w-full h-full object-cover object-center"
        /> 
        
        {children}
        
        {showGradientOverlay && (
          <div 
            className={`
              absolute inset-x-0 bottom-0 flex justify-between items-center 
              px-8 py-6 bg-gradient-to-t from-black/60 to-transparent text-white
              transition-opacity duration-500 ${isShrinked ? 'opacity-100' : 'opacity-0'}
            `}
          />
        )}
      </div>
    </header>
  );
};

export default HeaderImage;
