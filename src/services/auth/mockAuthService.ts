
import { supabase } from "@/integrations/supabase/client";

// Helper functions for authentication (with Supabase integration)
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) return true;
    
    // Fallback to localStorage for admin users
    return localStorage.getItem('isAuthenticated') === 'true';
  } catch (error) {
    // Fallback to localStorage if Supabase fails
    return localStorage.getItem('isAuthenticated') === 'true';
  }
};

export const getCurrentUserIdentifier = async (): Promise<string> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return session.user.id;
    }
    
    // Fallback to localStorage identifier
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      let anonymousId = localStorage.getItem('anonymousUserId');
      if (!anonymousId) {
        anonymousId = 'anonymous-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('anonymousUserId', anonymousId);
      }
      return anonymousId;
    }
    
    return userEmail;
  } catch (error) {
    // Fallback to localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      let anonymousId = localStorage.getItem('anonymousUserId');
      if (!anonymousId) {
        anonymousId = 'anonymous-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('anonymousUserId', anonymousId);
      }
      return anonymousId;
    }
    return userEmail;
  }
};

export const getCurrentUserId = async (): Promise<string> => {
  return getCurrentUserIdentifier();
};

export const getCurrentUserEmail = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email) {
      return session.user.email;
    }
    
    return localStorage.getItem('userEmail');
  } catch (error) {
    return localStorage.getItem('userEmail');
  }
};
