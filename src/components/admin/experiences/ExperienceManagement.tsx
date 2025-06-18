
import React, { useState } from 'react';
import ExperienceStatsCards from './ExperienceStatsCards';
import ExperienceTabsHeader from './ExperienceTabsHeader';
import ExperienceTable from './ExperienceTable';
import ExperienceViewDialog from './ExperienceViewDialog';
import ExperienceEditDialog from './ExperienceEditDialog';
import ExperienceDeleteDialog from './ExperienceDeleteDialog';
import { UserExperience } from '@/services/userExperiencesService';
import { useAdminExperiences } from '@/hooks/useAdminExperiences';

const ExperienceManagement = () => {
  const {
    experiences,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    isLoading,
    stats,
    handleApprove,
    handleReject,
    handleUpdate,
    handleDelete,
  } = useAdminExperiences();

  const [selectedExperience, setSelectedExperience] = useState<UserExperience | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    experience_text: '',
    rating: 5,
    category: ''
  });

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

  const handleSaveEdit = async () => {
    if (!selectedExperience) return;
    const success = await handleUpdate(selectedExperience.id, editForm);
    if (success) {
      setIsEditDialogOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedExperience) return;
    const success = await handleDelete(selectedExperience.id);
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green"></div>
      </div>
    );
  }

  return (
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
          experiences={experiences}
          onViewExperience={handleViewExperience}
          onEditExperience={handleEditExperience}
          onDeleteExperience={handleDeleteExperience}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </ExperienceTabsHeader>

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
    </div>
  );
};

export default ExperienceManagement;
