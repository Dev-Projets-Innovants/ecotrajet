
import React, { useState, useRef } from 'react';
import { Layout } from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
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
  FileText,
  Camera,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const UserProfile = () => {
  const { profile, user, isLoading, isEditing, setIsEditing, updateProfile } = useUserProfile();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    city: '',
    bio: '',
  });

  // Synchroniser les données du profil avec le formulaire
  React.useEffect(() => {
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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Créer un nom de fichier unique avec le bon format pour les politiques RLS
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Mettre à jour le profil avec la nouvelle URL d'avatar
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
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const getFullName = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Utilisateur';
  };

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
        {/* Header avec avatar */}
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
        </div>

        {/* Carte principale du profil */}
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

        {/* Informations du compte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/signin'}
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                size="sm"
              >
                <LogOut className="h-3 w-3 mr-2" />
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
