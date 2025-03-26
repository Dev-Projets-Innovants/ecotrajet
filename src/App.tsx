
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
import TutorialVideos from "./pages/TutorialVideos";
import ShareExperience from "./pages/ShareExperience";
import Rewards from "./pages/Rewards";
import AdminSignIn from "./pages/admin/AdminSignIn";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminChallenges from "./pages/admin/AdminChallenges";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminNotifications from "./pages/admin/AdminNotifications";
import CarbonCalculator from "./pages/CarbonCalculator";
import Community from "./pages/Community";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import MapView from "./pages/MapView";

// New pages
import Statistics from "./pages/Statistics";
import TripPlanner from "./pages/TripPlanner";
import Challenges from "./pages/Challenges";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/guide/article/:id" element={<ArticleDetail />} />
            <Route path="/guide/tutorials" element={<TutorialVideos />} />
            <Route path="/guide/share-experience" element={<ShareExperience />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/carbon-calculator" element={<CarbonCalculator />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/map" element={<MapView />} />
            
            {/* New routes */}
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/trip-planner" element={<TripPlanner />} />
            <Route path="/challenges" element={<Challenges />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminSignIn />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/challenges" element={<AdminChallenges />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
