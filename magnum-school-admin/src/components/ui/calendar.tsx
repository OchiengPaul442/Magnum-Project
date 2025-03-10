'use client';

import * as React from 'react';
import { DayPicker, useNavigation, useDayPicker } from 'react-day-picker';
import { cn } from '@/@core/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Custom caption that shows month/year dropdowns for easier navigation.
 * Uses React DayPicker v8's hooks:
 * - useNavigation() to get currentMonth and goToMonth
 * - useDayPicker() to get locale, fromDate, toDate, etc.
 */
function CustomCaption() {
  // Navigation context: currentMonth is a Date object representing the visible month
  // goToMonth(...) lets us jump to a new Date
  const { currentMonth, goToMonth } = useNavigation();
  // DayPicker context: locale, fromDate, toDate, etc.
  const { locale, fromDate, toDate } = useDayPicker();
  // We ensure we pass a valid string to toLocaleString:
  const userLocale = typeof locale === 'string' ? locale : 'default';

  // Build the list of selectable years, respecting fromDate/toDate if provided
  const years = React.useMemo(() => {
    const minYear = fromDate ? fromDate.getFullYear() : 1900;
    const maxYear = toDate ? toDate.getFullYear() : 2100;
    const list: number[] = [];
    for (let y = minYear; y <= maxYear; y++) {
      list.push(y);
    }
    return list;
  }, [fromDate, toDate]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = Number(e.target.value);
    goToMonth(new Date(currentMonth.getFullYear(), newMonth));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = Number(e.target.value);
    goToMonth(new Date(newYear, currentMonth.getMonth()));
  };

  return (
    <div className="flex justify-center items-center space-x-2 pt-1 relative">
      {/* Month dropdown */}
      <select
        className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
        onChange={handleMonthChange}
        value={currentMonth.getMonth()}
      >
        {Array.from({ length: 12 }, (_, i) => i).map((month) => {
          const monthDate = new Date(currentMonth.getFullYear(), month);
          // Use our userLocale string
          const monthName = monthDate.toLocaleString(userLocale, {
            month: 'long',
          });
          return (
            <option key={month} value={month}>
              {monthName}
            </option>
          );
        })}
      </select>

      {/* Year dropdown */}
      <select
        className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
        onChange={handleYearChange}
        value={currentMonth.getFullYear()}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Main Calendar component that uses a custom caption.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      // Provide our custom caption, removing the default captionLayout
      components={{
        Caption: CustomCaption,
        IconLeft: (iconProps) => (
          <ChevronLeftIcon className={cn('h-4 w-4', iconProps.className)} />
        ),
        IconRight: (iconProps) => (
          <ChevronRightIcon className={cn('h-4 w-4', iconProps.className)} />
        ),
      }}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'relative items-center',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
          '[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md'
            : '[&:has([aria-selected])]:rounded-md',
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100',
        ),
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        day_disabled: 'text-muted-foreground opacity-50',
        day_hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';
export { Calendar };
