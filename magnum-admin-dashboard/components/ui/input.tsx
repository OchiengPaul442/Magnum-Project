"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  clearable?: boolean;
  wrapperClassName?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      type,
      clearable = true,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(() =>
      isControlled ? String(value ?? "") : String(defaultValue ?? ""),
    );

    React.useEffect(() => {
      if (isControlled) {
        setInternalValue(String(value ?? ""));
      }
    }, [isControlled, value]);

    const currentValue = isControlled ? String(value ?? "") : internalValue;

    const setRefs = React.useCallback(
      (element: HTMLInputElement | null) => {
        inputRef.current = element;
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            element;
        }
      },
      [ref],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }
      onChange?.(event);
    };

    const handleClear = () => {
      const element = inputRef.current;
      if (!isControlled) {
        setInternalValue("");
      }

      if (element) {
        element.value = "";
        onChange?.({
          target: element,
          currentTarget: element,
        } as React.ChangeEvent<HTMLInputElement>);
        element.focus();
        element.setSelectionRange(0, 0);
      } else {
        onChange?.({
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className={cn("relative", wrapperClassName)}>
        <input
          ref={setRefs}
          type={type}
          value={isControlled ? value : internalValue}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            clearable ? "pr-10" : "",
            className,
          )}
          {...props}
        />

        {clearable && currentValue ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear"
            className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-white text-muted-foreground shadow-sm transition-colors hover:bg-[#f3f7f5] hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
