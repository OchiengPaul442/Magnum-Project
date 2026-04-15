import React from "react";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-purple-gradient">
      <div className="flex flex-col items-center justify-center relative">
        <div className="loader flex space-x-4">
          <div className="rectangle w-8 h-16 rounded-full"></div>
          <div className="rectangle w-8 h-16 rounded-full"></div>
          <div className="rectangle w-8 h-16 rounded-full"></div>
          <span className="tm-symbol">TM</span>
        </div>
        <p className="mt-2 text-4xl font-semibold text-white">magnum</p>
      </div>
    </div>
  );
}
