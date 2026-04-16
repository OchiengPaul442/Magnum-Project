import { format, isValid, parseISO } from "date-fns";

export const FORMAT_DATETIME = "MMM d, yyyy h:mm a";
export const FORMAT_DATE = "MMM d, yyyy";

const hasTimeComponent = (value: string) => {
  return value.includes("T") || /\d{2}:\d{2}/.test(value);
};

const toValidDate = (value: string | Date) => {
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  const parsed = parseISO(value.trim());
  return isValid(parsed) ? parsed : null;
};

export function formatDateTime(value?: string | Date | null): string {
  if (!value) return "--";

  const date = toValidDate(value);
  if (!date) return "--";

  return format(date, FORMAT_DATETIME);
}

export function formatDate(value?: string | Date | null): string {
  if (!value) return "--";

  const date = toValidDate(value);
  if (!date) return "--";

  return format(date, FORMAT_DATE);
}

export function formatDateLike(value?: string | Date | null): string {
  if (!value) return "--";

  if (value instanceof Date) {
    return formatDateTime(value);
  }

  const date = toValidDate(value);
  if (!date) return "--";

  return hasTimeComponent(value) ? formatDateTime(date) : formatDate(date);
}

export default formatDateTime;
