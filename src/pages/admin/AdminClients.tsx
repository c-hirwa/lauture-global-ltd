import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  JOURNEY_STAGES,
  PAYMENT_STATUSES,
  PACKAGE_OPTIONS,
  formatDate,
} from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";
import AdminTable, { AdminTableRow, AdminTableCell } from "@/components/admin/AdminTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Client = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  country_from: string | null;
  package_id: string | null;
  package_title: string | null;
  payment_status: string;
  stage: string;
  created_at: string;
};

const AdminClients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [packageFilter, setPackageFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setClients((data as Client[]) ?? []);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load clients");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter((c) => {
      if (packageFilter !== "all" && c.package_id !== packageFilter) return false;
      if (paymentFilter !== "all" && c.payment_status !== paymentFilter) return false;
      if (stageFilter !== "all" && c.stage !== stageFilter) return false;
      if (!q) return true;
      return (
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone ?? "").includes(q)
      );
    });
  }, [clients, search, packageFilter, paymentFilter, stageFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-accent" size={28} />
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Clients</h1>
        <p className="text-muted-foreground text-sm mb-8">Manage all client records</p>
        <div className="bg-card rounded-2xl border border-dashed border-border p-14 text-center">
          <Users size={40} className="mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">No clients yet</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Client records appear here when someone completes the package intake form on the website.
          </p>
          <Button variant="gold" asChild>
            <a href="/services#pricing">View packages</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">Clients</h1>
        <p className="text-muted-foreground text-sm">
          {filtered.length} of {clients.length} client{clients.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 mb-6 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xl:w-auto">
            <Select value={packageFilter} onValueChange={setPackageFilter}>
              <SelectTrigger className="h-11 min-w-[160px]">
                <SelectValue placeholder="Package" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All packages</SelectItem>
                {PACKAGE_OPTIONS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="h-11 min-w-[150px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payments</SelectItem>
                {PAYMENT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}><span className="capitalize">{s}</span></SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="h-11 min-w-[180px]">
                <SelectValue placeholder="Journey stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                {JOURNEY_STAGES.map((s) => (
                  <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <AdminTable
        headers={["Name", "Email", "Phone", "Country", "Package", "Payment", "Stage", "Added"]}
        isEmpty={filtered.length === 0}
        emptyMessage="No clients match your filters."
      >
        {filtered.map((c, i) => (
          <AdminTableRow key={c.id} index={i} onClick={() => navigate(`/admin/clients/${c.id}`)}>
            <AdminTableCell className="font-semibold text-foreground">{c.full_name}</AdminTableCell>
            <AdminTableCell>{c.email}</AdminTableCell>
            <AdminTableCell>{c.phone ?? "—"}</AdminTableCell>
            <AdminTableCell>{c.country_from ?? "—"}</AdminTableCell>
            <AdminTableCell>{c.package_title ?? "—"}</AdminTableCell>
            <AdminTableCell>
              <StatusBadge status={c.payment_status} kind="payment" />
            </AdminTableCell>
            <AdminTableCell>
              <StatusBadge status={c.stage} kind="stage" />
            </AdminTableCell>
            <AdminTableCell>{formatDate(c.created_at)}</AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  );
};

export default AdminClients;
