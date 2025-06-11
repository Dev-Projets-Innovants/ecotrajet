
// Helper functions for mock authentication
export const isUserAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getCurrentUserId = (): string => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    return 'mock-user-' + Math.random().toString(36).substring(2, 15);
  }
  return 'user-' + btoa(userEmail).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
};

export const getCurrentUserEmail = (): string | null => {
  return localStorage.getItem('userEmail');
};
