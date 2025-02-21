'use client';

import React from 'react';
import { IconType } from 'react-icons';
import { MdErrorOutline } from 'react-icons/md';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  icon?: IconType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  icon: Icon = MdErrorOutline,
  title = 'Something went wrong',
  description = 'There was an issue fetching the data. Please try again later.',
  actionLabel,
  onActionClick,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 rounded-md border border-red-200 bg-red-50 text-center',
        className,
      )}
    >
      <div className="text-red-500 mb-4">
        <Icon size={48} />
      </div>
      <h2 className="text-lg font-semibold text-red-700 mb-2">{title}</h2>
      <p className="text-sm text-red-600 mb-4">{description}</p>
      {actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
