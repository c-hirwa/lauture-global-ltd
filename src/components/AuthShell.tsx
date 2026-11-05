import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";

// Wraps only the routes that need sign-in (portal + admin). It's lazy-loaded from App,
// so public pages never download the Supabase client.
const AuthShell = () => (
  <AuthProvider>
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  </AuthProvider>
);

export default AuthShell;
