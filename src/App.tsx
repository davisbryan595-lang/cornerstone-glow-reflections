import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Careers from "./pages/Careers";
import FAQ from "./pages/FAQ";
import Subscription from "./pages/Subscription";
import SubscriptionMember from "./pages/SubscriptionMember";
import MaintenancePlans from "./pages/MaintenancePlans";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Membership from "./pages/Membership";
import Checkout from "./pages/Checkout";
import MemberSettings from "./pages/MemberSettings";
import MembershipDashboard from "./pages/MembershipDashboard";
import PasswordReset from "./pages/PasswordReset";
import ForgotPassword from "./pages/ForgotPassword";
import CeramicCoatingsPage from "./pages/CeramicCoatingsPage";

const queryClient = new QueryClient();

import ChatBot from "@/components/ChatBot";
import { AuthProvider } from "@/context/AuthProvider";
import { StripeProvider } from "@/context/StripeProvider";
import { RequireAdmin, RequireMember, RequireAuth } from "@/components/RouteGuards";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StripeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
              <Route path="/subscription-member" element={<RequireMember><SubscriptionMember /></RequireMember>} />
              <Route path="/membership-dashboard" element={<RequireMember><MembershipDashboard /></RequireMember>} />
              <Route path="/member-settings" element={<RequireMember><MemberSettings /></RequireMember>} />
              <Route path="/maintenance-plans" element={<MaintenancePlans />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/ceramic-coatings" element={<CeramicCoatingsPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <ChatBot />
      </StripeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
