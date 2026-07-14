import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export type PackageData = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  objective: string;
  whatYouGet: { title: string; desc: string }[];
  forWho: string[];
  outcome: string[];
  ctaLabel: string;
};

type Step = "details" | "form1" | "form2" | "form3" | "success";

interface Props {
  pkg: PackageData | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  travelers: "",
  childrenCount: "",
  purpose: "",
  lifestyle: "",
  timeline: "",
};

const PackageModal = ({ pkg, open, onOpenChange }: Props) => {
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  if (!pkg) return null;

  const reset = () => {
    setStep("details");
    setForm(initialForm);
    setSubmitting(false);
  };
  const close = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const stepNum = step === "form1" ? 1 : step === "form2" ? 2 : step === "form3" ? 3 : 0;

  const handleSubmit = async () => {
    if (!pkg) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("clients").insert({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone || null,
        country_from: form.country || null,
        travelers: form.travelers || null,
        children_count:
          form.travelers === "Family" && form.childrenCount
            ? parseInt(form.childrenCount, 10) || null
            : null,
        purpose: form.purpose || null,
        lifestyle: form.lifestyle || null,
        timeline: form.timeline || null,
        package_id: pkg.id,
        package_title: pkg.title,
        package_price: pkg.price,
      });
      if (error) throw error;
      setStep("success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-accent/30 bg-[hsl(226_65%_10%)] text-primary-foreground">
        <DialogTitle className="sr-only">{pkg.title}</DialogTitle>

        {/* Gold top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent" />

        <AnimatePresence mode="wait">
          {step === "details" && (
            <motion.div key="details" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="p-8 md:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
                <Sparkles size={12} /> ${pkg.price.toLocaleString()} / package
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">{pkg.title}</h2>
              <p className="text-primary-foreground/70 italic mb-6">{pkg.subtitle}</p>

              <div className="bg-primary-foreground/5 border border-accent/20 rounded-xl p-5 mb-6">
                <p className="text-sm leading-relaxed">{pkg.objective}</p>
              </div>

              <h3 className="font-heading text-xl font-semibold mb-3 text-accent">What you get</h3>
              <ul className="space-y-3 mb-6">
                {pkg.whatYouGet.map((f) => (
                  <li key={f.title} className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <div>
                      <div className="font-semibold text-sm">{f.title}</div>
                      <div className="text-xs text-primary-foreground/70 leading-relaxed">{f.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-accent mb-2">Who it's for</h4>
                  <ul className="text-xs text-primary-foreground/75 space-y-1">
                    {pkg.forWho.map((x) => <li key={x}>• {x}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-accent mb-2">Outcome</h4>
                  <ul className="text-xs text-primary-foreground/75 space-y-1">
                    {pkg.outcome.map((x) => <li key={x}>• {x}</li>)}
                  </ul>
                </div>
              </div>

              <Button variant="gold" size="lg" className="w-full" onClick={() => setStep("form1")}>
                {pkg.ctaLabel} <ArrowRight size={18} />
              </Button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-10 text-center">
              <CheckCircle2 className="mx-auto text-accent mb-4" size={48} />
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">You're all set!</h2>
              <p className="text-primary-foreground/70 text-sm mb-2 max-w-md mx-auto">
                Your intake for <strong>{pkg.title}</strong> has been saved. Create your client portal account to book your consultation and track your journey.
              </p>
              <p className="text-primary-foreground/50 text-xs mb-8">
                Use <strong className="text-primary-foreground/80">{form.email}</strong> when signing up.
              </p>
              <div className="flex flex-col gap-3">
                <Button variant="gold" size="lg" className="w-full" asChild>
                  <Link
                    to={`/login?intake=complete&mode=signup&email=${encodeURIComponent(form.email)}&name=${encodeURIComponent(form.fullName)}`}
                    onClick={() => close(false)}
                  >
                    Create portal account <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button variant="outline-light" onClick={() => close(false)}>
                  I'll do this later
                </Button>
              </div>
            </motion.div>
          )}

          {stepNum > 0 && step !== "success" && (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="p-8 md:p-10">
              {/* Step indicator + gold progress bar */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex-1 flex items-center gap-2">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${stepNum >= n ? "bg-accent text-accent-foreground" : "bg-primary-foreground/10 text-primary-foreground/50"}`}>
                        {stepNum > n ? <Check size={14} /> : n}
                      </div>
                      {n < 3 && <div className={`flex-1 h-0.5 ${stepNum > n ? "bg-accent" : "bg-primary-foreground/10"}`} />}
                    </div>
                  ))}
                </div>
                <div className="h-1.5 w-full rounded-full bg-primary-foreground/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent/70 via-accent to-accent/70"
                    initial={false}
                    animate={{ width: `${(stepNum / 3) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
                <p className="text-[11px] uppercase tracking-widest text-primary-foreground/50 mt-2">
                  Step {stepNum} of 3
                </p>
              </div>

              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-1">
                {step === "form1" && "Personal Details"}
                {step === "form2" && "Your Journey"}
                {step === "form3" && "Confirm & Proceed"}
              </h2>
              <p className="text-primary-foreground/60 text-sm mb-6">{pkg.title} — ${pkg.price.toLocaleString()}</p>

              {step === "form1" && (
                <div className="space-y-4">
                  <FieldInput label="Full Name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
                  <FieldInput label="Email Address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <FieldInput label="Phone / WhatsApp Number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  <FieldInput label="Country you are relocating from" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
                  <div className="flex justify-between pt-4">
                    <Button variant="outline-light" onClick={() => setStep("details")}><ArrowLeft size={16} /> Back</Button>
                    <Button variant="gold" onClick={() => setStep("form2")} disabled={!form.fullName || !form.email}>Continue <ArrowRight size={16} /></Button>
                  </div>
                </div>
              )}

              {step === "form2" && (
                <div className="space-y-5">
                  <FieldRadio
                    label="Number of people relocating"
                    value={form.travelers}
                    onChange={(v) => setForm({ ...form, travelers: v, childrenCount: v === "Family" ? form.childrenCount : "" })}
                    options={["Solo", "Couple", "Family"]}
                  />
                  {form.travelers === "Family" && (
                    <FieldInput
                      label="How many children?"
                      type="number"
                      value={form.childrenCount}
                      onChange={(v) => setForm({ ...form, childrenCount: v })}
                    />
                  )}
                  <FieldRadio label="Primary purpose" value={form.purpose} onChange={(v) => setForm({ ...form, purpose: v })} options={["Vacation", "Relocation", "Investment", "Exploring options"]} />
                  <FieldRadio label="Preferred lifestyle" value={form.lifestyle} onChange={(v) => setForm({ ...form, lifestyle: v })} options={["Urban city life", "Quiet suburban", "Nature and outdoors", "Mixed"]} />
                  <FieldRadio label="Approximate timeline" value={form.timeline} onChange={(v) => setForm({ ...form, timeline: v })} options={["Within 3 months", "3–6 months", "6–12 months", "Just exploring"]} />
                  <div className="flex justify-between pt-4">
                    <Button variant="outline-light" onClick={() => setStep("form1")}><ArrowLeft size={16} /> Back</Button>
                    <Button variant="gold" onClick={() => setStep("form3")} disabled={!form.travelers || !form.purpose}>Continue <ArrowRight size={16} /></Button>
                  </div>
                </div>
              )}

              {step === "form3" && (
                <div>
                  <div className="bg-primary-foreground/5 border border-accent/20 rounded-xl p-5 space-y-3 mb-6">
                    <SummaryRow label="Package" value={`${pkg.title} — $${pkg.price.toLocaleString()}`} />
                    <SummaryRow label="Name" value={form.fullName} />
                    <SummaryRow label="Email" value={form.email} />
                    <SummaryRow label="Phone" value={form.phone} />
                    <SummaryRow label="From" value={form.country} />
                    <SummaryRow
                      label="Travelers"
                      value={
                        form.travelers === "Family" && form.childrenCount
                          ? `Family (${form.childrenCount} ${parseInt(form.childrenCount) === 1 ? "child" : "children"})`
                          : form.travelers
                      }
                    />
                    <SummaryRow label="Purpose" value={form.purpose} />
                    <SummaryRow label="Lifestyle" value={form.lifestyle} />
                    <SummaryRow label="Timeline" value={form.timeline} />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline-light" onClick={() => setStep("form2")} disabled={submitting}><ArrowLeft size={16} /> Back</Button>
                    <Button variant="gold" size="lg" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? (
                        <>Saving <Loader2 size={18} className="animate-spin" /></>
                      ) : (
                        <>Proceed to Payment <ArrowRight size={18} /></>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

const FieldInput = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div>
    <Label className="text-primary-foreground/80 text-xs uppercase tracking-wider mb-1.5 block">{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground focus-visible:ring-sky-400 focus-visible:border-sky-400"
    />
  </div>
);

const FieldRadio = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <div>
    <Label className="text-primary-foreground/80 text-xs uppercase tracking-wider mb-2 block">{label}</Label>
    <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-2">
      {options.map((o) => (
        <label key={o} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all text-sm ${value === o ? "border-accent bg-accent/10 text-primary-foreground" : "border-primary-foreground/15 text-primary-foreground/70 hover:border-accent/40"}`}>
          <RadioGroupItem value={o} className="border-primary-foreground/40 text-accent" />
          {o}
        </label>
      ))}
    </RadioGroup>
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm gap-4">
    <span className="text-primary-foreground/60">{label}</span>
    <span className="font-medium text-right">{value || "—"}</span>
  </div>
);

export default PackageModal;
