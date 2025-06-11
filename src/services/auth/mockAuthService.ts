
// Helper functions for mock authentication
export const isUserAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getCurrentUserIdentifier = (): string => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    // Générer un identifiant unique pour les utilisateurs sans email
    let anonymousId = localStorage.getItem('anonymousUserId');
    if (!anonymousId) {
      anonymousId = 'anonymous-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('anonymousUserId', anonymousId);
    }
    return anonymousId;
  }
  
  // Utiliser l'email comme identifiant unique
  return userEmail;
};

export const getCurrentUserId = (): string => {
  // Maintenir la compatibilité pour le code existant
  return getCurrentUserIdentifier();
};

export const getCurrentUserEmail = (): string | null => {
  return localStorage.getItem('userEmail');
};
