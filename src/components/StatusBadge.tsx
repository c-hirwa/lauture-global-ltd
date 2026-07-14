import { cn } from "@/lib/utils";
import { prettyStatus } from "@/lib/constants";

const PAYMENT_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  partial: "bg-sky-100 text-sky-800",
  refunded: "bg-slate-100 text-slate-600",
};

const BOOKING_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

const STAGE_STYLES: Record<string, string> = {
  enquiry_received: "bg-slate-100 text-slate-700",
  consultation_booked: "bg-sky-100 text-sky-800",
  strategy_in_progress: "bg-indigo-100 text-indigo-800",
  documents_submitted: "bg-violet-100 text-violet-800",
  ready_to_relocate: "bg-amber-100 text-amber-800",
  settled_in_rwanda: "bg-emerald-100 text-emerald-800",
};

type BadgeKind = "payment" | "booking" | "stage" | "generic";

const StatusBadge = ({
  status,
  kind = "generic",
  className,
}: {
  status?: string | null;
  kind?: BadgeKind;
  className?: string;
}) => {
  if (!status) return <span className="text-slate-400">—</span>;

  const map =
    kind === "payment"
      ? PAYMENT_STYLES
      : kind === "booking"
      ? BOOKING_STYLES
      : kind === "stage"
      ? STAGE_STYLES
      : {};

  return (
    <span className={cn("status-badge", map[status] ?? "bg-slate-100 text-slate-700", className)}>
      {prettyStatus(status)}
    </span>
  );
};

export default StatusBadge;
