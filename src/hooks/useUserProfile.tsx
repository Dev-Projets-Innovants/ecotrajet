
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthService, UserProfile } from '@/services/auth/authService';
import { toast } from 'sonner';

export function useUserProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour modifier votre profil");
      return { error: 'Not authenticated' };
    }

    setIsLoading(true);
    try {
      const result = await AuthService.updateUserProfile(user.id, updates);
      
      if (result.error) {
        toast.error("Erreur lors de la mise à jour du profil");
        return result;
      }

      toast.success("Profil mis à jour avec succès");
      await refreshProfile();
      setIsEditing(false);
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Une erreur inattendue s'est produite");
      return { error: 'Unexpected error' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    user,
    isLoading,
    isEditing,
    setIsEditing,
    updateProfile,
    refreshProfile
  };
}
