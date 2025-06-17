
import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/services/auth/authService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminProfileHeaderProps {
  profile: UserProfile;
  user: User;
  updateProfile: (updates: Partial<UserProfile>) => Promise<any>;
}

export const AdminProfileHeader: React.FC<AdminProfileHeaderProps> = ({
  profile,
  user,
  updateProfile
}) => {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
      
      toast.success('Avatar mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error('Erreur lors de l\'upload de l\'avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const getInitials = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'A';
  };

  const getFullName = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Administrateur';
  };

  return (
    <div className="text-center mb-6">
      <div className="relative inline-block">
        <Avatar className="h-20 w-20 mx-auto mb-3">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="bg-eco-green text-white text-lg">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          variant="outline"
          className="absolute bottom-3 right-0 rounded-full w-7 h-7"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingAvatar}
        >
          {isUploadingAvatar ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-eco-green"></div>
          ) : (
            <Camera className="h-3 w-3" />
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{getFullName()}</h1>
      <p className="text-gray-600 text-sm">{profile.email}</p>
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
        Administrateur
      </span>
    </div>
  );
};
