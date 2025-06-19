
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import ForumPostCard from './ForumPostCard';
import { ForumPost, ForumCategory } from '@/services/forum/types';

interface PostsListProps {
  posts: ForumPost[];
  searchQuery: string;
  onCreatePost: () => void;
  categories?: ForumCategory[];
}

const PostsList: React.FC<PostsListProps> = ({ 
  posts, 
  searchQuery, 
  onCreatePost,
  categories = []
}) => {
  console.log('PostsList - Posts:', posts.length, 'Categories:', categories.length, 'Search:', searchQuery);

  // Filtrer les posts selon la recherche
  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      (post.user_name && post.user_name.toLowerCase().includes(query)) ||
      (post.location && post.location.toLowerCase().includes(query)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  console.log('Filtered posts count:', filteredPosts.length);

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'Aucun post trouvé' : 'Aucun post disponible'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Essayez de modifier votre recherche ou créez un nouveau post.'
              : 'Soyez le premier à partager votre expérience avec la communauté !'
            }
          </p>
        </div>
        <Button onClick={onCreatePost} className="bg-eco-green hover:bg-eco-green/90">
          <Plus className="h-4 w-4 mr-2" />
          Créer un post
        </Button>
      </div>
    );
  }

  const handlePostUpdated = (updatedPost: ForumPost) => {
    console.log('Post updated in PostsList:', updatedPost.id);
    // Les posts seront automatiquement mis à jour via le hook useCommunityData
  };

  return (
    <div className="space-y-6">
      {filteredPosts.map((post) => (
        <ForumPostCard 
          key={post.id} 
          post={post} 
          categories={categories}
          onPostUpdated={handlePostUpdated}
        />
      ))}
    </div>
  );
};

export default PostsList;
