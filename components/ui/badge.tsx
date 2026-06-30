import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  sent: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  paid: "bg-green-500/10 text-green-400 border-green-500/30",
  overdue: "bg-red-500/10 text-red-400 border-red-500/30",
  cancelled: "bg-muted text-muted-foreground border-border",
};

export function Badge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        statusColors[status] || statusColors.draft,
        className,
      )}
    >
      {status}
    </span>
  );
}
