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
      return <AiOutlineCheckCircle className="text-emerald-600" size={20} />;
    case 'error':
      return <AiOutlineCloseCircle className="text-rose-600" size={20} />;
    case 'info':
    default:
      return <AiOutlineInfoCircle className="text-[#533E89]" size={20} />;
  }
};

const getProgressBackground = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'linear-gradient(90deg, #059669, #34d399)';
    case 'error':
      return 'linear-gradient(90deg, #e11d48, #fb7185)';
    case 'info':
    default:
      return 'linear-gradient(90deg, #533E89, #7c5cff)';
  }
};

export default function CustomToast({
  t,
  type = 'info',
  message = '',
  duration = 4000,
}: CustomToastProps) {
  const [remaining, setRemaining] = useState(100);
  const [paused, setPaused] = useState(false);
  const elapsedRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      if (pausedRef.current) {
        return;
      }

      const last = lastTickRef.current ?? now;
      const delta = now - last;
      elapsedRef.current += delta;
      lastTickRef.current = now;

      const pct = Math.min((elapsedRef.current / duration) * 100, 100);
      setRemaining(100 - pct);

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
      className="custom-toast relative flex max-w-xs items-start gap-3 rounded-md border border-gray-200 bg-white p-4 shadow-sm"
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
          style={{
            width: `${remaining}%`,
            transition: 'width 120ms linear',
            background: getProgressBackground(type),
          }}
        />
      </div>
    </div>
  );
}
