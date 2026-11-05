import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTop from "./components/ScrollToTop";
import RouteMeta from "./components/RouteMeta";
import Index from "./pages/Index.tsx";

// Auth (and with it the Supabase client) is only loaded for portal/admin routes.
const AuthShell = lazy(() => import("./components/AuthShell.tsx"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute.tsx"));

const About = lazy(() => import("./pages/About.tsx"));
const Services = lazy(() => import("./pages/Services.tsx"));
const Resources = lazy(() => import("./pages/Resources.tsx"));
const Founders = lazy(() => import("./pages/Founders.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Partners = lazy(() => import("./pages/Partners.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
// Stripe disabled: /success was the Stripe checkout return page.
// const Success = lazy(() => import("./pages/Success.tsx"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess.tsx"));
const PaymentFailed = lazy(() => import("./pages/PaymentFailed.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients.tsx"));
const AdminClientDetail = lazy(() => import("./pages/admin/AdminClientDetail.tsx"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings.tsx"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications.tsx"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments.tsx"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-10 w-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <RouteMeta />
        {/* Vercel Web Analytics: page views per route (enable Analytics in the Vercel project too). */}
        <Analytics />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/founders" element={<Founders />} />
            <Route path="/contact" element={<Contact />} />
            {/* Stripe disabled: <Route path="/success" element={<Success />} /> */}
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />

            <Route element={<AuthShell />}>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="clients/:id" element={<AdminClientDetail />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="notifications" element={<AdminNotifications />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
