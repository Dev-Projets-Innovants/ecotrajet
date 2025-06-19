
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { initializeUserChallenges } from '@/services/userService';
import { AuthService, UserProfile } from '@/services/auth/authService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user?.id) {
      const userProfile = await AuthService.getUserProfile(user.id);
      setProfile(userProfile);
      if (userProfile) {
        setIsAdmin(userProfile.is_admin);
      }
    }
  };

  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshProfile();
        // Initialiser les défis pour l'utilisateur
        await initializeUserChallenges(session.user.id);
      }
      
      setLoading(false);
    };

    getSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await refreshProfile();
          // Initialiser les défis pour les nouveaux utilisateurs
          if (event === 'SIGNED_IN') {
            await initializeUserChallenges(session.user.id);
          }
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return await AuthService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    return await AuthService.signUp(email, password, firstName, lastName);
  };

  const signOut = async () => {
    const result = await AuthService.signOut();
    if (!result.error) {
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
    }
    return result;
  };

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
