
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import CommunityHeader from '@/components/forum/CommunityHeader';
import CommunityControls from '@/components/forum/CommunityControls';
import PostsList from '@/components/forum/PostsList';
import CreatePostDialog from '@/components/forum/CreatePostDialog';
import { useCommunityData } from '@/hooks/useCommunityData';

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const {
    posts,
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    handlePostCreated,
  } = useCommunityData();

  const handleCreatePost = () => {
    setIsCreateDialogOpen(true);
  };

  const onPostCreated = () => {
    setIsCreateDialogOpen(false);
    handlePostCreated();
  };

  if (isLoading) {
    return (
      <Layout title="Communauté ÉcoTrajet">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Communauté ÉcoTrajet">
      <div className="container mx-auto px-4 py-8">
        <CommunityHeader />
        
        <CommunityControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          onCreatePost={handleCreatePost}
        />

        <PostsList
          posts={posts}
          searchQuery={searchQuery}
          onCreatePost={handleCreatePost}
        />

        <CreatePostDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onPostCreated={onPostCreated}
          categories={categories}
        />
      </div>
    </Layout>
  );
};

export default Community;
