
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Guide from "./pages/Guide";
import Contact from "./pages/Contact";
import MapView from "./pages/MapView";
import TripPlanner from "./pages/TripPlanner";
import CarbonCalculator from "./pages/CarbonCalculator";
import Challenges from "./pages/Challenges";
import Rewards from "./pages/Rewards";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import TutorialVideos from "./pages/TutorialVideos";
import ShareExperience from "./pages/ShareExperience";
import OurStory from "./pages/OurStory";
import Careers from "./pages/Careers";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import VelibAlerts from "./pages/VelibAlerts";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import LegalNotice from "./pages/LegalNotice";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminExperiences from "./pages/admin/AdminExperiences";
import AdminChallenges from "./pages/admin/AdminChallenges";
import AdminRewards from "./pages/admin/AdminRewards";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminProfile from "./pages/admin/AdminProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/trip-planner" element={<TripPlanner />} />
          <Route path="/carbon-calculator" element={<CarbonCalculator />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/post/:id" element={<PostDetail />} />
          <Route path="/tutorial-videos" element={<TutorialVideos />} />
          <Route path="/share-experience" element={<ShareExperience />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/velib-alerts" element={<VelibAlerts />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/legal-notice" element={<LegalNotice />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/experiences" element={<AdminExperiences />} />
          <Route path="/admin/challenges" element={<AdminChallenges />} />
          <Route path="/admin/rewards" element={<AdminRewards />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
