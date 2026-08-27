import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, CalendarClock, DollarSign, Inbox, Loader2, Activity, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatCurrency, prettyStatus } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";

type Stats = {
  totalClients: number;
  totalBookings: number;
  pendingBookings: number;
  revenueTotal: number;
  revenueThisMonth: number;
  enquiriesThisWeek: number;
};

type ActivityItem = {
  id: string;
  kind: "client" | "booking" | "document";
  title: string;
  subtitle: string;
  status?: string;
  statusKind?: "payment" | "stage" | "booking";
  at: string;
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const [clientsRes, bookingsRes, pendingRes, paidRes, weekRes, recentClients, recentBookings, recentDocs] =
          await Promise.all([
            supabase.from("clients").select("id", { count: "exact", head: true }),
            supabase.from("bookings").select("id", { count: "exact", head: true }),
            supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
            supabase.from("clients").select("package_price, created_at").eq("payment_status", "paid"),
            supabase.from("clients").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
            supabase
              .from("clients")
              .select("id, full_name, email, package_title, payment_status, created_at")
              .order("created_at", { ascending: false })
              .limit(6),
            supabase
              .from("bookings")
              .select("id, attendee_name, attendee_email, package_title, event_type, status, created_at")
              .order("created_at", { ascending: false })
              .limit(6),
            supabase
              .from("documents")
              .select("id, title, client_email, created_at")
              .order("created_at", { ascending: false })
              .limit(6),
          ]);

        for (const res of [clientsRes, bookingsRes, pendingRes, paidRes, weekRes, recentClients, recentBookings]) {
          if (res.error) throw res.error;
        }

        const paidRows = paidRes.data ?? [];
        const revenueTotal = paidRows.reduce((s, r) => s + (Number(r.package_price) || 0), 0);
        const revenueThisMonth = paidRows
          .filter((r) => r.created_at >= monthStart)
          .reduce((s, r) => s + (Number(r.package_price) || 0), 0);

        setStats({
          totalClients: clientsRes.count ?? 0,
          totalBookings: bookingsRes.count ?? 0,
          pendingBookings: pendingRes.count ?? 0,
          revenueTotal,
          revenueThisMonth,
          enquiriesThisWeek: weekRes.count ?? 0,
        });

        const items: ActivityItem[] = [
          ...(recentClients.data ?? []).map((c) => ({
            id: `c-${c.id}`,
            kind: "client" as const,
            title: c.full_name || c.email,
            subtitle: c.package_title ? `Enquiry · ${c.package_title}` : "New enquiry",
            status: c.payment_status,
            statusKind: "payment" as const,
            at: c.created_at,
          })),
          ...(recentBookings.data ?? []).map((b) => ({
            id: `b-${b.id}`,
            kind: "booking" as const,
            title: b.attendee_name || b.attendee_email || "Booking",
            subtitle: b.package_title || b.event_type || "Session booked",
            status: b.status ?? undefined,
            statusKind: "booking" as const,
            at: b.created_at,
          })),
          ...(recentDocs.error ? [] : (recentDocs.data ?? [])).map((d) => ({
            id: `d-${d.id}`,
            kind: "document" as const,
            title: d.title,
            subtitle: `Document shared with ${d.client_email}`,
            at: d.created_at,
          })),
        ]
          .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
          .slice(0, 10);

        setActivity(items);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-accent" size={28} />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Clients",
      value: String(stats?.totalClients ?? 0),
      hint: `${stats?.enquiriesThisWeek ?? 0} new this week`,
      icon: Users,
      to: "/admin/clients",
    },
    {
      label: "Total Bookings",
      value: String(stats?.totalBookings ?? 0),
      hint: `${stats?.pendingBookings ?? 0} pending`,
      icon: CalendarClock,
      to: "/admin/bookings",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.revenueTotal),
      hint: `${formatCurrency(stats?.revenueThisMonth)} this month`,
      icon: DollarSign,
      to: "/admin/clients",
    },
    {
      label: "New Enquiries This Week",
      value: String(stats?.enquiriesThisWeek ?? 0),
      hint: "Last 7 days",
      icon: Inbox,
      to: "/admin/clients",
    },
  ];

  const iconFor = { client: Users, booking: CalendarClock, document: FileText } as const;

  return (
    <div>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
      <p className="text-muted-foreground text-sm mb-8">Overview of your client operations</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {cards.map(({ label, value, hint, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="bg-card rounded-xl border border-border p-6 shadow-sm hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon size={20} className="text-accent" />
              </div>
            </div>
            <div className="font-heading text-2xl font-bold text-foreground">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
          <Activity size={18} className="text-accent" />
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent activity</h2>
        </div>
        {activity.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {activity.map((item) => {
              const Icon = iconFor[item.kind];
              return (
                <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                  </div>
                  {item.status && item.statusKind ? (
                    <StatusBadge status={item.status} kind={item.statusKind} />
                  ) : null}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(item.at)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
