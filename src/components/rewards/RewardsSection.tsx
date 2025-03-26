
import React from "react";
import { User, Palette, Award, Check, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserReward } from "@/types/rewards";

interface RewardsSectionProps {
  userRewards: UserReward;
}

export function RewardsSection({ userRewards }: RewardsSectionProps) {
  const [activeTab, setActiveTab] = React.useState("avatars");
  
  // Génère des URL d'avatar pour les exemples
  const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/personas/svg?seed=${seed}`;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mes Récompenses</h2>
        <p className="text-gray-600">Personnalisez votre expérience avec des récompenses exclusives</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="avatars" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
            <User className="mr-2 h-4 w-4" />
            Avatars
          </TabsTrigger>
          <TabsTrigger value="titles" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
            <Award className="mr-2 h-4 w-4" />
            Titres
          </TabsTrigger>
          <TabsTrigger value="themes" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
            <Palette className="mr-2 h-4 w-4" />
            Thèmes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="avatars" className="mt-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Avatars Exclusifs</CardTitle>
              <CardDescription>Personnalisez votre profil avec des avatars uniques débloqués en progressant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Avatar actuel</div>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-eco-green">
                    <AvatarImage src={getAvatarUrl(userRewards.selectedAvatar)} alt="Avatar actuel" />
                    <AvatarFallback>AV</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{userRewards.selectedAvatar}</div>
                    <p className="text-sm text-muted-foreground">Votre avatar actuel</p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm font-medium mb-4">Avatars disponibles</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {userRewards.availableAvatars.map((avatar, index) => {
                  const isSelected = avatar === userRewards.selectedAvatar;
                  const isAvailable = index < userRewards.currentLevel.level + 2;
                  
                  return (
                    <div 
                      key={avatar} 
                      className={`
                        relative rounded-lg border p-2 flex flex-col items-center
                        ${isSelected ? 'border-eco-green bg-eco-light-green/20' : ''}
                        ${!isAvailable ? 'opacity-60' : ''}
                      `}
                    >
                      <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage src={getAvatarUrl(avatar)} alt={avatar} />
                        <AvatarFallback>{avatar.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium truncate w-full text-center">{avatar}</span>
                      
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-eco-green text-white rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/60">
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      
                      {!isSelected && isAvailable && (
                        <Button size="sm" variant="outline" className="mt-2 text-xs w-full">
                          Utiliser
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Débloquez plus d'avatars en augmentant votre niveau écologique
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="titles" className="mt-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Titres Honorifiques</CardTitle>
              <CardDescription>Affichez fièrement vos accomplissements avec des titres spéciaux</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Titre actuel</div>
                  <div className="flex items-center gap-2 bg-eco-light-green/30 text-eco-green p-3 rounded-lg">
                    <Award className="h-5 w-5" />
                    <span className="font-medium">{userRewards.selectedTitle || "Explorateur Écologique"}</span>
                  </div>
                </div>
                
                <div className="text-sm font-medium mt-4 mb-2">Titres disponibles</div>
                <div className="space-y-2">
                  {userRewards.availableTitles.map((title, index) => {
                    const isSelected = title === userRewards.selectedTitle;
                    const isAvailable = index < userRewards.currentLevel.level + 2;
                    
                    return (
                      <div
                        key={title}
                        className={`
                          border rounded-lg p-3 flex items-center justify-between
                          ${isSelected ? 'border-eco-green bg-eco-light-green/20' : ''}
                          ${!isAvailable ? 'opacity-60' : ''}
                        `}
                      >
                        <div className="flex items-center">
                          <Award className={`h-5 w-5 mr-2 ${isSelected ? 'text-eco-green' : 'text-muted-foreground'}`} />
                          <span className={isSelected ? 'font-medium' : ''}>{title}</span>
                        </div>
                        
                        {isAvailable ? (
                          <Button size="sm" variant={isSelected ? "default" : "outline"} className="text-xs">
                            {isSelected ? "Actif" : "Utiliser"}
                          </Button>
                        ) : (
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Lock className="h-4 w-4 mr-1" />
                            <span>Niveau {index}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="themes" className="mt-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Thèmes d'Interface</CardTitle>
              <CardDescription>Personnalisez l'apparence de votre application avec des thèmes exclusifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userRewards.availableThemes.map((theme, index) => {
                  const isSelected = theme === userRewards.selectedTheme;
                  const isAvailable = index < userRewards.currentLevel.level + 1;
                  
                  // Générer des couleurs de thème pour la démo
                  const getThemeColors = (themeName: string) => {
                    const themes: Record<string, {primary: string, secondary: string, bg: string}> = {
                      "Éco Standard": {primary: "#4CAF50", secondary: "#E8F5E9", bg: "linear-gradient(to right, #E8F5E9, #F9FBE7)"},
                      "Bleu Océan": {primary: "#2196F3", secondary: "#E3F2FD", bg: "linear-gradient(to right, #E3F2FD, #E1F5FE)"},
                      "Soleil Couchant": {primary: "#FF9800", secondary: "#FFF3E0", bg: "linear-gradient(to right, #FFF3E0, #FFFDE7)"},
                      "Forêt Profonde": {primary: "#2E7D32", secondary: "#C8E6C9", bg: "linear-gradient(to right, #C8E6C9, #DCEDC8)"},
                      "Aurore Boréale": {primary: "#673AB7", secondary: "#EDE7F6", bg: "linear-gradient(to right, #EDE7F6, #E1F5FE)"}
                    };
                    return themes[themeName] || themes["Éco Standard"];
                  };
                  
                  const colors = getThemeColors(theme);
                  
                  return (
                    <div
                      key={theme}
                      className={`
                        border rounded-lg overflow-hidden flex flex-col
                        ${isSelected ? 'border-eco-green ring-1 ring-eco-green' : ''}
                        ${!isAvailable ? 'opacity-60' : ''}
                        relative
                      `}
                    >
                      {/* Theme preview */}
                      <div style={{background: colors.bg}} className="h-32 p-3">
                        <div className="text-xs font-medium mb-2 text-gray-700">Aperçu du thème</div>
                        <div className="flex gap-2">
                          <div 
                            style={{backgroundColor: colors.primary}} 
                            className="h-6 w-6 rounded-full"
                          ></div>
                          <div 
                            style={{backgroundColor: colors.secondary}}
                            className="h-6 w-12 rounded-full"
                          ></div>
                        </div>
                        <div className="mt-2 flex gap-1">
                          <div 
                            style={{backgroundColor: colors.primary}}
                            className="h-4 w-16 rounded-sm text-white text-xs flex items-center justify-center"
                          >
                            Bouton
                          </div>
                          <div 
                            style={{backgroundColor: colors.secondary}}
                            className="h-4 w-16 rounded-sm text-xs flex items-center justify-center"
                            
                          >
                            Carte
                          </div>
                        </div>
                      </div>
                      
                      {/* Theme info */}
                      <div className="p-3 bg-white">
                        <div className="font-medium text-sm">{theme}</div>
                        <div className="flex items-center justify-between mt-2">
                          {isAvailable ? (
                            <Button 
                              size="sm" 
                              variant={isSelected ? "default" : "outline"} 
                              className="w-full text-xs"
                              style={isSelected ? {backgroundColor: colors.primary} : {}}
                            >
                              {isSelected ? "Actif" : "Appliquer"}
                            </Button>
                          ) : (
                            <div className="text-xs text-muted-foreground w-full flex items-center justify-center gap-1 py-1">
                              <Lock className="h-3 w-3" />
                              <span>Niveau {index + 2} requis</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                          <Lock className="h-8 w-8 text-foreground/40" />
                        </div>
                      )}
                      
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-eco-green text-white rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
