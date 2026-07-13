import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo-lauture.png";

const AdminLogin = () => {
  const { signIn, user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && !adminLoading && user && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    // Admin check happens via useAdminAuth after sign-in
  };

  useEffect(() => {
    if (!authLoading && !adminLoading && user && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
    }
  }, [user, isAdmin, authLoading, adminLoading]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[hsl(226_65%_10%)] px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center mb-8">
          <img src={logo} alt="Lauture Global" className="h-12 w-auto" />
        </Link>
        <div className="rounded-2xl border border-accent/25 bg-[hsl(226_55%_14%)] p-8 shadow-2xl">
          <h1 className="font-heading text-2xl font-bold text-primary-foreground text-center mb-1">
            Admin Sign In
          </h1>
          <p className="text-primary-foreground/60 text-sm text-center mb-6">
            Restricted access for Lauture Global staff
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label className="text-primary-foreground/80 text-xs uppercase tracking-wider mb-1.5 block">
                Email
              </Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground"
              />
            </div>
            <div>
              <Label className="text-primary-foreground/80 text-xs uppercase tracking-wider mb-1.5 block">
                Password
              </Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground"
              />
            </div>
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-primary-foreground/40 mt-6">
          <Link to="/" className="hover:text-accent">← Back to website</Link>
        </p>
      </div>
    </main>
  );
};

export default AdminLogin;
