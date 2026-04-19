"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  clearable?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, clearable = true, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const [value, setValue] = React.useState<string>(() => {
      if (props.value !== undefined) return String(props.value ?? "");
      if (props.defaultValue !== undefined)
        return String(props.defaultValue ?? "");
      return "";
    });

    React.useEffect(() => {
      if ("value" in props) {
        setValue(String((props as any).value ?? ""));
      }
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!("value" in props)) setValue(e.target.value);
      props.onChange?.(e);
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!("value" in props)) {
        setValue("");
        if (innerRef.current) {
          innerRef.current.value = "";
          const ev = new Event("input", { bubbles: true });
          innerRef.current.dispatchEvent(ev);
        }
        // Call onChange with a synthetic-like change
        props.onChange?.({
          target: innerRef.current,
          currentTarget: innerRef.current,
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      } else {
        // Controlled input: signal change with empty value
        props.onChange?.({
          target: { value: "" },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
      innerRef.current?.focus();
    };

    const showClear = clearable && Boolean(value && String(value).length > 0);

    return (
      <div className="relative">
        <input
          ref={(el) => {
            innerRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref)
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                el;
          }}
          type={type}
          {...props}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            clearable ? "pr-10" : "",
            className,
          )}
        />

        {showClear ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/20 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
