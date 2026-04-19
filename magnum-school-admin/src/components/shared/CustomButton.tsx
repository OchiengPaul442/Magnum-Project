'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type CustomButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  text?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
};

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      text,
      icon,
      iconPosition = 'left',
      onClick,
      className = '',
      type = 'button',
      loading = false,
      disabled = false,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const isDisabled = loading || disabled;

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={!isDisabled ? { scale: 0.95 } : undefined}
        className={cn(
          'inline-flex items-center justify-center px-5 py-2 rounded-full text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed',
          className,
        )}
        onClick={handleClick}
        disabled={isDisabled || loading}
        {...(buttonProps as any)}
      >
        {icon && iconPosition === 'left' && (
          <span className={cn('mr-2', text || children ? '' : 'mx-0')}>
            {icon}
          </span>
        )}

        {text ?? children}

        {icon && iconPosition === 'right' && (
          <span className={cn('ml-2', text || children ? '' : 'mx-0')}>
            {icon}
          </span>
        )}
      </motion.button>
    );
  },
);

CustomButton.displayName = 'CustomButton';

export default CustomButton;
