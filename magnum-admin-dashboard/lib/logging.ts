import log from "loglevel";
import * as Sentry from "@sentry/nextjs";

const level = (process.env.NEXT_PUBLIC_LOG_LEVEL ?? "info") as log.LogLevelDesc;
log.setLevel(level);

export function captureError(
  error: unknown,
  context?: Record<string, unknown>,
) {
  if (context) {
    log.error(context, error);
  } else {
    log.error(error);
  }
  Sentry.captureException(error, { extra: context });
}

export default log;
