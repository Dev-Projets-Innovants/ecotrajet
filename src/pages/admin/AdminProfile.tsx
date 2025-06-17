
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AdminProfileHeader } from '@/components/admin/profile/AdminProfileHeader';
import { AdminProfileForm } from '@/components/admin/profile/AdminProfileForm';
import { AdminProfileAccountInfo } from '@/components/admin/profile/AdminProfileAccountInfo';

const AdminProfile = () => {
  const { profile, user, isLoading, isEditing, setIsEditing, updateProfile } = useUserProfile();

  if (isLoading) {
    return (
      <AdminLayout title="Mon Profil">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-eco-green"></div>
          <p className="ml-3 text-base">Chargement...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!profile) {
    return (
      <AdminLayout title="Mon Profil">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Profil non trouvé</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Mon Profil">
      <div className="max-w-4xl mx-auto space-y-6">
        <AdminProfileHeader 
          profile={profile} 
          user={user!} 
          updateProfile={updateProfile} 
        />

        <AdminProfileForm
          profile={profile}
          isLoading={isLoading}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          updateProfile={updateProfile}
        />

        <AdminProfileAccountInfo profile={profile} />
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
