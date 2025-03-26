
import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Calendar, Trophy, Clock, Edit, Trash2, Award } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Challenge, Badge as BadgeType } from "@/types/rewards";

// Mock challenges data
const CHALLENGES: Challenge[] = [
  {
    id: "ch1",
    title: "Première semaine verte",
    description: "Utilisez des moyens de transport écologiques pendant une semaine complète.",
    type: "weekly",
    points: 500,
    progress: 0,
    goal: 7,
    deadline: "25/07/2023",
    completed: false,
    icon: "leaf"
  },
  {
    id: "ch2",
    title: "Économiseur de CO2",
    description: "Économisez 50kg de CO2 en un mois en choisissant des alternatives écologiques.",
    type: "monthly",
    points: 1000,
    progress: 0,
    goal: 50,
    deadline: "15/08/2023",
    completed: false,
    icon: "zap"
  },
  {
    id: "ch3",
    title: "Partagez votre trajet",
    description: "Partagez votre trajet écologique sur les réseaux sociaux.",
    type: "daily",
    points: 100,
    progress: 0,
    goal: 1,
    completed: false,
    icon: "share"
  },
  {
    id: "ch4",
    title: "Influenceur vert",
    description: "Convainquez 3 amis de rejoindre l'application.",
    type: "special",
    points: 1500,
    progress: 0,
    goal: 3,
    completed: false,
    icon: "users"
  },
  {
    id: "ch5",
    title: "Marathonien écolo",
    description: "Complétez 30 trajets écologiques en un mois.",
    type: "monthly",
    points: 1200,
    progress: 0,
    goal: 30,
    deadline: "31/07/2023",
    completed: false,
    icon: "route"
  }
];

// Mock badges data
const BADGES: BadgeType[] = [
  {
    id: "b1",
    title: "Premier pas",
    description: "Effectuez votre premier trajet écologique.",
    icon: "footprints",
    category: "debutant",
    condition: "Complétez un trajet écologique",
    obtained: false
  },
  {
    id: "b2",
    title: "Cycliste urbain",
    description: "Complétez 10 trajets à vélo en ville.",
    icon: "bike",
    category: "intermediaire",
    condition: "10 trajets à vélo",
    obtained: false,
    progress: 0
  },
  {
    id: "b3",
    title: "Maître du covoiturage",
    description: "Partagez votre voiture pour 20 trajets.",
    icon: "car",
    category: "expert",
    condition: "20 trajets en covoiturage",
    obtained: false,
    progress: 0
  },
  {
    id: "b4",
    title: "Champion de l'année",
    description: "Soyez dans le top 10 des utilisateurs pendant un mois entier.",
    icon: "crown",
    category: "special",
    condition: "Top 10 pendant 30 jours",
    obtained: false
  },
  {
    id: "b5",
    title: "Ami de la nature",
    description: "Économisez 100kg de CO2 en utilisant l'application.",
    icon: "tree",
    category: "intermediaire",
    condition: "Économiser 100kg de CO2",
    obtained: false,
    progress: 0
  }
];

