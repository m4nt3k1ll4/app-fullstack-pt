import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(inputs.filter(Boolean).join(" "));
}

export function mapZodTreeToFormErrors(
  errors: Record<string, string[]>
): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const [key, messages] of Object.entries(errors)) {
    if (messages.length > 0) {
      mapped[key] = messages[0];
    }
  }
  return mapped;
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}
