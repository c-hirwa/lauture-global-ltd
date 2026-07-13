import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { prettyStatus, formatDateTime } from "@/lib/constants";
import AdminTable, { AdminTableRow, AdminTableCell } from "@/components/admin/AdminTable";

type Notification = {
  id: string;
  recipient_email: string;
  subject: string;
  body: string | null;
  channel: string;
  status: string;
  created_at: string;
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      setNotifications((data as Notification[]) ?? []);
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

  return (
    <div>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
      <p className="text-slate-500 text-sm mb-6">Log of all sent notifications</p>

      <AdminTable
        headers={["Recipient", "Subject", "Channel", "Status", "Sent"]}
        isEmpty={notifications.length === 0}
        emptyMessage="No notifications logged yet."
      >
        {notifications.map((n, i) => (
          <AdminTableRow key={n.id} index={i}>
            <AdminTableCell>{n.recipient_email}</AdminTableCell>
            <AdminTableCell>
              <div>
                <p className="font-medium text-slate-900">{n.subject}</p>
                {n.body && <p className="text-xs text-slate-500 truncate max-w-xs">{n.body}</p>}
              </div>
            </AdminTableCell>
            <AdminTableCell>{prettyStatus(n.channel)}</AdminTableCell>
            <AdminTableCell>{prettyStatus(n.status)}</AdminTableCell>
            <AdminTableCell>{formatDateTime(n.created_at)}</AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  );
};

export default AdminNotifications;
