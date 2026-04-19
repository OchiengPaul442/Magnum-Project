'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast as sonnerToast } from 'sonner';
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
} from 'react-icons/ai';

type ToastType = 'success' | 'error' | 'info' | 'default';

interface CustomToastProps {
  t: any;
  type?: ToastType;
  message?: string;
  duration?: number;
}

const Icon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success':
      return <AiOutlineCheckCircle className="text-green-600" size={20} />;
    case 'error':
      return <AiOutlineCloseCircle className="text-red-600" size={20} />;
    case 'info':
    default:
      return <AiOutlineInfoCircle className="text-indigo-600" size={20} />;
  }
};

export default function CustomToast({
  t,
  type = 'default',
  message = '',
  duration = 4000,
}: CustomToastProps) {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const elapsedRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      if (paused) {
        lastTickRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const last = lastTickRef.current ?? now;
      const delta = now - last;
      elapsedRef.current += delta;
      lastTickRef.current = now;

      const pct = Math.min((elapsedRef.current / duration) * 100, 100);
      setProgress(pct);

      if (elapsedRef.current >= duration) {
        sonnerToast.dismiss(t.id);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, duration]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="custom-toast relative flex items-start gap-3 p-4 rounded-md shadow-sm bg-white border border-gray-200 max-w-xs"
    >
      <div className="pt-1">
        <Icon type={type} />
      </div>
      <div className="flex-1 text-sm text-gray-800">{message || t.message}</div>

      <button
        type="button"
        aria-label="Close"
        className="ml-3 text-xs text-gray-400"
        onClick={() => sonnerToast.dismiss(t.id)}
      >
        Close
      </button>

      <div className="absolute left-0 right-0 bottom-0 h-1 rounded-b-md overflow-hidden">
        <div
          className="custom-toast-progress h-full"
          style={{ width: `${progress}%`, transition: 'width 120ms linear' }}
        />
      </div>
    </div>
  );
}
