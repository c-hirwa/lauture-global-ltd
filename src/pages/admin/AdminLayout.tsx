import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminLayout = () => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
