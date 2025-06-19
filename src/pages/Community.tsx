
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
    refreshPosts,
  } = useCommunityData();

  console.log('Community page - Posts count:', posts.length, 'Categories count:', categories.length);

  const handleCreate = () => {
    console.log('Create post button clicked');
    setIsCreateDialogOpen(true);
  };

  const onPostCreated = () => {
    console.log('Post created, closing dialog and refreshing');
    setIsCreateDialogOpen(false);
    handlePostCreated();
  };

  const handlePostsChange = () => {
    console.log('Posts changed, refreshing data');
    refreshPosts();
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
          onCreatePost={handleCreate}
        />

        <PostsList
          posts={posts}
          searchQuery={searchQuery}
          onCreatePost={handleCreate}
          categories={categories}
          onPostsChange={handlePostsChange}
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
