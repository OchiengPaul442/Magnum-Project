import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/@core/lib/utils';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

export const CustomDatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label = 'Date',
  placeholder = 'Pick a date',
  error,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onChange(selectedDate);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col space-y-1 relative">
      {label && (
        <label className="block text-sm font-medium text-gray-500 mb-3 dark:text-gray-300">
          {label}
        </label>
      )}

      <Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex w-full items-center justify-between rounded-full border bg-white py-3 px-4 text-left text-sm shadow-sm',
              'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2',
              'transition-colors duration-200',
              'dark:bg-gray-800 dark:hover:bg-gray-700',
              error ? 'border-red-500' : 'border-gray-300',
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <span className="text-gray-700 dark:text-gray-300">
              {value ? format(value, 'MM/dd/yyyy') : placeholder}
            </span>
            <CalendarIcon className="ml-2 h-4 w-4 opacity-70" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="z-[9999] w-auto p-0 bg-white shadow-lg rounded-lg border"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          align="start"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={handleDateSelect}
            disabled={(date) =>
              date > new Date() || date < new Date('1900-01-01')
            }
            // Optionally, pass fromDate / toDate to limit year range
            fromDate={new Date('1900-01-01')}
            toDate={new Date('2100-12-31')}
            className={cn(
              'rounded-md border-0',
              '[&_button:not(:disabled)]:hover:bg-gray-100',
              '[&_button]:cursor-pointer',
              '[&_button]:transition-colors',
              '[&_button:hover]:text-purple-600',
              '[&_[aria-selected="true"]]:bg-purple-600',
              '[&_[aria-selected="true"]]:text-white',
              '[&_[aria-selected="true"]]:hover:bg-purple-700',
              '[&_.rdp-day_button]:h-9',
              '[&_.rdp-day_button]:w-9',
              '[&_.rdp-day_button]:rounded-full',
              '[&_.rdp-nav_button]:hover:bg-gray-100',
              '[&_.rdp-nav_button]:p-1',
              '[&_.rdp-nav_button]:rounded-md',
            )}
          />
        </PopoverContent>
      </Popover>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CustomDatePicker;
