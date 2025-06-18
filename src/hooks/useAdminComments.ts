
import { useState, useEffect } from 'react';
import { commentsModerationService, AdminForumComment } from '@/services/admin/commentsModerationService';
import { toast } from '@/hooks/use-toast';

interface ModerationFilters {
  status: 'all' | 'pending' | 'approved' | 'rejected';
  search: string;
}

export const useAdminComments = () => {
  const [comments, setComments] = useState<AdminForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ModerationFilters>({
    status: 'all',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentsModerationService.getAllComments(filters);
      setComments(data as AdminForumComment[]);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commentaires",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await commentsModerationService.getModerationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchStats();
  }, [filters]);

  const approveComment = async (commentId: string) => {
    try {
      await commentsModerationService.approveComment(commentId);
      toast({
        title: "Commentaire approuvé",
        description: "Le commentaire a été approuvé avec succès",
      });
      fetchComments();
      fetchStats();
    } catch (error) {
      console.error('Error approving comment:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'approuver le commentaire",
        variant: "destructive",
      });
    }
  };

  const rejectComment = async (commentId: string) => {
    try {
      await commentsModerationService.rejectComment(commentId);
      toast({
        title: "Commentaire rejeté",
        description: "Le commentaire a été rejeté",
      });
      fetchComments();
      fetchStats();
    } catch (error) {
      console.error('Error rejecting comment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter le commentaire",
        variant: "destructive",
      });
    }
  };

  const updateFilters = (newFilters: Partial<ModerationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    comments,
    loading,
    filters,
    stats,
    updateFilters,
    approveComment,
    rejectComment,
    refetch: () => {
      fetchComments();
      fetchStats();
    }
  };
};
