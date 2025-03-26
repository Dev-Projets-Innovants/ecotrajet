
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavbar = (isAuthenticated: boolean) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogConfig, setAuthDialogConfig] = useState({
    title: "Connexion requise",
    description: "Connectez-vous ou inscrivez-vous pour accéder à cette fonctionnalité."
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleProtectedAction = (featureName: string) => {
    if (!isAuthenticated) {
      setAuthDialogConfig({
        title: "Connexion requise",
        description: `Vous devez être connecté pour accéder à ${featureName}.`
      });
      setAuthDialogOpen(true);
      return false;
    }
    return true;
  };

  // Handlers for different navigation items
  const handleProfileClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      handleProtectedAction("votre profil");
    }
  };

  const handleNotificationsClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      handleProtectedAction("vos notifications");
    }
  };

  const handleRewardsClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      handleProtectedAction("vos récompenses");
    }
  };

  const handleCommunityClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      handleProtectedAction("la communauté");
    }
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      handleProtectedAction("la carte");
    }
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      handleProtectedAction("le tableau de bord");
    }
  };

  const handleTripPlannerClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      handleProtectedAction("le planificateur d'itinéraires");
    }
  };

  const handleStatisticsClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      handleProtectedAction("vos statistiques");
    }
  };

  const handleChallengesClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      handleProtectedAction("les défis");
    }
  };

  return {
    isScrolled,
    mobileMenuOpen,
    authDialogOpen,
    authDialogConfig,
    setAuthDialogOpen,
    toggleMobileMenu,
    handleProtectedAction,
    handleProfileClick,
    handleNotificationsClick,
    handleRewardsClick,
    handleCommunityClick,
    handleMapClick,
    handleDashboardClick,
    handleTripPlannerClick,
    handleStatisticsClick,
    handleChallengesClick
  };
};
