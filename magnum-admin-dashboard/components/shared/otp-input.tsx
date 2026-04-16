import React, { useEffect, useRef } from "react";

type Props = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  inputClassName?: string;
};

export default function OTPInput({
  length = 6,
  value,
  onChange,
  autoFocus = false,
  inputClassName = "",
}: Props) {
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const hiddenRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const chars = value.split("");
    for (let i = 0; i < length; i++) {
      const el = inputsRef.current[i];
      if (el && el.value !== (chars[i] ?? "")) el.value = chars[i] ?? "";
    }
  }, [value, length]);

  useEffect(() => {
    if (autoFocus) {
      inputsRef.current[0]?.focus();
      inputsRef.current[0]?.select();
    }
  }, [autoFocus]);

  const setValueAt = (idx: number, char: string) => {
    const chars = value.split("");
    chars[idx] = char;
    const newVal = chars.slice(0, length).join("");
    onChange(newVal);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
    setValueAt(idx, val);
    if (val && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
      inputsRef.current[idx + 1]?.select();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
  ) => {
    if (e.key === "Backspace") {
      const target = e.target as HTMLInputElement;
      if (target.value === "") {
        const prev = idx - 1;
        if (prev >= 0) {
          inputsRef.current[prev]?.focus();
          inputsRef.current[prev]?.select();
          setValueAt(prev, "");
        }
      } else {
        setValueAt(idx, "");
      }
    } else if (e.key === "ArrowLeft") {
      const prev = idx - 1;
      if (prev >= 0) inputsRef.current[prev]?.focus();
    } else if (e.key === "ArrowRight") {
      const next = idx + 1;
      if (next < length) inputsRef.current[next]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("Text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    const lastIndex = Math.min(pasted.length - 1, length - 1);
    setTimeout(() => {
      inputsRef.current[lastIndex]?.focus();
      inputsRef.current[lastIndex]?.select();
    }, 0);
  };

  const handleHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, length);
    if (v) onChange(v);
  };

  return (
    <div
      onPaste={handlePaste}
      className="flex items-center justify-center gap-2 sm:gap-3"
    >
      <input
        ref={hiddenRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value}
        onChange={handleHiddenChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el as HTMLInputElement;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          className={`relative h-14 w-11 rounded-2xl border border-slate-200 bg-white text-2xl font-semibold tracking-[0.18em] text-slate-900 shadow-sm text-center transition-all duration-200 sm:h-16 sm:w-12 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ${inputClassName}`}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
