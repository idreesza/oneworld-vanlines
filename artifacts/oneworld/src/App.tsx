import { Switch, Route, Router as WouterRouter, Redirect } from 'wouter';
import { ClerkProvider, Show, useClerk } from '@clerk/react';
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { queryClient } from "@/lib/queryClient";
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

// Public pages
import Home from "@/pages/public/Home";
import Calculator from "@/pages/public/Calculator";
import Services from "@/pages/public/Services";
import ServiceDetail from "@/pages/public/ServiceDetail";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import Areas from "@/pages/public/Areas";
import Gallery from "@/pages/public/Gallery";
import Faq from "@/pages/public/Faq";
import Blog from "@/pages/public/Blog";
import BlogPost from "@/pages/public/BlogPost";
import Payment from "@/pages/public/Payment";
import Privacy from "@/pages/public/Privacy";
import Terms from "@/pages/public/Terms";
import Cookies from "@/pages/public/Cookies";
import MovingChecklist from "@/pages/public/MovingChecklist";
import CityLanding from "@/pages/public/CityLanding";

// Auth pages
import SignInPage from "@/pages/auth/SignIn";
import SignUpPage from "@/pages/auth/SignUp";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminLeads from "@/pages/admin/LeadsList";
import AdminLeadDetail from "@/pages/admin/LeadDetail";
import AdminWorkers from "@/pages/admin/WorkersList";
import AdminJobs from "@/pages/admin/JobsList";
import BlogManager from "@/pages/admin/BlogManager";
import FaqManager from "@/pages/admin/FaqManager";
import PricingRules from "@/pages/admin/PricingRules";

// Worker portal
import WorkerDashboard from "@/pages/worker/WorkerDashboard";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

const clerkAppearance = {
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "hsl(222 47% 11%)",
    colorBackground: "white",
    fontFamily: "'DM Sans', sans-serif",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-xl shadow-lg border border-border w-[440px] max-w-full overflow-hidden",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out"><Redirect to="/sign-in" /></Show>
    </>
  );
}

function AppRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            {/* Public */}
            <Route path="/" component={Home} />
            <Route path="/calculator" component={Calculator} />
            <Route path="/services" component={Services} />
            <Route path="/services/:type" component={ServiceDetail} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/areas" component={Areas} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/faq" component={Faq} />
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogPost} />
            <Route path="/payment" component={Payment} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/legal/cookies" component={Cookies} />
            <Route path="/moving-checklist" component={MovingChecklist} />
            <Route path="/locations/:city" component={CityLanding} />

            {/* Auth */}
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />

            {/* Worker portal */}
            <Route path="/worker">
              <ProtectedRoute><WorkerDashboard /></ProtectedRoute>
            </Route>

            {/* Admin */}
            <Route path="/admin">
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            </Route>
            <Route path="/admin/leads">
              <ProtectedRoute><AdminLeads /></ProtectedRoute>
            </Route>
            <Route path="/admin/leads/:id">
              <ProtectedRoute><AdminLeadDetail /></ProtectedRoute>
            </Route>
            <Route path="/admin/workers">
              <ProtectedRoute><AdminWorkers /></ProtectedRoute>
            </Route>
            <Route path="/admin/jobs">
              <ProtectedRoute><AdminJobs /></ProtectedRoute>
            </Route>
            <Route path="/admin/blog">
              <ProtectedRoute><BlogManager /></ProtectedRoute>
            </Route>
            <Route path="/admin/faqs">
              <ProtectedRoute><FaqManager /></ProtectedRoute>
            </Route>
            <Route path="/admin/pricing">
              <ProtectedRoute><PricingRules /></ProtectedRoute>
            </Route>

            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <HelmetProvider>
      <WouterRouter base={basePath}>
        <AppRoutes />
      </WouterRouter>
    </HelmetProvider>
  );
}

export default App;
