export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    DRAFT: "Draft",
    SENT: "Sent",
    PAID: "Paid",
    OVERDUE: "Overdue",
    CANCELLED: "Cancelled",
    PENDING: "Pending",
    COMPLETED: "Completed",
    FAILED: "Failed",
  };
  return map[status] || status;
}
