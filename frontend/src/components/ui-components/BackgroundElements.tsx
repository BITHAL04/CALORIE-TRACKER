import React from 'react';

const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* slides in from left */}
        <div 
          className="absolute -top-20 -left-40 w-2/3 h-[42%] bg-nexafit-navbar opacity-0 md:opacity-60 rounded-3xl 
                      animate-slide-in-left"
          style={{ transform: 'skewX(-20deg)' }}
        ></div>
        
        <div 
          className="absolute -bottom-40 -right-20 w-2/5 h-2/5 bg-nexafit-accent opacity-0 md:opacity-80 rounded-3xl"
          style={{ transform: 'skewX(-20deg)' }}
        ></div>
        
        <div 
          className="absolute top-1/2 -left-40 w-3/5 h-2/5 bg-nexafit-lightGreen opacity-0 md:opacity-80 rounded-3xl"
          style={{transform: 'skewX(20deg)' }}
        ></div>
    </div>
  );
};

export default BackgroundElements;
