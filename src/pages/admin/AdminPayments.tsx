import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, CreditCard, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatCurrency, formatDateTime, prettyStatus } from "@/lib/constants";
import AdminTable, { AdminTableRow, AdminTableCell } from "@/components/admin/AdminTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Payment = {
  id: string;
  merchant_reference: string;
  order_tracking_id: string | null;
  package_type: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  confirmation_code: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-800",
  reversed: "bg-slate-200 text-slate-700",
  amount_mismatch: "bg-orange-100 text-orange-800",
};

const STATUS_FILTERS = ["all", "completed", "pending", "failed", "reversed", "amount_mismatch"] as const;

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select(
            "id, merchant_reference, order_tracking_id, package_type, amount, currency, status, payment_method, confirmation_code, full_name, email, phone, created_at",
          )
          .order("created_at", { ascending: false });
        if (error) throw error;
        setPayments((data as Payment[]) ?? []);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load payments");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      return [p.full_name, p.email, p.phone ?? "", p.merchant_reference, p.confirmation_code ?? ""].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [payments, search, status]);

  const completed = payments.filter((p) => p.status === "completed");
  const collected = completed.reduce((sum, p) => sum + Number(p.amount), 0);
  const needsReview = payments.filter((p) => p.status === "amount_mismatch").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-accent" size={28} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">Payments</h1>
        <p className="text-muted-foreground text-sm">
          {completed.length} completed · {formatCurrency(collected)} collected via Pesapal
        </p>
      </div>

      {needsReview > 0 && (
        <button
          type="button"
          onClick={() => setStatus("amount_mismatch")}
          className="w-full mb-6 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 text-left text-sm text-orange-900 hover:bg-orange-100 transition-colors"
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <span>
            <strong>{needsReview} payment{needsReview === 1 ? "" : "s"} need review.</strong> Pesapal reported a
            different amount or currency than the package price, so they weren't marked as paid. Click to show them.
          </span>
        </button>
      )}

      <div className="bg-card rounded-xl border border-border p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, phone or reference…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="h-11 sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All statuses" : prettyStatus(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {payments.length === 0 ? (
        <div className="bg-card rounded-2xl border border-dashed border-border p-14 text-center">
          <CreditCard size={40} className="mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">No payments yet</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Payments appear here as soon as a client starts a Pesapal checkout.
          </p>
        </div>
      ) : (
        <AdminTable
          headers={["Date", "Client", "Package", "Amount", "Status", "Method", "Reference"]}
          isEmpty={filtered.length === 0}
          emptyMessage="No payments match your filters."
        >
          {filtered.map((p, i) => (
            <AdminTableRow key={p.id} index={i}>
              <AdminTableCell>{formatDateTime(p.created_at)}</AdminTableCell>
              <AdminTableCell>
                <div className="font-semibold text-foreground">{p.full_name}</div>
                <div className="text-xs text-muted-foreground">{p.email}</div>
              </AdminTableCell>
              <AdminTableCell className="capitalize">{p.package_type}</AdminTableCell>
              <AdminTableCell className="font-semibold text-foreground">
                {p.currency} {Number(p.amount).toLocaleString()}
              </AdminTableCell>
              <AdminTableCell>
                <span className={`status-badge ${PAYMENT_STATUS_STYLES[p.status] ?? "bg-slate-100 text-slate-700"}`}>
                  {prettyStatus(p.status)}
                </span>
              </AdminTableCell>
              <AdminTableCell>{p.payment_method ?? "—"}</AdminTableCell>
              <AdminTableCell className="font-mono text-xs">{p.merchant_reference}</AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </div>
  );
};

export default AdminPayments;
