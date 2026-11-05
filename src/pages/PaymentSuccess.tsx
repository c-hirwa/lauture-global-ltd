import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaymentState = "loading" | "completed" | "failed" | "pending" | "error";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<PaymentState>("loading");

  useEffect(() => {
    const trackingId = searchParams.get("OrderTrackingId") || searchParams.get("orderTrackingId");
    if (!trackingId) {
      setState("error");
      return;
    }

    fetch(`/api/pesapal-status?orderTrackingId=${encodeURIComponent(trackingId)}`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Unable to verify this payment.");
        const normalized = String(data.status || "pending").toLowerCase();
        setState(normalized === "completed" ? "completed" : normalized === "failed" ? "failed" : "pending");
      })
      .catch(() => setState("error"));
  }, [searchParams]);

  const content = state === "completed"
    ? { icon: <CheckCircle2 size={56} />, title: "Payment Completed", text: "Thank you. Your payment has been confirmed and our team will be in touch shortly." }
    : state === "failed"
      ? { icon: <XCircle size={56} />, title: "Payment Failed", text: "The payment was not completed. Please try again or contact our team." }
      : state === "pending"
        ? { icon: <Clock3 size={56} />, title: "Payment Pending", text: "Your payment is still being processed. We will update the status shortly." }
        : state === "error"
          ? { icon: <XCircle size={56} />, title: "Unable to Verify Payment", text: "We could not verify the payment status. Please contact support with your transaction reference." }
          : { icon: <Clock3 size={56} />, title: "Checking Payment", text: "Please wait while we verify your payment securely." };

  return (
    <div className="min-h-screen bg-[#0D1B5E] text-primary-foreground flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-[#D4AF37]/30 bg-white/5 p-8 text-center shadow-2xl shadow-black/20">
        <div className="mb-4 text-[#D4AF37] flex justify-center">{content.icon}</div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">{content.title}</h1>
        <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8">{content.text}</p>
        <Button variant="gold" size="lg" asChild>
          <Link to="/" className="inline-flex items-center justify-center gap-2">Return home <ArrowRight size={18} /></Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
