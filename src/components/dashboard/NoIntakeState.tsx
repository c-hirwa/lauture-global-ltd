import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

const NoIntakeState = () => (
  <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 md:p-14 text-center max-w-2xl mx-auto">
    <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-5">
      <ClipboardList size={28} />
    </div>
    <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2">
      Complete your intake first
    </h2>
    <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-md mx-auto">
      To book consultations and track your relocation journey, choose a package
      and submit the intake form on our website. Use the same email when
      creating your portal account.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button variant="gold" asChild>
        <Link to="/services#pricing">
          View packages <ArrowRight size={16} />
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/contact">Talk to our team</Link>
      </Button>
    </div>
  </div>
);

export default NoIntakeState;
