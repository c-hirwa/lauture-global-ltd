import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Success = () => {
  const [searchParams] = useSearchParams();
  const packageType = searchParams.get("package") ?? "your package";

  return (
    <div className="min-h-screen bg-[hsl(226_65%_10%)] text-primary-foreground flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-accent/20 bg-primary-foreground/5 p-8 text-center shadow-2xl shadow-black/20">
        <CheckCircle2 className="mx-auto mb-4 text-accent" size={56} />
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Payment Successful</h1>
        <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8">
          Thank you for choosing Lauture Global LTD. Your <span className="font-semibold text-accent">{packageType}</span> package is being prepared, and our team will be in touch shortly.
        </p>
        <Button variant="gold" size="lg" asChild>
          <Link to="/" className="inline-flex items-center justify-center gap-2">
            Return home <ArrowRight size={18} />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Success;
