import { useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
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
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setNotifications((data as Notification[]) ?? []);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load notifications");
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

  return (
    <div>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Notifications</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Every automated email and whether it went out. “Skipped” means email isn’t set up yet (no Resend API key);
        “Failed” means the provider rejected it.
      </p>

      {notifications.length === 0 ? (
        <div className="bg-card rounded-2xl border border-dashed border-border p-14 text-center">
          <Bell size={40} className="mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">No notifications yet</h2>
          <p className="text-sm text-muted-foreground">
            Entries appear here when clients submit the intake form, documents are shared, or payments complete.
          </p>
        </div>
      ) : (
        <AdminTable headers={["Recipient", "Subject", "Channel", "Status", "Sent"]}>
          {notifications.map((n, i) => (
            <AdminTableRow key={n.id} index={i}>
              <AdminTableCell>{n.recipient_email}</AdminTableCell>
              <AdminTableCell>
                <div>
                  <p className="font-semibold text-foreground">{n.subject}</p>
                  {n.body && <p className="text-xs text-muted-foreground truncate max-w-xs">{n.body}</p>}
                </div>
              </AdminTableCell>
              <AdminTableCell>{prettyStatus(n.channel)}</AdminTableCell>
              <AdminTableCell>
                <span
                  className={`status-badge ${
                    n.status === "sent"
                      ? "bg-emerald-100 text-emerald-800"
                      : n.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {prettyStatus(n.status)}
                </span>
              </AdminTableCell>
              <AdminTableCell>{formatDateTime(n.created_at)}</AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </div>
  );
};

export default AdminNotifications;
