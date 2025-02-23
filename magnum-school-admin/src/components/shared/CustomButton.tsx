'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CustomButtonProps {
  text?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  /**
   * Allows you to disable the button externally, e.g. `disabled={isRegistering}`
   */
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  type = 'button',
  loading = false,
  disabled = false,
}) => {
  const isDisabled = loading || disabled;

  return (
    <motion.button
      type={type}
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      className={cn(
        'inline-flex items-center justify-center px-5 py-2 rounded-full text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled || loading}
    >
      {icon && iconPosition === 'left' && (
        <span className={cn('mr-2', text ? '' : 'mx-0')}>{icon}</span>
      )}

      {text && <span>{text}</span>}
      {icon && iconPosition === 'right' && (
        <span className={cn('ml-2', text ? '' : 'mx-0')}>{icon}</span>
      )}
    </motion.button>
  );
};

export default CustomButton;
