import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type Status = "loading" | "completed" | "failed" | "pending" | "error";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderTrackingId = searchParams.get("OrderTrackingId") || searchParams.get("orderTrackingId");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!orderTrackingId) {
      setStatus("error");
      return;
    }

    let cancelled = false;

    const check = async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          `pesapal-status?orderTrackingId=${encodeURIComponent(orderTrackingId)}`,
        );

        if (cancelled) return;

        if (error || !data?.status) {
          try {
            const response = await fetch(`/api/pesapal-status?orderTrackingId=${encodeURIComponent(orderTrackingId)}`);
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.error || "Unable to verify this payment.");
            const normalized = String(payload.status || "pending").toLowerCase();
            setStatus(normalized === "completed" ? "completed" : normalized === "failed" ? "failed" : "pending");
            return;
          } catch {
            setStatus("pending");
            return;
          }
        }

        const normalized = String(data.status || "pending").toLowerCase();
        setStatus(normalized === "completed" ? "completed" : normalized === "failed" ? "failed" : "pending");
      } catch {
        if (!cancelled) {
          try {
            const response = await fetch(`/api/pesapal-status?orderTrackingId=${encodeURIComponent(orderTrackingId)}`);
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.error || "Unable to verify this payment.");
            const normalized = String(payload.status || "pending").toLowerCase();
            setStatus(normalized === "completed" ? "completed" : normalized === "failed" ? "failed" : "pending");
          } catch {
            setStatus("error");
          }
        }
      }
    };

    check();

    const interval = setInterval(() => {
      setStatus((current) => {
        if (current === "pending" || current === "loading") {
          void check();
        }
        return current;
      });
    }, 5000);

    const stop = setTimeout(() => clearInterval(interval), 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [orderTrackingId]);

  return (
    <div className="min-h-screen bg-[#0D1B5E] text-primary-foreground flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-[#D4AF37]/30 bg-white/5 p-8 text-center shadow-2xl shadow-black/20">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto mb-4 text-[#D4AF37] animate-spin" size={56} />
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Confirming your payment…</h1>
            <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed">
              Please hold on while we verify your payment securely.
            </p>
          </>
        )}

        {status === "completed" && (
          <>
            <CheckCircle2 className="mx-auto mb-4 text-[#D4AF37]" size={56} />
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Payment Completed</h1>
            <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8">
              Thank you. Your payment has been confirmed and our team will be in touch shortly.
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="mx-auto mb-4 text-[#D4AF37]" size={56} />
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Payment Not Completed</h1>
            <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8">
              Your payment could not be completed. No charge was made — please try again or contact us for help.
            </p>
          </>
        )}

        {status === "pending" && (
          <>
            <Clock3 className="mx-auto mb-4 text-[#D4AF37]" size={56} />
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Payment Pending</h1>
            <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8">
              We&apos;re still waiting for confirmation of your payment. If you approved the prompt on your phone, this page will update automatically — otherwise our team will confirm with you shortly.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto mb-4 text-[#D4AF37]" size={56} />
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Unable to Verify Payment</h1>
            <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8">
              We could not verify the payment status. Please contact support with your transaction reference.
            </p>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="gold" size="lg" asChild>
            <Link to="/" className="inline-flex items-center justify-center gap-2">
              Return home <ArrowRight size={18} />
            </Link>
          </Button>
          {status === "failed" && (
            <Button variant="outline-light" size="lg" asChild>
              <Link to="/services">Try again</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