const AdminChallenges = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('challenges');
  const [newChallengeDialogOpen, setNewChallengeDialogOpen] = useState(false);
  const [newBadgeDialogOpen, setNewBadgeDialogOpen] = useState(false);
  
  // Filtered lists based on search query
  const filteredChallenges = CHALLENGES.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredBadges = BADGES.filter(
    (badge) =>
      badge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteItem = (id: string, type: 'challenge' | 'badge') => {
    // In a real app, this would call an API to delete the item
    toast({
      title: `${type === 'challenge' ? 'Défi' : 'Badge'} supprimé`,
      description: `L'élément a été supprimé avec succès.`
    });
  };

  const handleCreateChallenge = () => {
    // In a real app, this would call an API to create a new challenge
    setNewChallengeDialogOpen(false);
    toast({
      title: "Défi créé",
      description: "Le nouveau défi a été créé avec succès."
    });
  };

  const handleCreateBadge = () => {
    // In a real app, this would call an API to create a new badge
    setNewBadgeDialogOpen(false);
    toast({
      title: "Badge créé",
      description: "Le nouveau badge a été créé avec succès."
    });
  };

  // Helper for challenge type badges
  const getChallengeTypeBadge = (type: string) => {
    switch (type) {
      case 'daily':
        return <Badge className="bg-blue-500">Quotidien</Badge>;
      case 'weekly':
        return <Badge className="bg-green-500">Hebdomadaire</Badge>;
      case 'monthly':
        return <Badge className="bg-purple-500">Mensuel</Badge>;
      case 'special':
        return <Badge className="bg-amber-500">Spécial</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // Helper for badge category badges
  const getBadgeCategoryBadge = (category: string) => {
    switch (category) {
      case 'debutant':
        return <Badge className="bg-green-500">Débutant</Badge>;
      case 'intermediaire':
        return <Badge className="bg-blue-500">Intermédiaire</Badge>;
      case 'expert':
        return <Badge className="bg-purple-500">Expert</Badge>;
      case 'special':
        return <Badge className="bg-amber-500">Spécial</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  return (
    <AdminLayout title="Gestion des défis et récompenses">
      <div className="space-y-6">
        {/* Tabs for rewards types */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Défis
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Badges
            </TabsTrigger>
          </TabsList>
          
          {/* Search and add section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder={`Rechercher un ${activeTab === 'challenges' ? 'défi' : 'badge'}...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog 
              open={activeTab === 'challenges' ? newChallengeDialogOpen : newBadgeDialogOpen} 
              onOpenChange={activeTab === 'challenges' ? setNewChallengeDialogOpen : setNewBadgeDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2 bg-eco-green hover:bg-eco-dark-green">
                  <Plus className="h-4 w-4" />
                  {activeTab === 'challenges' ? 'Nouveau défi' : 'Nouveau badge'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {activeTab === 'challenges' ? 'Créer un nouveau défi' : 'Créer un nouveau badge'}
                  </DialogTitle>
                  <DialogDescription>
                    {activeTab === 'challenges' 
                      ? 'Remplissez les informations pour créer un nouveau défi.' 
                      : 'Remplissez les informations pour créer un nouveau badge.'}
                  </DialogDescription>
                </DialogHeader>
                
                {activeTab === 'challenges' ? (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Titre</label>
                      <Input className="col-span-3" placeholder="Titre du défi" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Description</label>
                      <Textarea className="col-span-3" placeholder="Description du défi" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Type</label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="daily">Quotidien</SelectItem>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                            <SelectItem value="monthly">Mensuel</SelectItem>
                            <SelectItem value="special">Spécial</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Points</label>
                      <Input type="number" className="col-span-3" placeholder="Points attribués" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Objectif</label>
                      <Input type="number" className="col-span-3" placeholder="Objectif à atteindre" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Échéance</label>
                      <Input type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Icône</label>
                      <Input className="col-span-3" placeholder="Nom de l'icône" />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Titre</label>
                      <Input className="col-span-3" placeholder="Titre du badge" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Description</label>
                      <Textarea className="col-span-3" placeholder="Description du badge" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Catégorie</label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="debutant">Débutant</SelectItem>
                            <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                            <SelectItem value="special">Spécial</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Condition</label>
                      <Input className="col-span-3" placeholder="Condition d'obtention" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Icône</label>
                      <Input className="col-span-3" placeholder="Nom de l'icône" />
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => activeTab === 'challenges' 
                      ? setNewChallengeDialogOpen(false) 
                      : setNewBadgeDialogOpen(false)
                    }
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="button"
                    className="bg-eco-green hover:bg-eco-dark-green"
                    onClick={activeTab === 'challenges' ? handleCreateChallenge : handleCreateBadge}
                  >
                    Créer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Challenges Tab */}
          <TabsContent value="challenges" className="mt-6">
            <div className="rounded-md border dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Points</TableHead>
                    <TableHead className="hidden md:table-cell">Objectif</TableHead>
                    <TableHead className="hidden lg:table-cell">Échéance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChallenges.map((challenge) => (
                    <TableRow key={challenge.id}>
                      <TableCell>
                        <div className="font-medium">{challenge.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">{challenge.description}</div>
                      </TableCell>
                      <TableCell>{getChallengeTypeBadge(challenge.type)}</TableCell>
                      <TableCell className="hidden md:table-cell">{challenge.points}</TableCell>
                      <TableCell className="hidden md:table-cell">{challenge.goal}</TableCell>
                      <TableCell className="hidden lg:table-cell">{challenge.deadline || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteItem(challenge.id, 'challenge')}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Badges Tab */}
          <TabsContent value="badges" className="mt-6">
            <div className="rounded-md border dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="hidden md:table-cell">Condition</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBadges.map((badge) => (
                    <TableRow key={badge.id}>
                      <TableCell>
                        <div className="font-medium">{badge.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">{badge.description}</div>
                      </TableCell>
                      <TableCell>{getBadgeCategoryBadge(badge.category)}</TableCell>
                      <TableCell className="hidden md:table-cell">{badge.condition}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteItem(badge.id, 'badge')}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminChallenges;
