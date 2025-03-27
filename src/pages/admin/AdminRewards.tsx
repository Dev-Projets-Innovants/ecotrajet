
/**
 * Page d'administration des récompenses
 * 
 * Cette page permet aux administrateurs de gérer l'ensemble des récompenses du système:
 * - Consulter, créer, modifier et supprimer des badges
 * - Gérer les niveaux utilisateurs
 * - Approuver ou rejeter les demandes de badges
 * - Filtrer et rechercher les récompenses
 */

import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Check, X, Edit, Trash2, Award, Medal, Users } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { UserLevel, Badge as BadgeType } from "@/types/rewards";

// Données fictives pour les récompenses
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
  }
];

// Données fictives pour les niveaux utilisateurs
const USER_LEVELS: UserLevel[] = [
  { level: 1, title: "Débutant Écolo", minPoints: 0, maxPoints: 999, icon: "seedling" },
  { level: 2, title: "Éco-Explorateur", minPoints: 1000, maxPoints: 2999, icon: "leaf" },
  { level: 3, title: "Aventurier Vert", minPoints: 3000, maxPoints: 5999, icon: "tree" },
  { level: 4, title: "Champion Écologique", minPoints: 6000, maxPoints: 9999, icon: "forest" },
  { level: 5, title: "Gardien de la Planète", minPoints: 10000, maxPoints: 999999, icon: "earth" }
];

// Données fictives pour les demandes de badges
const BADGE_REQUESTS = [
  { id: 1, userId: 203, userName: "Thomas Martin", badgeId: "b1", badgeName: "Premier pas", requestDate: "15/07/2023", status: "pending" },
  { id: 2, userId: 178, userName: "Sophie Dubois", badgeId: "b3", badgeName: "Maître du covoiturage", requestDate: "14/07/2023", status: "pending" },
  { id: 3, userId: 342, userName: "Lucas Bernard", badgeId: "b2", badgeName: "Cycliste urbain", requestDate: "10/07/2023", status: "approved" }
];

