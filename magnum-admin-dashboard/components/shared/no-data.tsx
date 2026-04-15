"use client";

import React from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

interface NoDataProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

const NoData: React.FC<NoDataProps> = ({
  title = "No Data Available",
  description = "There is nothing to display right now.",
  actionLabel,
  onActionClick,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-md border border-gray-200 text-center",
        className,
      )}
    >
      <div className="text-gray-400 mb-4">
        <Info className="h-12 w-12" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {actionLabel && onActionClick ? (
        <button
          onClick={onActionClick}
          className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default NoData;
