const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function getLocalDateInputValue(date = new Date()) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-");
}

function parseDateInputValue(value) {
  const normalizedValue = String(value ?? "").trim();

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

function validateFutureTravelDate(value, now = new Date()) {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue) {
    return {
      isValid: false,
      message: "Travel date is required",
    };
  }

  const parsedValue = parseDateInputValue(normalizedValue);

  if (!parsedValue) {
    return {
      isValid: false,
      message: "Travel date must use YYYY-MM-DD format",
    };
  }

  if (parsedValue <= getLocalDateInputValue(now)) {
    return {
      isValid: false,
      message: "Travel date must be after today",
    };
  }

  return {
    isValid: true,
    value: parsedValue,
  };
}

module.exports = {
  getLocalDateInputValue,
  validateFutureTravelDate,
};
