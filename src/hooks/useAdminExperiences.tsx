
import { useState, useEffect } from 'react';
import { userExperiencesService, UserExperience } from '@/services/userExperiencesService';
import { toast } from '@/hooks/use-toast';

export const useAdminExperiences = () => {
  const [experiences, setExperiences] = useState<UserExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<UserExperience[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

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

  const handleUpdate = async (id: string, data: any) => {
    try {
      const { error } = await userExperiencesService.updateExperience(id, data);
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
        fetchExperiences();
        return true;
      }
    } catch (error) {
      console.error('Error updating experience:', error);
    }
    return false;
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await userExperiencesService.deleteExperience(id);
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
        fetchExperiences();
        return true;
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
    return false;
  };

  const getExperienceStats = () => {
    const total = experiences.length;
    const approved = experiences.filter(exp => exp.is_approved === true).length;
    const pending = experiences.filter(exp => exp.is_approved === false).length;
    
    return { total, approved, pending };
  };

  return {
    experiences: filteredExperiences,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    isLoading,
    stats: getExperienceStats(),
    handleApprove,
    handleReject,
    handleUpdate,
    handleDelete,
  };
};
