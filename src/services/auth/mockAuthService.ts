
// Helper functions for mock authentication
export const isUserAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getCurrentUserId = (): string => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    // Générer un UUID valide pour les utilisateurs sans email
    return crypto.randomUUID();
  }
  
  // Créer un UUID déterministe basé sur l'email
  // On utilise une approche simple pour générer un UUID à partir de l'email
  const emailHash = btoa(userEmail).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
  return `550e8400-e29b-41d4-a716-${emailHash.padEnd(12, '0').substring(0, 12)}`;
};

export const getCurrentUserEmail = (): string | null => {
  return localStorage.getItem('userEmail');
};
