import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Lock,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
// Stripe disabled — payments go through Pesapal only.
// import { createCheckoutSession } from "@/lib/createCheckout";

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

type Step = "details" | "contact" | "plans" | "review" | "success";

const FORM_STEPS: { key: Step; label: string }[] = [
  { key: "contact", label: "Your details" },
  { key: "plans", label: "Your plans" },
  { key: "review", label: "Review & pay" },
];

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PackageModal = ({ pkg, open, onOpenChange }: Props) => {
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState<null | "pay" | "save">(null);
  // The intake is saved once; retrying payment shouldn't create duplicate client records.
  const [intakeSaved, setIntakeSaved] = useState(false);
  // Only complain about the email after the visitor leaves the field, not mid-typing.
  const [emailTouched, setEmailTouched] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Each step starts at the top; otherwise a short step can open scrolled past its content.
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [step]);

  if (!pkg) return null;

  const reset = () => {
    setStep("details");
    setForm(initialForm);
    setBusy(null);
    setIntakeSaved(false);
    setEmailTouched(false);
  };
  const close = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const update = (patch: Partial<typeof initialForm>) => setForm((f) => ({ ...f, ...patch }));
  const stepIndex = FORM_STEPS.findIndex((s) => s.key === step);
  const emailValid = EMAIL_RE.test(form.email.trim());
  const contactValid = form.fullName.trim().length > 1 && emailValid && form.phone.trim().length >= 7;
  const plansValid = Boolean(form.travelers && form.purpose);

  const saveIntake = async () => {
    if (intakeSaved) return;
    // Loaded on demand so the Services page doesn't download the Supabase client up front.
    const { supabase } = await import("@/lib/supabase");
    const { error } = await supabase.from("clients").insert({
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      country_from: form.country.trim() || null,
      travelers: form.travelers || null,
      children_count:
        form.travelers === "Family" && form.childrenCount ? parseInt(form.childrenCount, 10) || null : null,
      purpose: form.purpose || null,
      lifestyle: form.lifestyle || null,
      timeline: form.timeline || null,
      package_id: pkg.id,
      package_title: pkg.title,
      package_price: pkg.price,
    });
    if (error) throw new Error("We couldn't save your details. Please try again.");
    setIntakeSaved(true);
  };

  // Stripe disabled — payments go through Pesapal only.
  // const payByCard = async () => {
  //   if (!pkg) return;
  //   setSubmitting(true);
  //   try {
  //     await createCheckoutSession({
  //       packageType: pkg.id,
  //       amount: pkg.price * 100,
  //       customerEmail: form.email,
  //       customerName: form.fullName,
  //     });
  //   } catch (err: unknown) {
  //     const message = err instanceof Error ? err.message : "Unable to start checkout right now.";
  //     toast.error(message);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const payWithPesapal = async () => {
    setBusy("pay");
    try {
      await saveIntake();
      const response = await fetch("/api/pesapal-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageType: pkg.id,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.redirect_url) {
        throw new Error(data.error || "Unable to start Pesapal payment. Please try again.");
      }
      window.location.assign(data.redirect_url);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unable to start Pesapal payment. Please try again.");
      setBusy(null);
    }
  };

  const submitWithoutPaying = async () => {
    setBusy("save");
    try {
      await saveIntake();
      setStep("success");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const travelersLabel =
    form.travelers === "Family" && form.childrenCount
      ? `Family (${form.childrenCount} ${parseInt(form.childrenCount, 10) === 1 ? "child" : "children"})`
      : form.travelers;

  // Cheap CSS fade between steps (tailwindcss-animate), no animation library needed.
  const stepFade = "animate-in fade-in-0 duration-200";

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent ref={contentRef} className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-accent/30 bg-[hsl(226_65%_10%)] text-primary-foreground">
        <DialogTitle className="sr-only">{pkg.title}</DialogTitle>

        {/* Gold top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent" />

          {step === "details" && (
            <div key="details" className={`${stepFade} p-6 sm:p-8 md:p-10`}>
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

              <Button variant="gold" size="lg" className="w-full" onClick={() => setStep("contact")}>
                {pkg.ctaLabel} <ArrowRight size={18} />
              </Button>
              <p className="text-center text-xs text-primary-foreground/50 mt-3">
                Takes about 2 minutes · You'll review everything before paying
              </p>
            </div>
          )}

          {stepIndex >= 0 && (
            <div key={step} className={`${stepFade} p-6 sm:p-8 md:p-10`}>
              {/* Step indicator */}
              <ol className="flex items-center gap-2 mb-6" aria-label="Checkout progress">
                {FORM_STEPS.map((s, i) => (
                  <li key={s.key} className="flex-1 flex items-center gap-2 min-w-0">
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-all ${
                        i <= stepIndex ? "bg-accent text-accent-foreground" : "bg-primary-foreground/10 text-primary-foreground/50"
                      }`}
                      aria-current={i === stepIndex ? "step" : undefined}
                    >
                      {i < stepIndex ? <Check size={14} /> : i + 1}
                    </span>
                    <span
                      className={`text-xs font-medium truncate hidden sm:inline ${
                        i <= stepIndex ? "text-primary-foreground" : "text-primary-foreground/50"
                      }`}
                    >
                      {s.label}
                    </span>
                    {i < FORM_STEPS.length - 1 && (
                      <span className={`flex-1 h-0.5 min-w-3 ${i < stepIndex ? "bg-accent" : "bg-primary-foreground/10"}`} />
                    )}
                  </li>
                ))}
              </ol>

              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-1">{FORM_STEPS[stepIndex].label}</h2>
              <p className="text-primary-foreground/60 text-sm mb-6">
                {pkg.title} · <span className="text-accent font-semibold">${pkg.price.toLocaleString()}</span>
              </p>

              {step === "contact" && (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (contactValid) setStep("plans");
                  }}
                >
                  <FieldInput label="Full name" autoComplete="name" value={form.fullName} onChange={(v) => update({ fullName: v })} />
                  <FieldInput
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(v) => update({ email: v })}
                    onBlur={() => setEmailTouched(true)}
                    error={emailTouched && form.email && !emailValid ? "Please enter a valid email address." : undefined}
                  />
                  <FieldInput
                    label="Phone / WhatsApp number"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+250 7XX XXX XXX"
                    value={form.phone}
                    onChange={(v) => update({ phone: v })}
                    hint="Needed for Mobile Money payments and so our team can reach you."
                  />
                  <FieldInput
                    label="Country you're coming from (optional)"
                    autoComplete="country-name"
                    value={form.country}
                    onChange={(v) => update({ country: v })}
                  />
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline-light" onClick={() => setStep("details")}>
                      <ArrowLeft size={16} /> Back
                    </Button>
                    <Button type="submit" variant="gold" disabled={!contactValid}>
                      Continue <ArrowRight size={16} />
                    </Button>
                  </div>
                </form>
              )}

              {step === "plans" && (
                <div className="space-y-5">
                  <FieldRadio
                    label="Who's coming?"
                    value={form.travelers}
                    onChange={(v) => update({ travelers: v, childrenCount: v === "Family" ? form.childrenCount : "" })}
                    options={["Solo", "Couple", "Family"]}
                  />
                  {form.travelers === "Family" && (
                    <FieldInput
                      label="How many children?"
                      type="number"
                      value={form.childrenCount}
                      onChange={(v) => update({ childrenCount: v })}
                    />
                  )}
                  <FieldRadio
                    label="Main purpose"
                    value={form.purpose}
                    onChange={(v) => update({ purpose: v })}
                    options={["Vacation", "Relocation", "Investment", "Exploring options"]}
                  />
                  <FieldRadio
                    label="Timeline (optional)"
                    value={form.timeline}
                    onChange={(v) => update({ timeline: v })}
                    options={["Within 3 months", "3–6 months", "6–12 months", "Just exploring"]}
                  />
                  <FieldRadio
                    label="Preferred lifestyle (optional)"
                    value={form.lifestyle}
                    onChange={(v) => update({ lifestyle: v })}
                    options={["Urban city life", "Quiet suburban", "Nature and outdoors", "Mixed"]}
                  />
                  <div className="flex justify-between pt-4">
                    <Button variant="outline-light" onClick={() => setStep("contact")}>
                      <ArrowLeft size={16} /> Back
                    </Button>
                    <Button variant="gold" onClick={() => setStep("review")} disabled={!plansValid}>
                      Review <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              )}

              {step === "review" && (
                <div>
                  <div className="bg-primary-foreground/5 border border-accent/20 rounded-xl divide-y divide-primary-foreground/10 mb-5">
                    <SummarySection title="Package">
                      <SummaryRow label={pkg.title} value={`$${pkg.price.toLocaleString()} USD`} strong />
                    </SummarySection>
                    <SummarySection title="Your details" onEdit={() => setStep("contact")}>
                      <SummaryRow label="Name" value={form.fullName} />
                      <SummaryRow label="Email" value={form.email} />
                      <SummaryRow label="Phone" value={form.phone} />
                      {form.country && <SummaryRow label="From" value={form.country} />}
                    </SummarySection>
                    <SummarySection title="Your plans" onEdit={() => setStep("plans")}>
                      <SummaryRow label="Travelers" value={travelersLabel} />
                      <SummaryRow label="Purpose" value={form.purpose} />
                      {form.timeline && <SummaryRow label="Timeline" value={form.timeline} />}
                      {form.lifestyle && <SummaryRow label="Lifestyle" value={form.lifestyle} />}
                    </SummarySection>
                  </div>

                  {/* Stripe disabled — payments go through Pesapal only.
                  <button type="button" onClick={payByCard}>Pay by Card (international)</button>
                  */}

                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full h-14 text-base"
                    onClick={payWithPesapal}
                    disabled={busy !== null}
                  >
                    {busy === "pay" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Redirecting to Pesapal…
                      </>
                    ) : (
                      <>
                        <Lock size={16} /> Pay ${pkg.price.toLocaleString()} securely
                      </>
                    )}
                  </Button>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-primary-foreground/60">
                    <span className="inline-flex items-center gap-1.5">
                      <Smartphone size={14} className="text-accent" /> MTN MoMo · Airtel Money
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CreditCard size={14} className="text-accent" /> Visa · Mastercard
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Lock size={13} className="text-accent" /> Secured by Pesapal
                    </span>
                  </div>

                  <div className="mt-6 rounded-xl border border-primary-foreground/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">What happens next</p>
                    <ol className="space-y-2 text-sm text-primary-foreground/75">
                      <li className="flex gap-3">
                        <span className="text-accent font-semibold">1.</span>
                        You'll pay on Pesapal's secure page, by Mobile Money or card.
                      </li>
                      <li className="flex gap-3">
                        <span className="text-accent font-semibold">2.</span>
                        You'll get a confirmation by email once the payment goes through.
                      </li>
                      <li className="flex gap-3">
                        <span className="text-accent font-semibold">3.</span>
                        Our team contacts you to schedule your first consultation.
                      </li>
                    </ol>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-6">
                    <Button variant="outline-light" onClick={() => setStep("plans")} disabled={busy !== null}>
                      <ArrowLeft size={16} /> Back
                    </Button>
                    <button
                      type="button"
                      onClick={submitWithoutPaying}
                      disabled={busy !== null}
                      className="text-sm text-primary-foreground/60 hover:text-accent underline-offset-4 hover:underline disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    >
                      {busy === "save" && <Loader2 size={14} className="animate-spin" />}
                      Not ready to pay? Send my request without paying
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "success" && (
            <div key="success" className={`${stepFade} p-6 sm:p-8 md:p-10 text-center`}>
              <CheckCircle2 className="mx-auto text-accent mb-4" size={48} />
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                Thank you, {form.fullName.trim().split(" ")[0] || "friend"}!
              </h2>
              <p className="text-primary-foreground/70 text-sm mb-2 max-w-md mx-auto">
                Your request for <strong>{pkg.title}</strong> has been received. Our team will be in touch shortly to
                confirm your booking and payment.
              </p>
              <p className="text-primary-foreground/50 text-xs mb-8">
                We'll reach out at <strong className="text-primary-foreground/80">{form.email}</strong>.
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
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
};

const FieldInput = ({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  placeholder,
  hint,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
}) => {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <Label htmlFor={id} className="text-primary-foreground/80 text-xs uppercase tracking-widest mb-1.5 block">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${id}-help` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="h-11 bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 focus-visible:ring-accent focus-visible:border-accent"
      />
      {(error || hint) && (
        <p id={`${id}-help`} className={`text-xs mt-1.5 ${error ? "text-red-300" : "text-primary-foreground/50"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
};

const FieldRadio = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <div>
    <Label className="text-primary-foreground/80 text-xs uppercase tracking-wider mb-2 block">{label}</Label>
    <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-2">
      {options.map((o) => (
        <label
          key={o}
          className={`flex items-center gap-2 px-3 py-3 rounded-lg border cursor-pointer transition-all text-sm ${
            value === o
              ? "border-accent bg-accent/10 text-primary-foreground"
              : "border-primary-foreground/15 text-primary-foreground/70 hover:border-accent/40"
          }`}
        >
          <RadioGroupItem value={o} className="border-primary-foreground/40 text-accent" />
          {o}
        </label>
      ))}
    </RadioGroup>
  </div>
);

const SummarySection = ({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) => (
  <div className="p-4 sm:p-5">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">{title}</p>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-primary-foreground/60 hover:text-accent inline-flex items-center gap-1"
        >
          <Pencil size={12} /> Edit
        </button>
      )}
    </div>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const SummaryRow = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className="flex justify-between text-sm gap-4">
    <span className={strong ? "font-semibold" : "text-primary-foreground/60"}>{label}</span>
    <span className={`text-right break-all ${strong ? "font-bold text-accent" : "font-medium"}`}>{value || "—"}</span>
  </div>
);

export default PackageModal;
