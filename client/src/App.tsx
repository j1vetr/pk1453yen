import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnalyticsLoader } from "@/components/AnalyticsLoader";

// Pages
import Home from "@/pages/Home";
import IlPage from "@/pages/IlPage";
import IlcePage from "@/pages/IlcePage";
import MahallePage from "@/pages/MahallePage";
import KodPage from "@/pages/KodPage";
import SearchPage from "@/pages/SearchPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import CookiePage from "@/pages/CookiePage";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Messages from "@/pages/admin/Messages";
import CSVImport from "@/pages/admin/CSVImport";
import DataManagement from "@/pages/admin/DataManagement";
import SiteSettings from "@/pages/admin/SiteSettings";
import SEOManagement from "@/pages/admin/SEOManagement";
import Analytics from "@/pages/admin/Analytics";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        {() => (
          <PublicLayout>
            <Home />
          </PublicLayout>
        )}
      </Route>
      <Route path="/ara">
        {() => (
          <PublicLayout>
            <SearchPage />
          </PublicLayout>
        )}
      </Route>
      <Route path="/hakkimizda">
        {() => (
          <PublicLayout>
            <AboutPage />
          </PublicLayout>
        )}
      </Route>
      <Route path="/iletisim">
        {() => (
          <PublicLayout>
            <ContactPage />
          </PublicLayout>
        )}
      </Route>
      <Route path="/gizlilik-politikasi">
        {() => (
          <PublicLayout>
            <PrivacyPage />
          </PublicLayout>
        )}
      </Route>
      <Route path="/kullanim-sartlari">
        {() => (
          <PublicLayout>
            <TermsPage />
          </PublicLayout>
        )}
      </Route>
      <Route path="/cerez-politikasi">
        {() => (
          <PublicLayout>
            <CookiePage />
          </PublicLayout>
        )}
      </Route>
      <Route path="/kod/:pk">
        {() => (
          <PublicLayout>
            <KodPage />
          </PublicLayout>
        )}
      </Route>
      <Route path="/:ilSlug">
        {() => (
          <PublicLayout>
            <IlPage />
          </PublicLayout>
        )}
      </Route>
      <Route path="/:ilSlug/:ilceSlug">
        {() => (
          <PublicLayout>
            <IlcePage />
          </PublicLayout>
        )}
      </Route>
      <Route path="/:ilSlug/:ilceSlug/:mahalleSlug">
        {() => (
          <PublicLayout>
            <MahallePage />
          </PublicLayout>
        )}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/messages" component={Messages} />
      <Route path="/admin/csv-import" component={CSVImport} />
      <Route path="/admin/data" component={DataManagement} />
      <Route path="/admin/settings" component={SiteSettings} />
      <Route path="/admin/seo" component={SEOManagement} />
      <Route path="/admin/analytics" component={Analytics} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GoogleReCaptchaProvider
          reCaptchaKey="6LfZW-4rAAAAAGDdo-bEElPM0PJ6PYGnsFYCo5Ly"
          language="tr"
          scriptProps={{
            async: true,
            defer: true,
            appendTo: 'head',
          }}
        >
          <TooltipProvider>
            <AnalyticsLoader />
            <Toaster />
            <Router />
          </TooltipProvider>
        </GoogleReCaptchaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
