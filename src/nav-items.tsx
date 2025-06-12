
import React from 'react';
import Index from './pages/Index';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MapView from './pages/MapView';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import Rewards from './pages/Rewards';
import Challenges from './pages/Challenges';
import UserProfile from './pages/UserProfile';
import TripPlanner from './pages/TripPlanner';
import CarbonCalculator from './pages/CarbonCalculator';
import VelibAlerts from './pages/VelibAlerts';
import Notifications from './pages/Notifications';
import ShareExperience from './pages/ShareExperience';
import TutorialVideos from './pages/TutorialVideos';
import Guide from './pages/Guide';
import OurStory from './pages/OurStory';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';

export const navItems = [
  {
    to: "/",
    page: <Index />,
  },
  {
    to: "/signin",
    page: <SignIn />,
  },
  {
    to: "/signup", 
    page: <SignUp />,
  },
  {
    to: "/map",
    page: <MapView />,
  },
  {
    to: "/dashboard",
    page: <Dashboard />,
  },
  {
    to: "/community",
    page: <Community />,
  },
  {
    to: "/rewards",
    page: <Rewards />,
  },
  {
    to: "/challenges",
    page: <Challenges />,
  },
  {
    to: "/profile",
    page: <UserProfile />,
  },
  {
    to: "/trip-planner",
    page: <TripPlanner />,
  },
  {
    to: "/carbon-calculator",
    page: <CarbonCalculator />,
  },
  {
    to: "/velib-alerts",
    page: <VelibAlerts />,
  },
  {
    to: "/notifications",
    page: <Notifications />,
  },
  {
    to: "/share-experience",
    page: <ShareExperience />,
  },
  {
    to: "/tutorial-videos",
    page: <TutorialVideos />,
  },
  {
    to: "/guide",
    page: <Guide />,
  },
  {
    to: "/our-story",
    page: <OurStory />,
  },
  {
    to: "/contact",
    page: <Contact />,
  },
  {
    to: "/careers",
    page: <Careers />,
  },
  {
    to: "/legal-notice",
    page: <LegalNotice />,
  },
  {
    to: "/privacy-policy",
    page: <PrivacyPolicy />,
  },
  {
    to: "/terms-of-use",
    page: <TermsOfUse />,
  },
];
