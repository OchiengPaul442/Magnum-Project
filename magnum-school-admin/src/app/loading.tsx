import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-purple-gradient">
      <div className="flex flex-col items-center justify-center relative">
        <div className="loader flex space-x-4">
          {/* Three Rounded Rectangles */}
          <div className="rectangle w-8 h-16 rounded-full"></div>
          <div className="rectangle w-8 h-16 rounded-full"></div>
          <div className="rectangle w-8 h-16 rounded-full"></div>
          <span className="tm-symbol">TM</span>
        </div>
        <p className="mt-2 text-3xl font-semibold text-white">magnum</p>
      </div>
    </div>
  );
};

export default Loading;
