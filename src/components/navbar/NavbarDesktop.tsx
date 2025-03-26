
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Award, 
  Settings, 
  Calculator, 
  Users, 
  User, 
  Bell 
} from 'lucide-react';
import NavLink from './NavLink';

interface NavbarDesktopProps {
  isAuthenticated: boolean;
  handleMapClick: (e: React.MouseEvent) => void;
  handleDashboardClick: (e: React.MouseEvent) => void;
  handleCommunityClick: (e: React.MouseEvent) => void;
  handleRewardsClick: (e: React.MouseEvent) => void;
  handleProfileClick: (e: React.MouseEvent) => void;
  handleNotificationsClick: (e: React.MouseEvent) => void;
}

const NavbarDesktop = ({
  isAuthenticated,
  handleMapClick,
  handleDashboardClick,
  handleCommunityClick,
  handleRewardsClick,
  handleProfileClick,
  handleNotificationsClick
}: NavbarDesktopProps) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <div className="flex items-center space-x-6">
        <NavLink 
          to="#map" 
          isAnchor
          className="text-sm"
          onClick={handleMapClick}
        >
          Carte
        </NavLink>
        <NavLink 
          to="#dashboard" 
          isAnchor
          className="text-sm"
          onClick={handleDashboardClick}
        >
          Tableau de bord
        </NavLink>
        <NavLink to="/guide" className="text-sm flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          Guide
        </NavLink>
        <NavLink to="/carbon-calculator" className="text-sm flex items-center gap-1">
          <Calculator className="h-4 w-4" />
          Calculateur
        </NavLink>
        <NavLink 
          to="/community" 
          className="text-sm flex items-center gap-1"
          onClick={handleCommunityClick}
        >
          <Users className="h-4 w-4" />
          Communauté
        </NavLink>
        <NavLink 
          to="/rewards" 
          className="text-sm flex items-center gap-1"
          onClick={handleRewardsClick}
        >
          <Award className="h-4 w-4" />
          Récompenses
        </NavLink>
        <NavLink to="/admin" className="text-sm flex items-center gap-1">
          <Settings className="h-4 w-4" />
          Admin
        </NavLink>
      </div>
      <div className="flex items-center space-x-3">
        <NavLink 
          to="/notifications"
          onClick={handleNotificationsClick}
        >
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">3</span>
          </Button>
        </NavLink>
        <NavLink 
          to="/profile"
          onClick={handleProfileClick}
        >
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </NavLink>
        <NavLink to="/signin">
          <Button variant="ghost" className="text-sm px-4 py-2 h-9 rounded-full transition-all duration-300 hover:bg-eco-light-green hover:text-eco-green">
            Connexion
          </Button>
        </NavLink>
        <NavLink to="/signup">
          <Button className="text-sm px-4 py-2 h-9 rounded-full bg-eco-green hover:bg-eco-dark-green text-white transition-all duration-300">
            Inscription
          </Button>
        </NavLink>
      </div>
    </div>
  );
};

export default NavbarDesktop;
