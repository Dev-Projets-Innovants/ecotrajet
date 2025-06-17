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
  Camera,
  Calendar,
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
        <div className="min-h-screen bg-gradient-to-br from-eco-light-green to-eco-light-blue flex items-center justify-center">
          <Card className="w-full max-w-md mx-4 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green"></div>
                <p className="ml-3 text-lg">Chargement du profil...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profil Utilisateur">
      <div className="min-h-screen bg-gradient-to-br from-eco-light-green via-white to-eco-light-blue">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-eco-green to-eco-blue text-white py-16">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="inline-block relative mb-6">
                <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-white text-eco-green text-3xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-white text-eco-green hover:bg-gray-100 shadow-lg"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
              <h1 className="text-4xl font-bold mb-2">{getFullName()}</h1>
              <div className="flex items-center justify-center gap-2 text-green-100">
                <Calendar className="h-4 w-4" />
                <span>Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container max-w-4xl mx-auto px-4 -mt-8 relative z-10">
          <div className="grid gap-6 md:grid-cols-12">
            {/* Main Profile Card */}
            <div className="md:col-span-8">
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-gray-800">Informations personnelles</CardTitle>
                      <CardDescription className="text-gray-600">
                        Gérez vos informations de profil
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-eco-green hover:bg-eco-dark-green text-white shadow-lg"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="first_name" className="text-sm font-semibold text-gray-700">
                            Prénom
                          </Label>
                          <Input
                            id="first_name"
                            value={formData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            placeholder="Votre prénom"
                            className="h-12 border-2 border-gray-200 focus:border-eco-green transition-colors"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="last_name" className="text-sm font-semibold text-gray-700">
                            Nom de famille
                          </Label>
                          <Input
                            id="last_name"
                            value={formData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            placeholder="Votre nom"
                            className="h-12 border-2 border-gray-200 focus:border-eco-green transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                          Adresse email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          disabled
                          className="h-12 bg-gray-50 border-2 border-gray-200 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 italic">
                          L'adresse email ne peut pas être modifiée
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                          Ville
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Votre ville"
                          className="h-12 border-2 border-gray-200 focus:border-eco-green transition-colors"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">
                          À propos de moi
                        </Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Parlez-nous de vous, vos passions, vos objectifs écologiques..."
                          rows={4}
                          className="border-2 border-gray-200 focus:border-eco-green transition-colors resize-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <User className="h-5 w-5 text-eco-green mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800">Nom complet</p>
                            <p className="text-gray-600 mt-1">{getFullName()}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <Mail className="h-5 w-5 text-eco-green mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800">Email</p>
                            <p className="text-gray-600 mt-1">{profile.email}</p>
                          </div>
                        </div>
                      </div>

                      {profile.city && (
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <MapPin className="h-5 w-5 text-eco-green mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800">Localisation</p>
                            <p className="text-gray-600 mt-1">{profile.city}</p>
                          </div>
                        </div>
                      )}

                      {profile.bio && (
                        <div className="p-4 bg-gradient-to-br from-eco-light-green to-eco-light-blue rounded-lg">
                          <p className="font-semibold text-gray-800 mb-3">À propos de moi</p>
                          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                        </div>
                      )}

                      {!profile.city && !profile.bio && (
                        <div className="text-center py-8">
                          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
                            <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 mb-2">Votre profil semble incomplet</p>
                            <p className="text-sm text-gray-400">
                              Ajoutez votre ville et une biographie pour personnaliser votre profil
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>

                {isEditing && (
                  <CardFooter className="bg-gray-50 border-t p-6">
                    <div className="flex gap-3 w-full">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1 h-12 border-2 hover:bg-gray-100"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 h-12 bg-eco-green hover:bg-eco-dark-green text-white shadow-lg"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </div>

            {/* Sidebar Cards */}
            <div className="md:col-span-4 space-y-6">
              {/* Admin Badge */}
              {profile.is_admin && (
                <Card className="shadow-lg border-0 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-gray-800">Administrateur</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Vous avez des privilèges administrateur sur la plateforme
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full h-12 bg-eco-green hover:bg-eco-dark-green text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier le profil
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Completion */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Profil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion</span>
                      <span className="font-semibold text-eco-green">
                        {Math.round(((profile.first_name ? 1 : 0) + 
                                   (profile.last_name ? 1 : 0) + 
                                   (profile.city ? 1 : 0) + 
                                   (profile.bio ? 1 : 0)) / 4 * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-eco-green to-eco-blue h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.round(((profile.first_name ? 1 : 0) + 
                                               (profile.last_name ? 1 : 0) + 
                                               (profile.city ? 1 : 0) + 
                                               (profile.bio ? 1 : 0)) / 4 * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Complétez votre profil pour une meilleure expérience
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