const AdminRewards = () => {
  // États pour gérer les différentes fonctionnalités
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('badges');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  
  // Pagination
  const itemsPerPage = 5;
  const maxPage = Math.ceil((filteredItems.length || 1) / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Effet pour filtrer les éléments selon les critères
  React.useEffect(() => {
    let items: any[] = [];
    
    // Filtrage selon l'onglet actif
    if (activeTab === 'badges') {
      items = BADGES.filter(badge => 
        (selectedCategory === 'all' || badge.category === selectedCategory) &&
        (badge.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        badge.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    } else if (activeTab === 'levels') {
      items = USER_LEVELS.filter(level =>
        level.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeTab === 'requests') {
      items = BADGE_REQUESTS.filter(request =>
        (selectedStatus === 'all' || request.status === selectedStatus) &&
        (request.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.badgeName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredItems(items);
    // Réinitialiser la pagination si nécessaire
    setCurrentPage(1);
  }, [searchQuery, activeTab, selectedCategory, selectedStatus]);

  // Fonction pour obtenir le badge de catégorie
  const getCategoryBadge = (category: string) => {
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

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Fonctions CRUD
  const handleAddItem = () => {
    toast({
      title: "Élément ajouté",
      description: "Le nouvel élément a été ajouté avec succès."
    });
    setIsAddDialogOpen(false);
  };

  const handleEditItem = () => {
    toast({
      title: "Élément modifié",
      description: "L'élément a été modifié avec succès."
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteItem = () => {
    toast({
      title: "Élément supprimé",
      description: "L'élément a été supprimé avec succès."
    });
    setIsDeleteDialogOpen(false);
  };

  const handleApproveRequest = (id: number) => {
    toast({
      title: "Demande approuvée",
      description: "La demande de badge a été approuvée."
    });
  };

  const handleRejectRequest = (id: number) => {
    toast({
      title: "Demande rejetée",
      description: "La demande de badge a été rejetée."
    });
  };

  return (
    <AdminLayout title="Gestion des récompenses">
      <div className="space-y-6">
        {/* Onglets pour les différentes sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="levels" className="flex items-center gap-2">
              <Medal className="h-4 w-4" />
              Niveaux
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Demandes
            </TabsTrigger>
          </TabsList>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder={`Rechercher...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {activeTab === 'badges' && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                  <SelectItem value="special">Spécial</SelectItem>
                </SelectContent>
              </Select>
            )}

            {activeTab === 'requests' && (
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-eco-green hover:bg-eco-dark-green">
                  <Plus className="h-4 w-4" />
                  {activeTab === 'badges' ? 'Nouveau badge' : activeTab === 'levels' ? 'Nouveau niveau' : 'Nouvelle demande'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {activeTab === 'badges' ? 'Ajouter un badge' : activeTab === 'levels' ? 'Ajouter un niveau' : 'Ajouter une demande'}
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez le formulaire pour ajouter un nouvel élément.
                  </DialogDescription>
                </DialogHeader>
                
                {/* Formulaire d'ajout selon l'onglet actif */}
                {activeTab === 'badges' && (
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
                          <SelectItem value="debutant">Débutant</SelectItem>
                          <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                          <SelectItem value="special">Spécial</SelectItem>
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

                {activeTab === 'levels' && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Niveau</label>
                      <Input type="number" className="col-span-3" placeholder="Numéro du niveau" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Titre</label>
                      <Input className="col-span-3" placeholder="Titre du niveau" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Points Min</label>
                      <Input type="number" className="col-span-3" placeholder="Points minimum" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Points Max</label>
                      <Input type="number" className="col-span-3" placeholder="Points maximum" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Icône</label>
                      <Input className="col-span-3" placeholder="Nom de l'icône" />
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddItem} className="bg-eco-green hover:bg-eco-dark-green">
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Contenu des onglets */}
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
                  {paginatedItems.map((badge: BadgeType) => (
                    <TableRow key={badge.id}>
                      <TableCell>
                        <div className="font-medium">{badge.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">{badge.description}</div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(badge.category)}</TableCell>
                      <TableCell className="hidden md:table-cell">{badge.condition}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedItem(badge);
                              setIsEditDialogOpen(true);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedItem(badge);
                                setIsDeleteDialogOpen(true);
                              }}
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

          <TabsContent value="levels" className="mt-6">
            <div className="rounded-md border dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Points requis</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((level: UserLevel) => (
                    <TableRow key={level.level}>
                      <TableCell>{level.level}</TableCell>
                      <TableCell>
                        <div className="font-medium">{level.title}</div>
                      </TableCell>
                      <TableCell>{level.minPoints} - {level.maxPoints}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedItem(level);
                              setIsEditDialogOpen(true);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedItem(level);
                                setIsDeleteDialogOpen(true);
                              }}
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

          <TabsContent value="requests" className="mt-6">
            <div className="rounded-md border dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((request: any) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.userName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">ID: {request.userId}</div>
                      </TableCell>
                      <TableCell>{request.badgeName}</TableCell>
                      <TableCell className="hidden md:table-cell">{request.requestDate}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        {request.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600 border-green-600 hover:bg-green-50" 
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approuver
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        ) : (
                          <Badge variant="outline">
                            {request.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de {paginatedItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} à {Math.min(currentPage * itemsPerPage, filteredItems.length)} sur {filteredItems.length} éléments
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, maxPage))}
              disabled={currentPage === maxPage}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs pour édition et suppression */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier {activeTab === 'badges' ? 'le badge' : 'le niveau'}</DialogTitle>
            <DialogDescription>
              Modifiez les informations ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && activeTab === 'badges' && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Titre</label>
                <Input className="col-span-3" defaultValue={selectedItem.title} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Description</label>
                <Textarea className="col-span-3" defaultValue={selectedItem.description} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Catégorie</label>
                <Select defaultValue={selectedItem.category}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debutant">Débutant</SelectItem>
                    <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                    <SelectItem value="special">Spécial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Condition</label>
                <Input className="col-span-3" defaultValue={selectedItem.condition} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Icône</label>
                <Input className="col-span-3" defaultValue={selectedItem.icon} />
              </div>
            </div>
          )}

          {selectedItem && activeTab === 'levels' && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Niveau</label>
                <Input type="number" className="col-span-3" defaultValue={selectedItem.level} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Titre</label>
                <Input className="col-span-3" defaultValue={selectedItem.title} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Points Min</label>
                <Input type="number" className="col-span-3" defaultValue={selectedItem.minPoints} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Points Max</label>
                <Input type="number" className="col-span-3" defaultValue={selectedItem.maxPoints} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Icône</label>
                <Input className="col-span-3" defaultValue={selectedItem.icon} />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditItem} className="bg-eco-green hover:bg-eco-dark-green">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminRewards;
