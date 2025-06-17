
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Edit,
  LogOut,
  User,
  Mail,
  MapPin,
  Save,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile as UserProfileType } from '@/services/auth/authService';

const UserProfile = () => {
  const { signOut } = useAuth();
  const { profile, isLoading, isEditing, setIsEditing, updateProfile } = useUserProfile();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    city: '',
    bio: '',
  });

  // Synchroniser les données du profil avec le formulaire
  React.useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
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
    const updates: Partial<UserProfileType> = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      city: formData.city,
      bio: formData.bio,
    };

    await updateProfile(updates);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        city: profile.city || '',
        bio: profile.bio || '',
      });
    }
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFullName = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Utilisateur';
  };

  if (!profile) {
    return (
      <Layout title="Profil Utilisateur">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">
            <p>Chargement du profil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profil Utilisateur">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-eco-green">Mon Profil</h1>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-eco-green text-white text-xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{getFullName()}</CardTitle>
            <CardDescription>
              Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isEditing ? (
              // Mode édition
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Prénom</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Nom</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-muted-foreground">
                    L'email ne peut pas être modifié
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Votre ville"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Parlez-nous de vous..."
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              // Mode lecture
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Nom complet</p>
                      <p className="text-muted-foreground">{getFullName()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>

                  {profile.city && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Ville</p>
                        <p className="text-muted-foreground">{profile.city}</p>
                      </div>
                    </div>
                  )}

                  {profile.bio && (
                    <div className="space-y-2">
                      <p className="font-medium">À propos de moi</p>
                      <p className="text-muted-foreground">{profile.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {isEditing ? (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 bg-eco-green hover:bg-eco-dark-green"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex-1 text-red-500 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-eco-green hover:bg-eco-dark-green"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le profil
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        {profile.is_admin && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-amber-600">
                <div className="h-2 w-2 bg-amber-600 rounded-full"></div>
                <span className="text-sm font-medium">Administrateur</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;
