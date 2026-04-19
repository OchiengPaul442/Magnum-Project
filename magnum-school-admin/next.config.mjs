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

const isProduction = process.env.NODE_ENV === 'production';
const hasSentryAuth = Boolean(process.env.SENTRY_AUTH_TOKEN);

const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

// Only enable uploading (and deleting local maps) when building in production
// and a SENTRY_AUTH_TOKEN is available (e.g., in CI). For other environments
// we disable sourcemap generation/upload to avoid accidental exposure.
const sentryNextConfig =
  isProduction && hasSentryAuth
    ? {
        widenClientFileUpload: true,
        transpileClientSDK: true,
        hideSourceMaps: true,
        sourcemaps: {
          deleteSourcemapsAfterUpload: true,
        },
        disableLogger: true,
      }
    : {
        hideSourceMaps: true,
        sourcemaps: {
          disable: true,
        },
        disableLogger: true,
      };

export default withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions,
  sentryNextConfig,
);
