
import React from 'react';

interface StatCardProps {
  number: string;
  text: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, text }) => {
  return (
    <div className="bg-nexafit-navbar text-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="text-2xl font-bold">{number}</div>
      <div className="text-sm">{text}</div>
    </div>
  );
};

export default StatCard;
