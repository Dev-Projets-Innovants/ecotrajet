
import React, { useState } from 'react';
import { MessageSquare, FileText } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import ContentModerationHeader from '@/components/admin/content/ContentModerationHeader';
import ForumPostsTable from '@/components/admin/content/ForumPostsTable';
import CommentsTable from '@/components/admin/content/CommentsTable';
import ContentViewDialog from '@/components/admin/content/ContentViewDialog';
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
      } else {
        await rejectPost(id);
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
      } else {
        await rejectComment(id);
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

  return (
    <AdminLayout title="Modération des contenus">
      <div className="space-y-6">
        {/* En-tête avec statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total {activeTab === 'posts' ? 'Posts' : 'Commentaires'}</p>
                <p className="text-2xl font-bold">{currentStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
                <p className="text-2xl font-bold text-amber-600">{currentStats.pending}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approuvés</p>
                <p className="text-2xl font-bold text-green-600">{currentStats.approved}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rejetés</p>
                <p className="text-2xl font-bold text-red-600">{currentStats.rejected}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        <ContentModerationHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={currentFilters}
          onFiltersChange={updateCurrentFilters}
          showForumPosts={true}
        />
        
        <div className="mt-6">
          {activeTab === 'posts' && (
            <div>
              {forumLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green"></div>
                </div>
              ) : (
                <ForumPostsTable
                  posts={filteredForumPosts}
                  onViewPost={handleViewPost}
                  onApprovePost={(postId) => handleModeratePost(postId, 'approved')}
                  onRejectPost={(postId) => handleModeratePost(postId, 'rejected')}
                />
              )}
            </div>
          )}
          
          {activeTab === 'comments' && (
            <div>
              {commentsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green"></div>
                </div>
              ) : (
                <CommentsTable
                  comments={filteredComments}
                  onViewComment={handleViewComment}
                  onApproveComment={(commentId) => handleModerateComment(commentId, 'approved')}
                  onRejectComment={(commentId) => handleModerateComment(commentId, 'rejected')}
                />
              )}
            </div>
          )}
        </div>
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
