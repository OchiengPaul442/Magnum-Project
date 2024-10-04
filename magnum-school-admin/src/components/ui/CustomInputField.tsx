'use client';
import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineClose,
} from 'react-icons/ai';
import { cn } from '@lib/utils';

interface CustomInputFieldProps {
  label?: string;
  type?: 'text' | 'password';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  clearable?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  label,
  type = 'text',
  placeholder = 'Enter value',
  value = '',
  onChange,
  clearable = false,
  containerClassName = '',
  inputClassName = '',
  labelClassName = '',
  buttonClassName = '',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const clearInput = () => {
    setInputValue('');
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={cn('w-full max-w-md mb-4', containerClassName)}>
      {label && (
        <Label
          htmlFor={label}
          className={cn(
            'block text-sm font-medium text-gray-500 mb-3',
            labelClassName,
          )}
        >
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          type={type === 'password' && !passwordVisible ? 'password' : 'text'}
          id={label}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          className={cn(
            'w-full p-6 border rounded-full focus:outline-none bg-white focus:ring-2 focus:ring-purple-600',
            inputClassName,
          )}
        />
        {type === 'password' ? (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={cn(
              'absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500',
              buttonClassName,
            )}
          >
            {passwordVisible ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        ) : (
          clearable &&
          inputValue && (
            <button
              type="button"
              onClick={clearInput}
              className={cn(
                'absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500',
                buttonClassName,
              )}
            >
              <AiOutlineClose size={20} />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default CustomInputField;
