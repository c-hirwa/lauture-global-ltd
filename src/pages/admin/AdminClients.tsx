import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import {
  JOURNEY_STAGES,
  PAYMENT_STATUSES,
  PACKAGE_OPTIONS,
  prettyStatus,
  formatDate,
} from "@/lib/constants";
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
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      setClients((data as Client[]) ?? []);
      setLoading(false);
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

  return (
    <div>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-2">Clients</h1>
      <p className="text-slate-500 text-sm mb-6">Manage all client records</p>

      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={packageFilter} onValueChange={setPackageFilter}>
          <SelectTrigger className="w-full lg:w-44">
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
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            {PAYMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{prettyStatus(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full lg:w-48">
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

      <AdminTable
        headers={["Name", "Email", "Phone", "Country", "Package", "Payment", "Stage", "Added"]}
        isEmpty={filtered.length === 0}
      >
        {filtered.map((c, i) => (
          <AdminTableRow key={c.id} index={i} onClick={() => navigate(`/admin/clients/${c.id}`)}>
            <AdminTableCell className="font-medium text-slate-900">{c.full_name}</AdminTableCell>
            <AdminTableCell>{c.email}</AdminTableCell>
            <AdminTableCell>{c.phone ?? "—"}</AdminTableCell>
            <AdminTableCell>{c.country_from ?? "—"}</AdminTableCell>
            <AdminTableCell>{c.package_title ?? "—"}</AdminTableCell>
            <AdminTableCell>{prettyStatus(c.payment_status)}</AdminTableCell>
            <AdminTableCell>{JOURNEY_STAGES.find((s) => s.key === c.stage)?.label ?? prettyStatus(c.stage)}</AdminTableCell>
            <AdminTableCell>{formatDate(c.created_at)}</AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  );
};

export default AdminClients;
