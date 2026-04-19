const DEV_FALLBACK_AUTH_SECRET = 'magnum-school-admin-dev-secret';

export const getAuthSecret = () => {
  const configuredSecret = process.env.NEXTAUTH_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  return process.env.NODE_ENV === 'production' ? '' : DEV_FALLBACK_AUTH_SECRET;
};
