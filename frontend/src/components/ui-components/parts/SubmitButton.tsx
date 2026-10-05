import React from 'react';

interface SubmitButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  text: string;
  loadingText: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isLoading, 
  isDisabled,
  text,
  loadingText
}) => (
  <button
    type="submit"
    disabled={isLoading || isDisabled}
    className="w-full py-2 px-4 bg-nexafit-accent text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexafit-accent transition-colors disabled:opacity-50"
  >
    {isLoading ? loadingText : text}
  </button>
);

export default SubmitButton;