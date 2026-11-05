import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CalendarClock,
  DollarSign,
  Inbox,
  Loader2,
  Activity,
  FileText,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";

type Stats = {
  totalClients: number;
  enquiriesThisWeek: number;
  totalBookings: number;
  pendingBookings: number;
  revenueTotal: number;
  revenueThisMonth: number;
  paymentsCompleted: number;
};

type Attention = {
  pendingBookings: number;
  unpaidEnquiries: number;
  paymentsToReview: number;
};

type Session = {
  id: string;
  attendee_name: string | null;
  attendee_email: string | null;
  package_title: string | null;
  event_type: string | null;
  start_time: string;
};

type ActivityItem = {
  id: string;
  kind: "client" | "booking" | "document" | "payment";
  title: string;
  subtitle: string;
  status?: string;
  statusKind?: "payment" | "stage" | "booking";
  at: string;
  to?: string;
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
  const [attention, setAttention] = useState<Attention | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

        const [
          clientsRes,
          weekRes,
          bookingsRes,
          pendingRes,
          unpaidRes,
          paidRes,
          reviewRes,
          sessionsRes,
          recentClients,
          recentBookings,
          recentDocs,
          recentPayments,
        ] = await Promise.all([
          supabase.from("clients").select("id", { count: "exact", head: true }),
          supabase.from("clients").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
          supabase.from("bookings").select("id", { count: "exact", head: true }),
          supabase.from("bookings").select("id", { count: "exact", head: true }).ilike("status", "pending"),
          supabase.from("clients").select("id", { count: "exact", head: true }).eq("payment_status", "pending"),
          // Revenue = money actually collected through Pesapal, not manually set statuses.
          supabase.from("transactions").select("amount, created_at").eq("status", "completed"),
          supabase.from("transactions").select("id", { count: "exact", head: true }).eq("status", "amount_mismatch"),
          supabase
            .from("bookings")
            .select("id, attendee_name, attendee_email, package_title, event_type, start_time")
            .gte("start_time", now.toISOString())
            .lte("start_time", weekAhead)
            .not("status", "ilike", "cancelled")
            .order("start_time", { ascending: true })
            .limit(6),
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
          supabase.from("documents").select("id, title, client_email, created_at").order("created_at", { ascending: false }).limit(6),
          supabase
            .from("transactions")
            .select("id, full_name, email, amount, currency, status, created_at")
            .order("created_at", { ascending: false })
            .limit(6),
        ]);

        for (const res of [clientsRes, weekRes, bookingsRes, pendingRes, unpaidRes, recentClients, recentBookings]) {
          if (res.error) throw res.error;
        }

        const paidRows = paidRes.error ? [] : (paidRes.data ?? []);
        setStats({
          totalClients: clientsRes.count ?? 0,
          enquiriesThisWeek: weekRes.count ?? 0,
          totalBookings: bookingsRes.count ?? 0,
          pendingBookings: pendingRes.count ?? 0,
          revenueTotal: paidRows.reduce((s, r) => s + (Number(r.amount) || 0), 0),
          revenueThisMonth: paidRows
            .filter((r) => r.created_at >= monthStart)
            .reduce((s, r) => s + (Number(r.amount) || 0), 0),
          paymentsCompleted: paidRows.length,
        });

        setAttention({
          pendingBookings: pendingRes.count ?? 0,
          unpaidEnquiries: unpaidRes.count ?? 0,
          paymentsToReview: reviewRes.error ? 0 : (reviewRes.count ?? 0),
        });

        setSessions(sessionsRes.error ? [] : ((sessionsRes.data as Session[]) ?? []));

        const items: ActivityItem[] = [
          ...(recentClients.data ?? []).map((c) => ({
            id: `c-${c.id}`,
            kind: "client" as const,
            title: c.full_name || c.email,
            subtitle: c.package_title ? `New enquiry · ${c.package_title}` : "New enquiry",
            status: c.payment_status,
            statusKind: "payment" as const,
            at: c.created_at,
            to: `/admin/clients/${c.id}`,
          })),
          ...(recentBookings.data ?? []).map((b) => ({
            id: `b-${b.id}`,
            kind: "booking" as const,
            title: b.attendee_name || b.attendee_email || "Booking",
            subtitle: b.package_title || b.event_type || "Session booked",
            status: b.status ?? undefined,
            statusKind: "booking" as const,
            at: b.created_at,
            to: "/admin/bookings",
          })),
          ...(recentDocs.error ? [] : (recentDocs.data ?? [])).map((d) => ({
            id: `d-${d.id}`,
            kind: "document" as const,
            title: d.title,
            subtitle: `Document shared with ${d.client_email}`,
            at: d.created_at,
          })),
          ...(recentPayments.error ? [] : (recentPayments.data ?? [])).map((p) => ({
            id: `p-${p.id}`,
            kind: "payment" as const,
            title: p.full_name || p.email,
            subtitle: `Payment ${p.status} · ${p.currency} ${Number(p.amount).toLocaleString()}`,
            at: p.created_at,
            to: "/admin/payments",
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
      label: "Revenue collected",
      value: formatCurrency(stats?.revenueTotal),
      hint: `${formatCurrency(stats?.revenueThisMonth)} this month · ${stats?.paymentsCompleted ?? 0} payments`,
      icon: DollarSign,
      to: "/admin/payments",
    },
    {
      label: "Clients",
      value: String(stats?.totalClients ?? 0),
      hint: `${stats?.enquiriesThisWeek ?? 0} new this week`,
      icon: Users,
      to: "/admin/clients",
    },
    {
      label: "Bookings",
      value: String(stats?.totalBookings ?? 0),
      hint: `${stats?.pendingBookings ?? 0} pending`,
      icon: CalendarClock,
      to: "/admin/bookings",
    },
    {
      label: "New enquiries",
      value: String(stats?.enquiriesThisWeek ?? 0),
      hint: "Last 7 days",
      icon: Inbox,
      to: "/admin/clients",
    },
  ];

  const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
  const review = attention?.paymentsToReview ?? 0;
  const pending = attention?.pendingBookings ?? 0;
  const unpaid = attention?.unpaidEnquiries ?? 0;
  const attentionItems = [
    {
      count: review,
      label: plural(review, "payment needs review (amount mismatch)", "payments need review (amount mismatch)"),
      to: "/admin/payments",
      urgent: true,
    },
    {
      count: pending,
      label: plural(pending, "booking is waiting for confirmation", "bookings are waiting for confirmation"),
      to: "/admin/bookings",
    },
    {
      count: unpaid,
      label: plural(unpaid, "client hasn't paid yet", "clients haven't paid yet"),
      to: "/admin/clients",
    },
  ].filter((i) => i.count > 0);

  const iconFor = { client: Users, booking: CalendarClock, document: FileText, payment: CreditCard } as const;

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

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        {/* Needs attention */}
        <section className="bg-card rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <AlertTriangle size={18} className="text-accent" />
            <h2 className="font-heading text-lg font-semibold text-foreground">Needs attention</h2>
          </div>
          {attentionItems.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" /> All caught up.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {attentionItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors group"
                  >
                    <span
                      className={`min-w-9 h-9 px-2 rounded-lg flex items-center justify-center font-bold text-sm ${
                        item.urgent ? "bg-orange-100 text-orange-800" : "bg-accent/10 text-accent"
                      }`}
                    >
                      {item.count}
                    </span>
                    <span className="flex-1 text-sm text-foreground">{item.label}</span>
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Upcoming sessions */}
        <section className="bg-card rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <CalendarClock size={18} className="text-accent" />
            <h2 className="font-heading text-lg font-semibold text-foreground">Next 7 days</h2>
          </div>
          {sessions.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">No sessions scheduled this week.</p>
          ) : (
            <ul className="divide-y divide-border">
              {sessions.map((s) => {
                const start = new Date(s.start_time);
                return (
                  <li key={s.id} className="flex items-center gap-4 px-6 py-3.5">
                    <div className="w-12 text-center shrink-0">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {start.toLocaleDateString(undefined, { weekday: "short" })}
                      </div>
                      <div className="font-heading text-lg font-bold text-foreground leading-none">{start.getDate()}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        {s.attendee_name || s.attendee_email || "Client"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} ·{" "}
                        {s.package_title || s.event_type || "Consultation"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 bg-card rounded-xl border border-border shadow-sm">
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
              const body = (
                <>
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                  </div>
                  {item.status && item.statusKind ? <StatusBadge status={item.status} kind={item.statusKind} /> : null}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(item.at)}</span>
                </>
              );
              return (
                <li key={item.id}>
                  {item.to ? (
                    <Link to={item.to} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors">
                      {body}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4 px-6 py-4">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
