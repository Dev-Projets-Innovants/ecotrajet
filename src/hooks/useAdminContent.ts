
import { useState, useEffect } from 'react';
import { contentModerationService, AdminForumPost } from '@/services/admin/contentModerationService';
import { toast } from '@/hooks/use-toast';

interface ModerationFilters {
  status: 'all' | 'pending' | 'approved' | 'rejected';
  search: string;
}

export const useAdminContent = () => {
  const [posts, setPosts] = useState<AdminForumPost[]>([]);
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

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await contentModerationService.getAllPosts(filters);
      setPosts(data as AdminForumPost[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await contentModerationService.getModerationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [filters]);

  const approvePost = async (postId: string) => {
    try {
      await contentModerationService.approvePost(postId);
      toast({
        title: "Post approuvé",
        description: "Le post a été approuvé avec succès",
      });
      fetchPosts();
      fetchStats();
    } catch (error) {
      console.error('Error approving post:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'approuver le post",
        variant: "destructive",
      });
    }
  };

  const rejectPost = async (postId: string) => {
    try {
      await contentModerationService.rejectPost(postId);
      toast({
        title: "Post rejeté",
        description: "Le post a été rejeté",
      });
      fetchPosts();
      fetchStats();
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter le post",
        variant: "destructive",
      });
    }
  };

  const updateFilters = (newFilters: Partial<ModerationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    posts,
    loading,
    filters,
    stats,
    updateFilters,
    approvePost,
    rejectPost,
    refetch: () => {
      fetchPosts();
      fetchStats();
    }
  };
};
