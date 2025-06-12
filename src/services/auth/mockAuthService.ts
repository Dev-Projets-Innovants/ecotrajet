
// Helper functions for real Supabase authentication
import { useAuth } from "@/hooks/useAuth";

export const isUserAuthenticated = (): boolean => {
  // Check if we're in a React context, otherwise fall back to checking if user exists
  try {
    const { user } = useAuth();
    return !!user;
  } catch {
    // Fallback for non-React contexts
    return false;
  }
};

export const getCurrentUserIdentifier = (): string => {
  try {
    const { user } = useAuth();
    if (!user) {
      // Generate a fallback identifier for anonymous users
      let anonymousId = localStorage.getItem('anonymousUserId');
      if (!anonymousId) {
        anonymousId = 'anonymous-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('anonymousUserId', anonymousId);
      }
      return anonymousId;
    }
    
    // Use the user ID as the unique identifier
    return user.id;
  } catch {
    // Fallback for non-React contexts
    let anonymousId = localStorage.getItem('anonymousUserId');
    if (!anonymousId) {
      anonymousId = 'anonymous-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('anonymousUserId', anonymousId);
    }
    return anonymousId;
  }
};

export const getCurrentUserId = (): string => {
  // Maintain compatibility for existing code
  return getCurrentUserIdentifier();
};

export const getCurrentUserEmail = (): string | null => {
  try {
    const { user } = useAuth();
    return user?.email || null;
  } catch {
    // Fallback for non-React contexts
    return null;
  }
};
