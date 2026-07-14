import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo-lauture.png";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const navContent = (
    <>
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src={logo} alt="Lauture Global" className="h-8 w-auto" />
        </Link>
        <p className="text-[10px] text-white/45 mt-2 uppercase tracking-widest">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-[hsl(var(--navy-dark))] text-white shadow-md"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[hsl(var(--navy-dark))] text-white z-40 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white/70"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
        {navContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
