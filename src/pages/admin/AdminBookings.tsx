import { useEffect, useState } from "react";
import { CalendarDays, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";
import AdminTable, { AdminTableRow, AdminTableCell } from "@/components/admin/AdminTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Booking = {
  id: string;
  attendee_name: string | null;
  attendee_email: string | null;
  package_title: string | null;
  start_time: string | null;
  status: string | null;
  consultant_notes: string | null;
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, attendee_name, attendee_email, package_title, start_time, status, consultant_notes")
        .order("start_time", { ascending: false, nullsFirst: false });
      if (error) throw error;
      setBookings((data as Booking[]) ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
      toast.success(`Booking ${status}`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const openNotes = (booking: Booking) => {
    setSelected(booking);
    setNotes(booking.consultant_notes ?? "");
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ consultant_notes: notes.trim() || null })
        .eq("id", selected.id);
      if (error) throw error;
      toast.success("Notes saved");
      setSelected(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-accent" size={28} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Bookings</h1>
      <p className="text-muted-foreground text-sm mb-6">Confirm, cancel, and add consultant notes</p>

      {bookings.length === 0 ? (
        <div className="bg-card rounded-2xl border border-dashed border-border p-14 text-center">
          <CalendarDays size={40} className="mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">No bookings yet</h2>
          <p className="text-sm text-muted-foreground">
            Bookings appear here when clients schedule sessions from their portal.
          </p>
        </div>
      ) : (
        <AdminTable headers={["Client", "Package", "Date", "Status", "Actions"]}>
          {bookings.map((b, i) => (
            <AdminTableRow key={b.id} index={i}>
              <AdminTableCell>
                <div>
                  <p className="font-semibold text-foreground">{b.attendee_name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{b.attendee_email}</p>
                </div>
              </AdminTableCell>
              <AdminTableCell>{b.package_title ?? "—"}</AdminTableCell>
              <AdminTableCell>{formatDateTime(b.start_time)}</AdminTableCell>
              <AdminTableCell>
                <StatusBadge status={b.status} kind="booking" />
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex flex-wrap gap-2">
                  {b.status !== "confirmed" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "confirmed")}>
                      <Check size={14} /> Confirm
                    </Button>
                  )}
                  {b.status !== "cancelled" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "cancelled")}>
                      <X size={14} /> Cancel
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => openNotes(b)}>
                    Notes
                  </Button>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consultant Notes</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">
            {selected?.attendee_name} — {formatDateTime(selected?.start_time)}
          </p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Internal notes about this booking..."
          />
          <Button variant="gold" onClick={saveNotes} disabled={saving} className="w-full">
            {saving ? <Loader2 className="animate-spin" size={16} /> : "Save Notes"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
