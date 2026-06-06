const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function getLocalDateInputValue(date = new Date()) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-");
}

export function getTomorrowDateInputValue(date = new Date()) {
  const tomorrow = new Date(date);
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getLocalDateInputValue(tomorrow);
}

export type FutureDateValidationResult =
  | "invalid"
  | "notFuture"
  | "required"
  | "valid";

function parseDateInputValue(value: string) {
  const normalizedValue = value.trim();

  if (!DATE_INPUT_PATTERN.test(normalizedValue)) {
    return null;
  }

  const [year, month, day] = normalizedValue.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);
  const isRealDate =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day;

  return isRealDate ? normalizedValue : null;
}

export function validateFutureDateInput(
  value: string,
  now = new Date(),
): FutureDateValidationResult {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "required";
  }

  const parsedValue = parseDateInputValue(normalizedValue);

  if (!parsedValue) {
    return "invalid";
  }

  return parsedValue > getLocalDateInputValue(now) ? "valid" : "notFuture";
}
