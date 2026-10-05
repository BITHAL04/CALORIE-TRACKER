
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-32">
    <div className="relative">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-nexafit-accent"></div>
      <div className="absolute top-0 left-0 animate-ping opacity-70 rounded-full h-10 w-10 border border-nexafit-accent"></div>
    </div>
  </div>
);

export default LoadingSpinner;
