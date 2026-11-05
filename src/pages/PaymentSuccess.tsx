import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type Status = "loading" | "completed" | "failed" | "pending";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!orderTrackingId) {
      setStatus("pending");
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
          setStatus("pending");
          return;
        }
        setStatus(data.status === "completed" ? "completed" : data.status === "failed" ? "failed" : "pending");
      } catch {
        if (!cancelled) setStatus("pending");
      }
    };

    check();
    // Pesapal can take a few seconds to finalize — poll briefly while pending.
    const interval = setInterval(() => {
      setStatus((current) => {
        if (current === "pending" || current === "loading") check();
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
    <div className="min-h-screen bg-[hsl(226_65%_10%)] text-primary-foreground flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-accent/20 bg-primary-foreground/5 p-8 text-center shadow-2xl shadow-black/20">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto mb-4 text-accent animate-spin" size={56} />
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Confirming your payment…</h1>
            <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed">
              Please hold on while we verify your Mobile Money payment with Pesapal.
            </p>
          </>
        )}

        {status === "completed" && (
          <>
            <CheckCircle2 className="mx-auto mb-4 text-accent" size={56} />
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Payment Successful</h1>
            <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8">
              Thank you for choosing Lauture Global LTD. Your payment is confirmed and our team will be in touch shortly to begin your journey.
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="mx-auto mb-4 text-destructive" size={56} />
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Payment Not Completed</h1>
            <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8">
              Your Mobile Money payment could not be completed. No charge was made — please try again or contact us for help.
            </p>
          </>
        )}

        {status === "pending" && (
          <>
            <Clock className="mx-auto mb-4 text-accent" size={56} />
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Payment Pending</h1>
            <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8">
              We're still waiting for confirmation of your payment. If you approved the prompt on your phone, this page will update automatically — otherwise our team will confirm with you shortly.
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
