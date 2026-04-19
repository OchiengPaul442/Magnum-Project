import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */

const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
        locale: false,
      },
    ];
  },
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          // Proxy all browser API requests except auth and the proxy route itself.
          source: '/api/:path((?!auth/|proxy/).*)',
          destination: '/api/proxy/:path*',
        },
      ],
    };
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    hideSourceMaps: true,
    sourcemaps: {
      deleteSourcemapsAfterUpload: true,
    },
    disableLogger: true,
  },
);
