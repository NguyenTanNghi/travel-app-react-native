export function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function formatPackageDate(startDate: string, endDate: string): string {
  return `${startDate}-${endDate}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
