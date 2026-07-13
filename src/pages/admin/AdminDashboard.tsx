import { useEffect, useState } from "react";
import { Users, CalendarClock, DollarSign, Inbox, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/constants";

type Stats = {
  totalClients: number;
  pendingBookings: number;
  paymentsThisMonth: number;
  enquiriesThisWeek: number;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [clientsRes, pendingRes, paidRes, weekRes] = await Promise.all([
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase
          .from("clients")
          .select("package_price")
          .eq("payment_status", "paid")
          .gte("created_at", monthStart),
        supabase.from("clients").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
      ]);

      const paymentsThisMonth = (paidRes.data ?? []).reduce(
        (sum, row) => sum + (Number(row.package_price) || 0),
        0,
      );

      setStats({
        totalClients: clientsRes.count ?? 0,
        pendingBookings: pendingRes.count ?? 0,
        paymentsThisMonth,
        enquiriesThisWeek: weekRes.count ?? 0,
      });
      setLoading(false);
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
    { label: "Total Clients", value: String(stats?.totalClients ?? 0), icon: Users },
    { label: "Pending Bookings", value: String(stats?.pendingBookings ?? 0), icon: CalendarClock },
    { label: "Payments This Month", value: formatCurrency(stats?.paymentsThisMonth), icon: DollarSign },
    { label: "New Enquiries This Week", value: String(stats?.enquiriesThisWeek ?? 0), icon: Inbox },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">Overview of your client operations</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-slate-500">{label}</span>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon size={20} className="text-accent" />
              </div>
            </div>
            <div className="font-heading text-2xl font-bold text-slate-900">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
