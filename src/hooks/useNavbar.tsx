
import { useState, useEffect } from 'react';

export const useNavbar = (isAuthenticated: boolean) => {
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
    handleDashboardClick
  };
};
