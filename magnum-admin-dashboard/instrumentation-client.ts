import * as Sentry from "@sentry/nextjs";

import { isExpectedAuthError } from "@/lib/sentry";

const tracesSampleRate = Number(
  process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0.1",
);

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: Number.isNaN(tracesSampleRate) ? 0.1 : tracesSampleRate,
  beforeSend(event, hint) {
    if (isExpectedAuthError(hint?.originalException)) {
      return null;
    }

    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
