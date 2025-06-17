
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfile } from '@/services/auth/authService';

interface ProfileAccountInfoProps {
  profile: UserProfile;
}

export const ProfileAccountInfo: React.FC<ProfileAccountInfoProps> = ({ profile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Informations du compte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-xs font-medium text-gray-600">Membre depuis</p>
          <p className="text-gray-900 text-sm">
            {new Date(profile.created_at).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600">Dernière mise à jour</p>
          <p className="text-gray-900 text-sm">
            {new Date(profile.updated_at).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        {profile.is_admin && (
          <div className="pt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Administrateur
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
