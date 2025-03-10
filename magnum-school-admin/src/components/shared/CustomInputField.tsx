'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineClose,
} from 'react-icons/ai';
import { cn } from '@/@core/lib/utils';

interface CustomInputFieldProps {
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'date';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  clearable?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  error?: string;
  /**
   * Whether the input should be read-only.
   */
  readOnly?: boolean; // <-- Added readOnly prop
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
  error,
  readOnly = false, // default is false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return; // If readOnly, do not update
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
    if (readOnly) return; // If readOnly, do not clear
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
          readOnly={readOnly} // Pass readOnly to the <Input>
          className={cn(
            'w-full p-6 border rounded-full focus:outline-none bg-white focus:ring-2 focus:ring-purple-600',
            inputClassName,
            error ? 'border-red-500' : 'border-gray-300',
            readOnly && 'cursor-not-allowed opacity-70', // Style readOnly
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
            disabled={readOnly} // disable button if readOnly
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
              disabled={readOnly} // disable clear button if readOnly
            >
              <AiOutlineClose size={20} />
            </button>
          )
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CustomInputField;
