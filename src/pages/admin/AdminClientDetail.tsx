import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
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
    const cRes = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
    const clientData = cRes.data as Client | null;
    setClient(clientData);
    if (clientData) {
      const docs = await supabase
        .from("documents")
        .select("*")
        .ilike("client_email", clientData.email)
        .order("created_at", { ascending: false });
      setDocuments((docs.data as Doc[]) ?? []);
    } else {
      setDocuments([]);
    }
    setLoading(false);
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
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Client updated");
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
        body: `A new document has been shared with you in your client dashboard.`,
        channel: "email",
        status: "sent",
        related_client_id: client.id,
      });

      toast.success("Document uploaded");
      setDocTitle("");
      setDocDescription("");
      setDocCategory("");
      setDocFile(null);
      load();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
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
        <p className="text-slate-500 mb-4">Client not found</p>
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
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-accent mb-4"
      >
        <ArrowLeft size={16} /> Back to clients
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">{client.full_name}</h1>
          <p className="text-slate-500 text-sm">Added {formatDate(client.created_at)}</p>
        </div>
        <Button variant="gold" onClick={saveClient} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="font-heading font-bold text-lg text-slate-900">Profile Details</h2>
          <Field label="Full Name" value={client.full_name} onChange={(v) => updateField("full_name", v)} />
          <Field label="Email" value={client.email} onChange={(v) => updateField("email", v)} />
          <Field label="Phone" value={client.phone ?? ""} onChange={(v) => updateField("phone", v)} />
          <Field label="Country" value={client.country_from ?? ""} onChange={(v) => updateField("country_from", v)} />

          <div>
            <Label className="text-xs uppercase tracking-wider text-slate-500">Package</Label>
            <p className="mt-1 text-sm font-medium">
              {client.package_title ?? "—"} {client.package_price != null && `(${formatCurrency(client.package_price)})`}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-slate-500 mb-1.5 block">Payment Status</Label>
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
              <Label className="text-xs uppercase tracking-wider text-slate-500 mb-1.5 block">Journey Stage</Label>
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

          <div className="pt-2 border-t border-slate-100 text-sm text-slate-600 space-y-1">
            <p><span className="text-slate-400">Travelers:</span> {client.travelers ?? "—"}</p>
            <p><span className="text-slate-400">Purpose:</span> {client.purpose ?? "—"}</p>
            <p><span className="text-slate-400">Lifestyle:</span> {client.lifestyle ?? "—"}</p>
            <p><span className="text-slate-400">Timeline:</span> {client.timeline ?? "—"}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">Upload Document</h2>
            <p className="text-sm text-slate-500 mb-4">Files will appear in the client's dashboard.</p>
            <div className="space-y-3">
              <Field label="Title" value={docTitle} onChange={setDocTitle} />
              <Field label="Category" value={docCategory} onChange={setDocCategory} />
              <div>
                <Label className="text-xs uppercase tracking-wider text-slate-500 mb-1.5 block">Description</Label>
                <Textarea value={docDescription} onChange={(e) => setDocDescription(e.target.value)} rows={2} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-slate-500 mb-1.5 block">File</Label>
                <Input type="file" onChange={(e) => setDocFile(e.target.files?.[0] ?? null)} />
              </div>
              <Button variant="gold" onClick={uploadDocument} disabled={uploading} className="w-full">
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                Upload Document
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">Client Documents</h2>
            {documents.length === 0 ? (
              <p className="text-sm text-slate-500">No documents uploaded yet.</p>
            ) : (
              <ul className="space-y-3">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 text-sm border-b border-slate-100 pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900">{d.title}</p>
                      <p className="text-xs text-slate-500">{formatDate(d.created_at)}</p>
                    </div>
                    <a href={d.file_url} target="_blank" rel="noreferrer" className="text-accent text-xs font-semibold hover:underline">
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
    <Label className="text-xs uppercase tracking-wider text-slate-500 mb-1.5 block">{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default AdminClientDetail;
