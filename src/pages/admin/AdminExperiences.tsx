import React, { useState, useEffect } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import AdminLayout from '@/components/admin/AdminLayout';
import ExperienceStatsCards from '@/components/admin/experiences/ExperienceStatsCards';
import ExperienceTabsHeader from '@/components/admin/experiences/ExperienceTabsHeader';
import ExperienceTable from '@/components/admin/experiences/ExperienceTable';
import ExperienceViewDialog from '@/components/admin/experiences/ExperienceViewDialog';
import ExperienceEditDialog from '@/components/admin/experiences/ExperienceEditDialog';
import ExperienceDeleteDialog from '@/components/admin/experiences/ExperienceDeleteDialog';
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

    if (activeTab !== 'all') {
      if (activeTab === 'pending') {
        filtered = filtered.filter(exp => exp.is_approved === false);
      } else if (activeTab === 'approved') {
        filtered = filtered.filter(exp => exp.is_approved === true);
      }
    }

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
        <ExperienceStatsCards stats={stats} />
        
        <ExperienceTabsHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stats={stats}
        >
          <ExperienceTable
            experiences={filteredExperiences}
            onViewExperience={handleViewExperience}
            onEditExperience={handleEditExperience}
            onDeleteExperience={handleDeleteExperience}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </ExperienceTabsHeader>
      </div>

      <ExperienceViewDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        experience={selectedExperience}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <ExperienceEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        experience={selectedExperience}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleSaveEdit}
      />

      <ExperienceDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default AdminExperiences;
