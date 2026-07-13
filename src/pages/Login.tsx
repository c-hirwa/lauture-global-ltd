import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, Loader2 } from "lucide-react";
import logo from "@/assets/logo-lauture.png";

const Login = () => {
  const { signIn, signUp, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const intakeComplete = searchParams.get("intake") === "complete";
  const prefilledEmail = searchParams.get("email") ?? "";
  const prefilledName = searchParams.get("name") ?? "";

  const [mode, setMode] = useState<"signin" | "signup" | "reset">(
    searchParams.get("mode") === "signup" ? "signup" : "signin",
  );
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (prefilledEmail) setEmail(prefilledEmail);
  }, [prefilledEmail]);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    if (mode === "reset") {
      const { error } = await resetPassword(email);
      setBusy(false);
      if (error) {
        toast.error(error.message);
      } else {
        setResetSent(true);
        toast.success("Password reset link sent. Check your inbox.");
      }
      return;
    }

    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email, password, prefilledName || undefined);
    setBusy(false);

    if (error) {
      toast.error(error.message);
    } else if (mode === "signup") {
      toast.success("Check your email to confirm your account, then sign in.");
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[hsl(226_65%_10%)] px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center mb-8">
          <img src={logo} alt="Lauture Global" className="h-12 w-auto" />
        </Link>

        {intakeComplete && (
          <div className="mb-4 rounded-xl border border-accent/30 bg-accent/10 p-4 flex gap-3">
            <CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-primary-foreground/90">
              <p className="font-semibold text-accent mb-1">Intake submitted successfully</p>
              <p>Create your portal account below using the same email to book sessions and track your journey.</p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-accent/25 bg-[hsl(226_55%_14%)] p-8 shadow-2xl">
          <h1 className="font-heading text-2xl font-bold text-primary-foreground text-center mb-1">
            {mode === "signin" && "Client Portal"}
            {mode === "signup" && "Create your account"}
            {mode === "reset" && "Reset password"}
          </h1>
          <p className="text-primary-foreground/60 text-sm text-center mb-6">
            {mode === "signin" && "Sign in to manage your relocation journey"}
            {mode === "signup" && "Use the same email you used during intake"}
            {mode === "reset" && "We'll email you a link to reset your password"}
          </p>

          {resetSent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-primary-foreground/80">
                If an account exists for <strong>{email}</strong>, you'll receive a reset link shortly.
              </p>
              <Button variant="gold" className="w-full" onClick={() => { setMode("signin"); setResetSent(false); }}>
                Back to sign in
              </Button>
            </div>
          ) : (
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
              {mode !== "reset" && (
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
                    className="bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground"
                  />
                </div>
              )}
              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={busy}>
                {busy ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : mode === "signin" ? (
                  "Sign In"
                ) : mode === "signup" ? (
                  "Create Account"
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}

          {!resetSent && (
            <div className="text-center text-sm text-primary-foreground/60 mt-6 space-y-2">
              {mode === "signin" && (
                <>
                  <p>
                    New client?{" "}
                    <button onClick={() => setMode("signup")} className="text-accent font-semibold hover:underline">
                      Create account
                    </button>
                  </p>
                  <button onClick={() => setMode("reset")} className="text-primary-foreground/50 hover:text-accent text-xs">
                    Forgot password?
                  </button>
                </>
              )}
              {mode === "signup" && (
                <p>
                  Already have an account?{" "}
                  <button onClick={() => setMode("signin")} className="text-accent font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              )}
              {mode === "reset" && (
                <button onClick={() => setMode("signin")} className="text-accent font-semibold hover:underline">
                  Back to sign in
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-primary-foreground/40 mt-6">
          <Link to="/" className="hover:text-accent">← Back to website</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
