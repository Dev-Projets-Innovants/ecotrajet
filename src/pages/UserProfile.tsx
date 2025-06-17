
import React from 'react';
import { Layout } from '@/components/Layout';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInformationCard } from '@/components/profile/ProfileInformationCard';
import { ProfileAccountInfo } from '@/components/profile/ProfileAccountInfo';
import { ProfileActions } from '@/components/profile/ProfileActions';

const UserProfile = () => {
  const { profile, user, isLoading, isEditing, setIsEditing, updateProfile } = useUserProfile();

  if (isLoading) {
    return (
      <Layout title="Profil">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-eco-green"></div>
            <p className="ml-3 text-base">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout title="Profil">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Profil non trouvé</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mon Profil">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProfileHeader 
          profile={profile} 
          user={user!} 
          updateProfile={updateProfile} 
        />

        <ProfileInformationCard
          profile={profile}
          isLoading={isLoading}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          updateProfile={updateProfile}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileAccountInfo profile={profile} />
          <ProfileActions />
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
