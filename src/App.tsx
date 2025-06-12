
/**
 * Application principale ÉcoTrajet
 * 
 * Ce fichier est le point d'entrée de l'application. Il configure:
 * - Les fournisseurs globaux (QueryClient, TooltipProvider)
 * - Les composants de notification (Toaster)
 * - Le routeur et toutes les routes de l'application
 * 
 * L'application est divisée en sections principales:
 * - Pages publiques accessibles sans authentification
 * - Pages utilisateur nécessitant une authentification
 * - Pages administrateur avec accès restreint
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Guide from "./pages/Guide";
import ArticleDetail from "./pages/ArticleDetail";
import Rewards from "./pages/Rewards";
import AdminSignIn from "./pages/admin/AdminSignIn";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminChallenges from "./pages/admin/AdminChallenges";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminRewards from "./pages/admin/AdminRewards";
import CarbonCalculator from "./pages/CarbonCalculator";
import Community from "./pages/Community";
import UserProfile from "./pages/UserProfile";
import MapView from "./pages/MapView";
import VelibAlerts from "./pages/VelibAlerts";
import OurStory from "./pages/OurStory";

// Pages d'information légale et des fonctionnalités principales
import Challenges from "./pages/Challenges";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalNotice from "./pages/LegalNotice";

// Initialisation du client React Query pour la gestion des requêtes API et du cache
const queryClient = new QueryClient();

/**
 * Composant principal de l'application
 * Définit la structure globale et le routage
 */
function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Composants de notification pour les feedbacks utilisateur */}
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/our-story" element={<OurStory />} />
              
              {/* Routes utilisateur authentifié */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/guide/article/:id" element={<ArticleDetail />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/carbon-calculator" element={<CarbonCalculator />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/velib-alerts" element={<VelibAlerts />} />
              
              {/* Routes pour les fonctionnalités principales */}
              <Route path="/challenges" element={<Challenges />} />
              
              {/* Pages d'information légale */}
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/legal-notice" element={<LegalNotice />} />
              
              {/* Routes d'administration (accès restreint) */}
              <Route path="/admin" element={<AdminSignIn />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/rewards" element={<AdminRewards />} />
              <Route path="/admin/challenges" element={<AdminChallenges />} />
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              
              {/* Route de fallback pour les chemins inexistants */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
