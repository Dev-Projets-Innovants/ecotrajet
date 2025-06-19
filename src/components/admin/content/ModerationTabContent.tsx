
import React from 'react';
import ForumPostsTable from './ForumPostsTable';
import CommentsTable from './CommentsTable';
import { AdminForumPost } from '@/services/admin/contentModerationService';
import { AdminForumComment } from '@/services/admin/commentsModerationService';

interface ModerationTabContentProps {
  activeTab: string;
  forumLoading: boolean;
  commentsLoading: boolean;
  filteredForumPosts: AdminForumPost[];
  filteredComments: AdminForumComment[];
  onViewPost: (post: AdminForumPost) => void;
  onViewComment: (comment: AdminForumComment) => void;
  onModeratePost: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  onModerateComment: (id: string, status: 'approved' | 'rejected') => Promise<void>;
}

const ModerationTabContent: React.FC<ModerationTabContentProps> = ({
  activeTab,
  forumLoading,
  commentsLoading,
  filteredForumPosts,
  filteredComments,
  onViewPost,
  onViewComment,
  onModeratePost,
  onModerateComment
}) => {
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green"></div>
    </div>
  );

  return (
    <div className="mt-6">
      {activeTab === 'posts' && (
        <div>
          {forumLoading ? (
            <LoadingSpinner />
          ) : (
            <ForumPostsTable
              posts={filteredForumPosts}
              onViewPost={onViewPost}
              onApprovePost={(postId) => onModeratePost(postId, 'approved')}
              onRejectPost={(postId) => onModeratePost(postId, 'rejected')}
            />
          )}
        </div>
      )}
      
      {activeTab === 'comments' && (
        <div>
          {commentsLoading ? (
            <LoadingSpinner />
          ) : (
            <CommentsTable
              comments={filteredComments}
              onViewComment={onViewComment}
              onApproveComment={(commentId) => onModerateComment(commentId, 'approved')}
              onRejectComment={(commentId) => onModerateComment(commentId, 'rejected')}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ModerationTabContent;
