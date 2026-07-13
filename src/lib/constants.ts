export const JOURNEY_STAGES = [
  { key: "enquiry_received", label: "Enquiry Received" },
  { key: "consultation_booked", label: "Consultation Booked" },
  { key: "strategy_in_progress", label: "Strategy In Progress" },
  { key: "documents_submitted", label: "Documents Submitted" },
  { key: "ready_to_relocate", label: "Ready to Relocate" },
  { key: "settled_in_rwanda", label: "Settled in Rwanda" },
] as const;

export const PAYMENT_STATUSES = ["pending", "paid", "partial", "refunded"] as const;

export const BOOKING_STATUSES = ["pending", "confirmed", "cancelled"] as const;

export const PACKAGE_OPTIONS = [
  { id: "basic", label: "Basic Guidance" },
  { id: "comprehensive", label: "Comprehensive Strategy" },
  { id: "premium", label: "Full Premium Service" },
] as const;

export const prettyStatus = (s?: string | null) =>
  !s ? "—" : s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const formatCurrency = (amount?: number | null) =>
  amount != null ? `$${Number(amount).toLocaleString()}` : "—";

export const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" }) : "—";

export const formatDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";
