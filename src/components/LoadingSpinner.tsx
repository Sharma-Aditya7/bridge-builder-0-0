import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full border-t-4 border-indigo-600 border-solid h-12 w-12 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;