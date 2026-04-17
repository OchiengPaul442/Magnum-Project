import { createElement, type ReactNode } from "react";
import { formatDateLike } from "@/lib/format-date";

const WRAPPER_KEYS = new Set([
  "status",
  "message",
  "detail",
  "error",
  "data",
  "results",
  "pagination",
  "count",
]);

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const firstString = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
};

const toNumericValue = (value: unknown): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    if (!normalized) {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (!isPlainObject(value)) {
    return null;
  }

  const candidate =
    value.parsedValue ??
    value.value ??
    value.amount ??
    value.total ??
    value.source;

  return toNumericValue(candidate);
};

const noWrap = (value: string) =>
  createElement("span", { className: "whitespace-nowrap" }, value);

const toDisplayText = (value: unknown): string | null => {
  if (value === null || value === undefined || value === false) {
    return null;
  }

  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  if (Array.isArray(value)) {
    const items = value
      .map((item) => toDisplayText(item))
      .filter((item): item is string => Boolean(item));

    if (items.length === 0) {
      return null;
    }

    return items.join(", ");
  }

  if (!isPlainObject(value)) {
    return null;
  }

  const numericValue = toNumericValue(value);
  if (numericValue !== null) {
    return String(numericValue);
  }

  const directLabel = firstString(value, [
    "name",
    "full_name",
    "fullName",
    "label",
    "title",
    "email",
    "username",
  ]);
  if (directLabel) {
    return directLabel;
  }

  const firstName = firstString(value, [
    "first_name",
    "firstName",
    "firstname",
  ]);
  const lastName = firstString(value, ["last_name", "lastName", "lastname"]);
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  if (fullName) {
    return fullName;
  }

  const identifier =
    value.id ?? value.user_id ?? value.profile_id ?? value.account_id;
  if (typeof identifier === "string" && identifier.trim()) {
    return identifier.trim();
  }

  if (typeof identifier === "number" && Number.isFinite(identifier)) {
    return String(identifier);
  }

  const nestedGroups = value.permissions;
  if (Array.isArray(nestedGroups) && typeof value.name === "string") {
    return value.name;
  }

  return null;
};

export const formatDisplayValue = (value: unknown): ReactNode => {
  if (value instanceof Date) {
    const dateText = formatDateLike(value);
    return dateText === "--" ? dateText : noWrap(dateText);
  }

  if (typeof value === "string") {
    const dateText = formatDateLike(value);
    if (dateText !== "--") {
      return noWrap(dateText);
    }
  }

  const text = toDisplayText(value);
  return text ?? "--";
};

export const formatNumberValue = (value: unknown): string => {
  const numericValue = toNumericValue(value);
  if (numericValue === null) {
    return "--";
  }

  return new Intl.NumberFormat("en-UG").format(numericValue);
};

export const formatCurrencyValue = (value: unknown): string => {
  const numericValue = toNumericValue(value);
  if (numericValue === null) {
    return "--";
  }

  return `UGX ${new Intl.NumberFormat("en-UG", {
    maximumFractionDigits: 0,
  }).format(numericValue)}`;
};

export const normalizeStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    const text = toDisplayText(value);
    return text ? [text] : [];
  }

  return value
    .map((item) => toDisplayText(item))
    .filter((item): item is string => Boolean(item));
};

export const normalizeGroupEntries = (
  value: unknown,
): Array<{ name: string; permissions: string[] }> => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return { name: item, permissions: [] };
        }

        if (!isPlainObject(item)) {
          return null;
        }

        const name =
          firstString(item, ["name", "group", "label", "title"]) ??
          toDisplayText(item) ??
          null;

        if (!name) {
          return null;
        }

        return {
          name,
          permissions: normalizeStringList(item.permissions),
        };
      })
      .filter((item): item is { name: string; permissions: string[] } =>
        Boolean(item),
      );
  }

  if (isPlainObject(value)) {
    return Object.entries(value)
      .filter(([groupName]) => !WRAPPER_KEYS.has(groupName))
      .flatMap(([groupName, permissions]) => {
        const normalizedPermissions = normalizeStringList(permissions);

        if (normalizedPermissions.length > 0) {
          return [{ name: groupName, permissions: normalizedPermissions }];
        }

        const fallback = toDisplayText(permissions);
        if (fallback) {
          return [{ name: groupName, permissions: [fallback] }];
        }

        return [{ name: groupName, permissions: [] }];
      });
  }

  const text = toDisplayText(value);
  return text ? [{ name: text, permissions: [] }] : [];
};
