
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from "@/hooks/use-toast";
import ContentModerationHeader from '@/components/admin/content/ContentModerationHeader';
import ContentViewDialog from '@/components/admin/content/ContentViewDialog';
import PendingItemsAlert from '@/components/admin/content/PendingItemsAlert';
import ModerationStatsCards from '@/components/admin/content/ModerationStatsCards';
import ModerationTabContent from '@/components/admin/content/ModerationTabContent';
import { useAdminContent } from '@/hooks/useAdminContent';
import { useAdminComments } from '@/hooks/useAdminComments';
import { AdminForumPost } from '@/services/admin/contentModerationService';
import { AdminForumComment } from '@/services/admin/commentsModerationService';

const AdminContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  // Hook pour la modération des posts du forum
  const {
    posts: forumPosts,
    loading: forumLoading,
    filters: postFilters,
    stats: postStats,
    updateFilters: updatePostFilters,
    approvePost,
    rejectPost
  } = useAdminContent();

  // Hook pour la modération des commentaires
  const {
    comments: forumComments,
    loading: commentsLoading,
    filters: commentFilters,
    stats: commentStats,
    updateFilters: updateCommentFilters,
    approveComment,
    rejectComment
  } = useAdminComments();

  const handleViewPost = (post: AdminForumPost) => {
    setSelectedItem({ ...post, type: 'forum_post' });
    setItemDialogOpen(true);
  };

  const handleViewComment = (comment: AdminForumComment) => {
    setSelectedItem({ ...comment, type: 'forum_comment' });
    setItemDialogOpen(true);
  };

  const handleModeratePost = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      if (newStatus === 'approved') {
        await approvePost(id);
        toast({
          title: "Post approuvé",
          description: "Le post est maintenant visible publiquement",
        });
      } else {
        await rejectPost(id);
        toast({
          title: "Post rejeté",
          description: "Le post a été rejeté et n'est plus visible",
        });
      }
      setItemDialogOpen(false);
    } catch (error) {
      console.error('Error moderating post:', error);
    }
  };

  const handleModerateComment = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      if (newStatus === 'approved') {
        await approveComment(id);
        toast({
          title: "Commentaire approuvé",
          description: "Le commentaire est maintenant visible",
        });
      } else {
        await rejectComment(id);
        toast({
          title: "Commentaire rejeté", 
          description: "Le commentaire a été rejeté",
        });
      }
      setItemDialogOpen(false);
    } catch (error) {
      console.error('Error moderating comment:', error);
    }
  };

  // Filtrer les posts du forum par recherche
  const filteredForumPosts = forumPosts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      (post.user_name && post.user_name.toLowerCase().includes(query))
    );
  });

  // Filtrer les commentaires par recherche
  const filteredComments = forumComments.filter(comment => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      comment.content.toLowerCase().includes(query) ||
      (comment.user_name && comment.user_name.toLowerCase().includes(query))
    );
  });

  // Déterminer les filtres et stats actuels selon l'onglet
  const currentFilters = activeTab === 'posts' ? postFilters : commentFilters;
  const currentStats = activeTab === 'posts' ? postStats : commentStats;
  const updateCurrentFilters = activeTab === 'posts' ? updatePostFilters : updateCommentFilters;

  // Calcul du nombre d'éléments en attente pour l'alerte
  const pendingCount = postStats.pending + commentStats.pending;

  return (
    <AdminLayout title="Modération des contenus">
      <div className="space-y-6">
        <PendingItemsAlert
          pendingCount={pendingCount}
          postsPendingCount={postStats.pending}
          commentsPendingCount={commentStats.pending}
        />

        <ModerationStatsCards
          stats={currentStats}
          activeTab={activeTab}
        />

        <ContentModerationHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={currentFilters}
          onFiltersChange={updateCurrentFilters}
          showForumPosts={true}
        />
        
        <ModerationTabContent
          activeTab={activeTab}
          forumLoading={forumLoading}
          commentsLoading={commentsLoading}
          filteredForumPosts={filteredForumPosts}
          filteredComments={filteredComments}
          onViewPost={handleViewPost}
          onViewComment={handleViewComment}
          onModeratePost={handleModeratePost}
          onModerateComment={handleModerateComment}
        />
      </div>

      <ContentViewDialog
        isOpen={itemDialogOpen}
        onClose={() => setItemDialogOpen(false)}
        selectedItem={selectedItem}
        onModerate={(id: string | number, status: string) => {
          if (selectedItem?.type === 'forum_post' && typeof id === 'string') {
            handleModeratePost(id, status as 'approved' | 'rejected');
          } else if (selectedItem?.type === 'forum_comment' && typeof id === 'string') {
            handleModerateComment(id, status as 'approved' | 'rejected');
          }
        }}
      />
    </AdminLayout>
  );
};

export default AdminContent;
