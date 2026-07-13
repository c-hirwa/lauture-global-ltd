import { useEffect, useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { prettyStatus, formatDateTime } from "@/lib/constants";
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
    const { data, error } = await supabase
      .from("bookings")
      .select("id, attendee_name, attendee_email, package_title, start_time, status, consultant_notes")
      .order("start_time", { ascending: false, nullsFirst: false });
    if (error) console.error(error);
    setBookings((data as Booking[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Booking ${status}`);
    load();
  };

  const openNotes = (booking: Booking) => {
    setSelected(booking);
    setNotes(booking.consultant_notes ?? "");
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase
      .from("bookings")
      .update({ consultant_notes: notes.trim() || null })
      .eq("id", selected.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Notes saved");
      setSelected(null);
      load();
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
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-2">Bookings</h1>
      <p className="text-slate-500 text-sm mb-6">Confirm, cancel, and add consultant notes</p>

      <AdminTable
        headers={["Client", "Package", "Date", "Status", "Actions"]}
        isEmpty={bookings.length === 0}
      >
        {bookings.map((b, i) => (
          <AdminTableRow key={b.id} index={i}>
            <AdminTableCell>
              <div>
                <p className="font-medium text-slate-900">{b.attendee_name ?? "—"}</p>
                <p className="text-xs text-slate-500">{b.attendee_email}</p>
              </div>
            </AdminTableCell>
            <AdminTableCell>{b.package_title ?? "—"}</AdminTableCell>
            <AdminTableCell>{formatDateTime(b.start_time)}</AdminTableCell>
            <AdminTableCell>
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                  b.status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : b.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {prettyStatus(b.status)}
              </span>
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

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consultant Notes</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 mb-2">
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
