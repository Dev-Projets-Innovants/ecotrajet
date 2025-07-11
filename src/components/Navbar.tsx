
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Shield } from 'lucide-react';
import { useNavbar } from '@/hooks/useNavbar';
import { useAuth } from '@/hooks/useAuth';
import NavbarLogo from './navbar/NavbarLogo';
import NavbarDesktop from './navbar/NavbarDesktop';
import NavbarMobile from './navbar/NavbarMobile';
import UserAuthDialog from './auth/UserAuthDialog';
import NotificationsSidebar from './notifications/NotificationsSidebar';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const isAuthenticated = !!user;

  const [notificationsSidebarOpen, setNotificationsSidebarOpen] = useState(false);

  const {
    isScrolled,
    mobileMenuOpen,
    authDialogOpen,
    authDialogConfig,
    setAuthDialogOpen,
    toggleMobileMenu,
    handleProfileClick,
    handleRewardsClick,
    handleCommunityClick,
    handleMapClick,
    handleDashboardClick,
    handleStatisticsClick,
    handleChallengesClick
  } = useNavbar(isAuthenticated, isAdmin);

  // Function to handle navigation to admin dashboard
  const handleAdminDashboardClick = () => {
    navigate('/admin/dashboard');
  };

  // Function to handle notifications click
  const handleNotificationsClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setAuthDialogOpen(true);
      return;
    }
    setNotificationsSidebarOpen(true);
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Erreur de déconnexion",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Rediriger vers la page d'accueil après déconnexion
      navigate('/');
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès."
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };

  // Determine if we're on the homepage to apply different text color
  const isHomePage = location.pathname === '/';
  const textColorClass = isHomePage && !isScrolled ? 'text-white' : 'text-foreground';

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 shadow-sm backdrop-blur-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <NavbarLogo textColorClass={textColorClass} />

            <NavbarDesktop 
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              handleMapClick={handleMapClick}
              handleDashboardClick={handleDashboardClick}
              handleCommunityClick={handleCommunityClick}
              handleRewardsClick={handleRewardsClick}
              handleProfileClick={handleProfileClick}
              handleNotificationsClick={handleNotificationsClick}
              handleChallengesClick={handleChallengesClick}
              handleAdminDashboardClick={handleAdminDashboardClick}
              handleLogout={handleLogout}
              textColorClass={textColorClass}
            />

            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleNotificationsClick}
                  className={`relative ${textColorClass}`}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </Button>
              )}

              <NavbarMobile 
                mobileMenuOpen={mobileMenuOpen}
                toggleMobileMenu={toggleMobileMenu}
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
                handleMapClick={handleMapClick}
                handleDashboardClick={handleDashboardClick}
                handleCommunityClick={handleCommunityClick}
                handleRewardsClick={handleRewardsClick}
                handleProfileClick={handleProfileClick}
                handleNotificationsClick={handleNotificationsClick}
                handleChallengesClick={handleChallengesClick}
                handleAdminDashboardClick={handleAdminDashboardClick}
                handleLogout={handleLogout}
                textColorClass={textColorClass}
              />
            </div>
          </div>
        </div>
      </nav>

      <UserAuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
        title={authDialogConfig.title}
        description={authDialogConfig.description}
      />

      <NotificationsSidebar 
        open={notificationsSidebarOpen}
        onOpenChange={setNotificationsSidebarOpen}
      />
    </>
  );
};

export default Navbar;
