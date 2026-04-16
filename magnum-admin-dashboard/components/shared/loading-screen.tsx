import React from "react";

export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex min-h-[100dvh] w-full items-center justify-center bg-dark-purple-gradient"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center justify-center">
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
