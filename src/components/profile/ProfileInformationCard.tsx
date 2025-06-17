
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Edit,
  Save,
  X,
  User,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';
import { UserProfile } from '@/services/auth/authService';

interface ProfileInformationCardProps {
  profile: UserProfile;
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<any>;
}

export const ProfileInformationCard: React.FC<ProfileInformationCardProps> = ({
  profile,
  isLoading,
  isEditing,
  setIsEditing,
  updateProfile
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    city: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        city: profile.city || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    await updateProfile(formData);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        city: profile.city || '',
        bio: profile.bio || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Informations personnelles</CardTitle>
            <CardDescription className="text-sm">
              Gérez vos informations de profil
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-eco-green hover:bg-eco-dark-green"
              size="sm"
            >
              <Edit className="h-3 w-3 mr-2" />
              Modifier
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name" className="text-sm">Prénom</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Votre prénom"
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="last_name" className="text-sm">Nom</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Votre nom"
                  className="text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city" className="text-sm">Ville</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Votre ville"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Parlez-nous de vous..."
                rows={2}
                className="text-sm"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                size="sm"
              >
                <X className="h-3 w-3 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-eco-green hover:bg-eco-dark-green"
                size="sm"
              >
                <Save className="h-3 w-3 mr-2" />
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-eco-green" />
                <div>
                  <p className="font-medium text-sm">Prénom</p>
                  <p className="text-gray-600 text-sm">{profile.first_name || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-eco-green" />
                <div>
                  <p className="font-medium text-sm">Nom</p>
                  <p className="text-gray-600 text-sm">{profile.last_name || 'Non renseigné'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-4 w-4 text-eco-green" />
              <div>
                <p className="font-medium text-sm">Email</p>
                <p className="text-gray-600 text-sm">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-4 w-4 text-eco-green" />
              <div>
                <p className="font-medium text-sm">Ville</p>
                <p className="text-gray-600 text-sm">{profile.city || 'Non renseignée'}</p>
              </div>
            </div>

            {profile.bio && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-4 w-4 text-eco-green mt-1" />
                <div>
                  <p className="font-medium text-sm">Bio</p>
                  <p className="text-gray-600 text-sm">{profile.bio}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
