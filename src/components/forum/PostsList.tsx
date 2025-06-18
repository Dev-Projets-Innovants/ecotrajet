import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ForumPostCard from './ForumPostCard';
import { ForumPost } from '@/services/forum';

interface PostsListProps {
  posts: ForumPost[];
  searchQuery: string;
  onCreatePost: () => void;
}

const PostsList: React.FC<PostsListProps> = ({
  posts,
  searchQuery,
  onCreatePost,
}) => {
  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.user_name && post.user_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'Aucun post ne correspond à votre recherche.' : 'Aucun post disponible.'}
          </p>
          {!searchQuery && (
            <Button 
              onClick={onCreatePost}
              className="mt-4 bg-eco-green hover:bg-eco-green/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer le premier post
            </Button>
          )}
        </div>
      ) : (
        filteredPosts.map((post) => (
          <ForumPostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

export default PostsList;
