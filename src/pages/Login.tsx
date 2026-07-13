import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo-lauture.png";

const Login = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else if (mode === "signup") {
      toast.success("Check your email to confirm your account.");
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[hsl(226_65%_10%)] px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center mb-8">
          <img src={logo} alt="Lauture Global" className="h-12 w-auto" />
        </Link>
        <div className="rounded-2xl border border-accent/25 bg-[hsl(226_55%_14%)] p-8 shadow-2xl">
          <h1 className="font-heading text-2xl font-bold text-primary-foreground text-center mb-1">
            {mode === "signin" ? "Client Portal" : "Create an account"}
          </h1>
          <p className="text-primary-foreground/60 text-sm text-center mb-6">
            {mode === "signin"
              ? "Sign in to access your dashboard"
              : "Use the email you provided during intake"}
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
                className="bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground focus-visible:ring-sky-400 focus-visible:border-sky-400"
              />
            </div>
            <div>
              <Label className="text-primary-foreground/80 text-xs uppercase tracking-wider mb-1.5 block">
                Password
              </Label>
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground focus-visible:ring-sky-400 focus-visible:border-sky-400"
              />
            </div>
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="animate-spin" size={18} /> : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-primary-foreground/60 mt-6">
            {mode === "signin" ? "New client?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-accent font-semibold hover:underline"
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
        <p className="text-center text-xs text-primary-foreground/40 mt-6">
          <Link to="/" className="hover:text-accent">← Back to website</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
