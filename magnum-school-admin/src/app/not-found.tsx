'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light-purple-gradient flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center max-w-md w-full">
        <h1 className="text-7xl font-extrabold text-purple-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="px-8 py-3 text-lg rounded-full mt-2"
          >
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
