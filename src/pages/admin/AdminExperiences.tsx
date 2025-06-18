
import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Eye, Edit, Trash2, Star } from 'lucide-react';
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
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { userExperiencesService, UserExperience } from '@/services/userExperiencesService';

const AdminExperiences = () => {
  const [experiences, setExperiences] = useState<UserExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<UserExperience[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<UserExperience | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: '',
    experience_text: '',
    rating: 5,
    category: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    filterExperiences();
  }, [experiences, searchQuery, activeTab]);

  const fetchExperiences = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await userExperiencesService.getAllExperiences();
      if (error) {
        console.error('Error fetching experiences:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les expériences",
          variant: "destructive",
        });
      } else if (data) {
        setExperiences(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterExperiences = () => {
    let filtered = experiences;

    // Filter by status
    if (activeTab !== 'all') {
      if (activeTab === 'pending') {
        filtered = filtered.filter(exp => exp.is_approved === false);
      } else if (activeTab === 'approved') {
        filtered = filtered.filter(exp => exp.is_approved === true);
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(exp =>
        exp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.experience_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExperiences(filtered);
  };

  const handleViewExperience = (experience: UserExperience) => {
    setSelectedExperience(experience);
    setIsViewDialogOpen(true);
  };

  const handleEditExperience = (experience: UserExperience) => {
    setSelectedExperience(experience);
    setEditForm({
      name: experience.name || '',
      experience_text: experience.experience_text,
      rating: experience.rating,
      category: experience.category
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteExperience = (experience: UserExperience) => {
    setSelectedExperience(experience);
    setIsDeleteDialogOpen(true);
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await userExperiencesService.approveExperience(id);
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'approuver l'expérience",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Expérience approuvée avec succès",
        });
        fetchExperiences();
      }
    } catch (error) {
      console.error('Error approving experience:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await userExperiencesService.rejectExperience(id);
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de rejeter l'expérience",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Expérience rejetée",
        });
        fetchExperiences();
      }
    } catch (error) {
      console.error('Error rejecting experience:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedExperience) return;

    try {
      const { error } = await userExperiencesService.updateExperience(selectedExperience.id, editForm);
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de modifier l'expérience",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Expérience modifiée avec succès",
        });
        setIsEditDialogOpen(false);
        fetchExperiences();
      }
    } catch (error) {
      console.error('Error updating experience:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedExperience) return;

    try {
      const { error } = await userExperiencesService.deleteExperience(selectedExperience.id);
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'expérience",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Expérience supprimée avec succès",
        });
        setIsDeleteDialogOpen(false);
        fetchExperiences();
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const getStatusBadge = (isApproved: boolean) => {
    return isApproved ? (
      <Badge className="bg-green-500 hover:bg-green-600">Approuvé</Badge>
    ) : (
      <Badge className="bg-amber-500 hover:bg-amber-600">En attente</Badge>
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getExperienceStats = () => {
    const total = experiences.length;
    const approved = experiences.filter(exp => exp.is_approved === true).length;
    const pending = experiences.filter(exp => exp.is_approved === false).length;
    
    return { total, approved, pending };
  };

  const stats = getExperienceStats();

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des expériences">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des expériences">
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Total</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Approuvées</h3>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">En attente</h3>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
        </div>

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approuvées ({stats.approved})</TabsTrigger>
          </TabsList>
          
          {/* Search and filter section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher une expérience..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
          </div>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Expérience</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExperiences.map((experience) => (
                    <TableRow key={experience.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {experience.name || 'Anonyme'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {experience.user_id?.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="truncate">
                            {experience.experience_text.substring(0, 100)}
                            {experience.experience_text.length > 100 && '...'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {renderStars(experience.rating)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{experience.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(experience.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{getStatusBadge(experience.is_approved)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewExperience(experience)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditExperience(experience)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!experience.is_approved && (
                              <DropdownMenuItem 
                                onClick={() => handleApprove(experience.id)}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approuver
                              </DropdownMenuItem>
                            )}
                            {experience.is_approved && (
                              <DropdownMenuItem 
                                onClick={() => handleReject(experience.id)}
                                className="text-amber-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Rejeter
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteExperience(experience)}
                              className="text-red-600"
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de l'expérience</DialogTitle>
            <DialogDescription>
              Soumis par {selectedExperience?.name || 'Anonyme'} le{' '}
              {selectedExperience && new Date(selectedExperience.created_at).toLocaleDateString('fr-FR')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Note</h4>
              <div className="flex items-center gap-1">
                {selectedExperience && renderStars(selectedExperience.rating)}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Catégorie</h4>
              <Badge variant="outline">{selectedExperience?.category}</Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Expérience</h4>
              <Textarea 
                readOnly 
                value={selectedExperience?.experience_text || ''} 
                className="min-h-[100px] bg-gray-50"
              />
            </div>
            {selectedExperience?.image_url && (
              <div>
                <h4 className="font-medium mb-2">Image</h4>
                <img 
                  src={selectedExperience.image_url} 
                  alt="Experience" 
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l'expérience</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nom de l'auteur"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Catégorie</label>
              <Input
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                placeholder="Catégorie"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Note</label>
              <Input
                type="number"
                min="1"
                max="5"
                value={editForm.rating}
                onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Expérience</label>
              <Textarea
                value={editForm.experience_text}
                onChange={(e) => setEditForm({ ...editForm, experience_text: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette expérience ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminExperiences;
