
import React from 'react';
import { useNavbar } from '@/hooks/useNavbar';
import NavbarLogo from './navbar/NavbarLogo';
import NavbarDesktop from './navbar/NavbarDesktop';
import NavbarMobile from './navbar/NavbarMobile';
import UserAuthDialog from './auth/UserAuthDialog';

const Navbar = () => {
  // Simulating authentication state - in a real app, this would come from your auth provider
  const isAuthenticated = false;

  const {
    isScrolled,
    mobileMenuOpen,
    authDialogOpen,
    authDialogConfig,
    setAuthDialogOpen,
    toggleMobileMenu,
    handleProfileClick,
    handleNotificationsClick,
    handleRewardsClick,
    handleCommunityClick,
    handleMapClick,
    handleDashboardClick,
    handleTripPlannerClick,
    handleStatisticsClick,
    handleChallengesClick
  } = useNavbar(isAuthenticated);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 shadow-sm backdrop-blur-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <NavbarLogo />

            <NavbarDesktop 
              isAuthenticated={isAuthenticated}
              handleMapClick={handleMapClick}
              handleDashboardClick={handleDashboardClick}
              handleCommunityClick={handleCommunityClick}
              handleRewardsClick={handleRewardsClick}
              handleProfileClick={handleProfileClick}
              handleNotificationsClick={handleNotificationsClick}
              handleTripPlannerClick={handleTripPlannerClick}
              handleStatisticsClick={handleStatisticsClick}
              handleChallengesClick={handleChallengesClick}
            />

            <NavbarMobile 
              mobileMenuOpen={mobileMenuOpen}
              toggleMobileMenu={toggleMobileMenu}
              isAuthenticated={isAuthenticated}
              handleMapClick={handleMapClick}
              handleDashboardClick={handleDashboardClick}
              handleCommunityClick={handleCommunityClick}
              handleRewardsClick={handleRewardsClick}
              handleProfileClick={handleProfileClick}
              handleNotificationsClick={handleNotificationsClick}
              handleTripPlannerClick={handleTripPlannerClick}
              handleStatisticsClick={handleStatisticsClick}
              handleChallengesClick={handleChallengesClick}
            />
          </div>
        </div>
      </nav>

      <UserAuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
        title={authDialogConfig.title}
        description={authDialogConfig.description}
      />
    </>
  );
};

export default Navbar;
