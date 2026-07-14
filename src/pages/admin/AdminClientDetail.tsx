import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import {
  JOURNEY_STAGES,
  PAYMENT_STATUSES,
  prettyStatus,
  formatCurrency,
  formatDate,
} from "@/lib/constants";
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
  travelers: string | null;
  purpose: string | null;
  lifestyle: string | null;
  timeline: string | null;
  package_id: string | null;
  package_title: string | null;
  package_price: number | null;
  payment_status: string;
  stage: string;
  created_at: string;
};

type Doc = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  file_url: string;
  created_at: string;
};

const AdminClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [docCategory, setDocCategory] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const cRes = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
      if (cRes.error) throw cRes.error;
      const clientData = cRes.data as Client | null;
      setClient(clientData);
      if (clientData) {
        const docs = await supabase
          .from("documents")
          .select("*")
          .ilike("client_email", clientData.email)
          .order("created_at", { ascending: false });
        if (docs.error) throw docs.error;
        setDocuments((docs.data as Doc[]) ?? []);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load client");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const updateField = (field: keyof Client, value: string) => {
    if (!client) return;
    setClient({ ...client, [field]: value });
  };

  const saveClient = async () => {
    if (!client) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          full_name: client.full_name,
          email: client.email,
          phone: client.phone,
          country_from: client.country_from,
          payment_status: client.payment_status,
          stage: client.stage,
        })
        .eq("id", client.id);
      if (error) throw error;
      toast.success("Client updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadDocument = async () => {
    if (!client || !docFile || !docTitle.trim()) {
      toast.error("Title and file are required");
      return;
    }
    setUploading(true);
    try {
      const ext = docFile.name.split(".").pop();
      const path = `${client.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("client-documents")
        .upload(path, docFile, { upsert: false });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("client-documents").getPublicUrl(path);
      const { error: insertError } = await supabase.from("documents").insert({
        client_email: client.email,
        title: docTitle.trim(),
        description: docDescription.trim() || null,
        category: docCategory.trim() || null,
        file_url: urlData.publicUrl,
      });
      if (insertError) throw insertError;

      await supabase.from("notifications").insert({
        recipient_email: client.email,
        subject: `New document: ${docTitle.trim()}`,
        body: "A new document has been shared with you in your client dashboard.",
        channel: "email",
        status: "sent",
        related_client_id: client.id,
      });

      toast.success("Document uploaded");
      setDocTitle("");
      setDocDescription("");
      setDocCategory("");
      setDocFile(null);
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-accent" size={28} />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Client not found</p>
        <Button variant="outline" asChild>
          <Link to="/admin/clients"><ArrowLeft size={16} /> Back to clients</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/admin/clients"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-4"
      >
        <ArrowLeft size={16} /> Back to clients
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{client.full_name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <StatusBadge status={client.payment_status} kind="payment" />
            <StatusBadge status={client.stage} kind="stage" />
            <span className="text-xs text-muted-foreground">Added {formatDate(client.created_at)}</span>
          </div>
        </div>
        <Button variant="gold" onClick={saveClient} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">Profile Details</h2>
          <Field label="Full Name" value={client.full_name} onChange={(v) => updateField("full_name", v)} />
          <Field label="Email" value={client.email} onChange={(v) => updateField("email", v)} />
          <Field label="Phone" value={client.phone ?? ""} onChange={(v) => updateField("phone", v)} />
          <Field label="Country" value={client.country_from ?? ""} onChange={(v) => updateField("country_from", v)} />

          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Package</Label>
            <p className="mt-1 text-sm font-medium text-foreground">
              {client.package_title ?? "—"}{" "}
              {client.package_price != null && `(${formatCurrency(client.package_price)})`}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Payment Status
              </Label>
              <Select value={client.payment_status} onValueChange={(v) => updateField("payment_status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{prettyStatus(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Journey Stage
              </Label>
              <Select value={client.stage} onValueChange={(v) => updateField("stage", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {JOURNEY_STAGES.map((s) => (
                    <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 border-t border-border grid sm:grid-cols-2 gap-3 text-sm">
            <Meta label="Travelers" value={client.travelers} />
            <Meta label="Purpose" value={client.purpose} />
            <Meta label="Lifestyle" value={client.lifestyle} />
            <Meta label="Timeline" value={client.timeline} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-heading font-bold text-lg text-foreground mb-1">Upload Document</h2>
            <p className="text-sm text-muted-foreground mb-4">Visible in the client's dashboard.</p>
            <div className="space-y-3">
              <Field label="Title" value={docTitle} onChange={setDocTitle} />
              <Field label="Category" value={docCategory} onChange={setDocCategory} />
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Description
                </Label>
                <Textarea value={docDescription} onChange={(e) => setDocDescription(e.target.value)} rows={2} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">File</Label>
                <Input type="file" onChange={(e) => setDocFile(e.target.files?.[0] ?? null)} />
              </div>
              <Button variant="gold" onClick={uploadDocument} disabled={uploading} className="w-full">
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                Upload Document
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-heading font-bold text-lg text-foreground mb-4">Client Documents</h2>
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
            ) : (
              <ul className="space-y-3">
                {documents.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between gap-3 text-sm border-b border-border pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{d.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(d.created_at)}</p>
                    </div>
                    <a
                      href={d.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent text-xs font-semibold hover:underline"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const Meta = ({ label, value }: { label: string; value: string | null }) => (
  <div>
    <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
    <p className="font-medium text-foreground mt-0.5">{value || "—"}</p>
  </div>
);

export default AdminClientDetail;
