
import { useEffect, useState } from 'react';

const Header = () => {
  const [isShrinked, setIsShrinked] = useState(false);

  useEffect(() => {
    // Auto-shrink the hero after a delay (for initial animation)
    const timer = setTimeout(() => {
      setIsShrinked(true);
    }, 2200);
    
    // Listen to scroll to determine if we should shrink the hero
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsShrinked(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="w-full px-4 pt-4">
      <div 
        className={`
          relative w-full rounded-3xl overflow-hidden shadow-lg 
          transition-all duration-1000 ease-out
          ${isShrinked ? 'h-[35vh]' : 'h-[95vh]'}
        `}
      >
        <img 
          src="/header-image.webp" 
          alt="NexaFit header" 
          className="w-full h-full object-cover object-center"
        />
        
        <div
          className={`
            absolute left-14 bottom-14 text-white text-4xl font-bold z-10
            origin-bottom-left transition-transform duration-700 ease-in-out
            ${isShrinked ? '-rotate-90 translate-y-8' : ''}
          `}
        >
            <h1 className="tracking-tight">nexaFit</h1>
        </div>

        
        <div 
          className={`
            absolute inset-x-0 bottom-0 flex justify-between items-center 
            px-8 py-6 bg-gradient-to-t from-black/60 to-transparent text-white
            transition-opacity duration-500 ${isShrinked ? 'opacity-100' : 'opacity-0'}
          `}
        >

        </div>
      </div>
    </header>
  );
};

export default Header;
