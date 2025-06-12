
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Helper functions for authentication
export const isUserAuthenticated = (): boolean => {
  // First check Supabase session
  return supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) return true;
    // Fallback to localStorage for admin users
    return localStorage.getItem('isAuthenticated') === 'true';
  }).catch(() => {
    // Fallback to localStorage if Supabase fails
    return localStorage.getItem('isAuthenticated') === 'true';
  });
};

export const getCurrentUserIdentifier = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return session.user.id;
    }
    
    // Fallback to localStorage identifier for admin users
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      return userEmail;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user identifier:', error);
    return null;
  }
};

export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

export const getCurrentUserEmail = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email) {
      return session.user.email;
    }
    
    // Fallback to localStorage for admin users
    return localStorage.getItem('userEmail');
  } catch (error) {
    console.error('Error getting user email:', error);
    return localStorage.getItem('userEmail');
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    // Also clear localStorage fallback
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('anonymousUserId');
  } catch (error) {
    console.error('Error signing out:', error);
    // Clear localStorage even if Supabase signout fails
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('anonymousUserId');
  }
};
