'use client';

import TopLoader from 'nextjs-toploader';

const NextTopbar = () => {
  return (
    <TopLoader
      color="var(--brand-primary)"
      height={3}
      showSpinner={false}
      crawlSpeed={200}
      easing="ease"
      shadow={false}
    />
  );
};

export default NextTopbar;
