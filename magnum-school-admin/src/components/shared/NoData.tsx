'use client';

import React from 'react';
import { IconType } from 'react-icons';
import { MdOutlineInfo } from 'react-icons/md';
import { cn } from '@/lib/utils';
interface NoDataProps {
  icon?: IconType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

const NoData: React.FC<NoDataProps> = ({
  icon: Icon = MdOutlineInfo,
  title = 'No Data Available',
  description = 'There is nothing to display right now.',
  actionLabel,
  onActionClick,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 rounded-md border border-gray-200 text-center',
        className,
      )}
    >
      <div className="text-gray-400 mb-4">
        <Icon size={48} />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default NoData;
