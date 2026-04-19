import React from 'react';
import { cn } from '@/lib/utils';

interface InlineLoaderProps {
  className?: string;
  label?: string;
}

const InlineLoader: React.FC<InlineLoaderProps> = ({
  className,
  label = 'Loading',
}) => {
  return (
    <span
      className={cn('loader', className)}
      role="status"
      aria-label={label}
    />
  );
};

export default InlineLoader;
