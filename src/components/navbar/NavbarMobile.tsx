
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Award, 
  Settings, 
  Calculator, 
  Users, 
  User, 
  Bell, 
  X, 
  Menu 
} from 'lucide-react';
import NavLink from './NavLink';

interface NavbarMobileProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  isAuthenticated: boolean;
  handleMapClick: (e: React.MouseEvent) => void;
  handleDashboardClick: (e: React.MouseEvent) => void;
  handleCommunityClick: (e: React.MouseEvent) => void;
  handleRewardsClick: (e: React.MouseEvent) => void;
  handleProfileClick: (e: React.MouseEvent) => void;
  handleNotificationsClick: (e: React.MouseEvent) => void;
}

const NavbarMobile = ({
  mobileMenuOpen,
  toggleMobileMenu,
  isAuthenticated,
  handleMapClick,
  handleDashboardClick,
  handleCommunityClick,
  handleRewardsClick,
  handleProfileClick,
  handleNotificationsClick
}: NavbarMobileProps) => {
  return (
    <>
      <button 
        className="md:hidden flex items-center text-gray-700" 
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      <div 
        className={`fixed inset-0 bg-white z-40 pt-20 px-6 md:hidden transition-all duration-300 ease-in-out transform ${
          mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex flex-col space-y-6 items-center text-center">
          <NavLink 
            to="#map" 
            isAnchor
            className="text-lg py-2 w-full border-b border-gray-100 hover:text-eco-green" 
            onClick={(e) => {
              toggleMobileMenu();
              handleMapClick(e);
            }}
          >
            Carte
          </NavLink>
          <NavLink 
            to="#dashboard" 
            isAnchor
            className="text-lg py-2 w-full border-b border-gray-100 hover:text-eco-green" 
            onClick={(e) => {
              toggleMobileMenu();
              handleDashboardClick(e);
            }}
          >
            Tableau de bord
          </NavLink>
          <NavLink 
            to="/guide" 
            className="text-lg py-2 w-full border-b border-gray-100 hover:text-eco-green flex items-center justify-center gap-2" 
            onClick={toggleMobileMenu}
          >
            <BookOpen className="h-5 w-5" />
            Guide
          </NavLink>
          <NavLink 
            to="/carbon-calculator" 
            className="text-lg py-2 w-full border-b border-gray-100 hover:text-eco-green flex items-center justify-center gap-2" 
            onClick={toggleMobileMenu}
          >
            <Calculator className="h-5 w-5" />
            Calculateur
          </NavLink>
          <NavLink 
            to="/community" 
            className="text-lg py-2 w-full border-b border-gray-100 hover:text-eco-green flex items-center justify-center gap-2" 
            onClick={(e) => {
              toggleMobileMenu();
              handleCommunityClick(e);
            }}
          >
            <Users className="h-5 w-5" />
            Communauté
          </NavLink>
          <NavLink 
            to="/rewards" 
            className="text-lg py-2 w-full border-b border-gray-100 hover:text-eco-green flex items-center justify-center gap-2" 
            onClick={(e) => {
              toggleMobileMenu();
              handleRewardsClick(e);
            }}
          >
            <Award className="h-5 w-5" />
            Récompenses
          </NavLink>
          <NavLink 
            to="/profile" 
            className="text-lg py-2 w-full border-b border-gray-100 hover:text-eco-green flex items-center justify-center gap-2" 
            onClick={(e) => {
              toggleMobileMenu();
              handleProfileClick(e);
            }}
          >
            <User className="h-5 w-5" />
            Profil
          </NavLink>
          <NavLink 
            to="/notifications" 
            className="text-lg py-2 w-full border-b border-gray-100 hover:text-eco-green flex items-center justify-center gap-2" 
            onClick={(e) => {
              toggleMobileMenu();
              handleNotificationsClick(e);
            }}
          >
            <Bell className="h-5 w-5" />
            Notifications
          </NavLink>
          <NavLink 
            to="/admin" 
            className="text-lg py-2 w-full border-b border-gray-100 hover:text-eco-green flex items-center justify-center gap-2" 
            onClick={toggleMobileMenu}
          >
            <Settings className="h-5 w-5" />
            Admin
          </NavLink>
          
          <div className="flex flex-col w-full space-y-3 pt-4">
            <NavLink to="/signin" onClick={toggleMobileMenu}>
              <Button variant="ghost" className="w-full py-2 rounded-full hover:bg-eco-light-green hover:text-eco-green">
                Connexion
              </Button>
            </NavLink>
            <NavLink to="/signup" onClick={toggleMobileMenu}>
              <Button className="w-full py-2 rounded-full bg-eco-green hover:bg-eco-dark-green text-white">
                Inscription
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarMobile;
