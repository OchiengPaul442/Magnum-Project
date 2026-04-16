import React from "react";

export default function ContentLoader() {
  return (
    <div
      className="flex min-h-[320px] w-full items-center justify-center"
      role="status"
    >
      <span className="content-loader" aria-label="Loading" />
    </div>
  );
}
