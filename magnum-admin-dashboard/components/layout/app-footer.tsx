import React from "react";

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex-none py-4 text-center text-xs text-muted-foreground">
      © {year} Magnum Admin Dashboard. All rights reserved.
    </footer>
  );
}
