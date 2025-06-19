
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ForumPostCard from '@/components/forum/ForumPostCard';
import CommentSection from '@/components/forum/CommentSection';
import { useRealtimePost } from '@/hooks/useRealtimePost';
import { useCommunityData } from '@/hooks/useCommunityData';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { post, isLoading: postLoading } = useRealtimePost(id!);
  const { categories, isLoading: categoriesLoading } = useCommunityData();

  console.log('PostDetail - Post ID:', id, 'Post:', post, 'Categories:', categories);

  const isLoading = postLoading || categoriesLoading;

  if (isLoading) {
    return (
      <Layout title="Chargement...">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout title="Post introuvable">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Post introuvable
            </h1>
            <Button onClick={() => navigate('/community')}>
              Retour à la communauté
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handlePostUpdated = (updatedPost: any) => {
    console.log('Post updated in PostDetail:', updatedPost.id);
    // Le post sera automatiquement mis à jour via useRealtimePost
  };

  return (
    <Layout title={post.title}>
      <div className="container mx-auto px-4 py-8">
        {/* Header avec bouton retour */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/community')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la communauté
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Post principal avec mises à jour temps réel */}
          <ForumPostCard 
            post={post} 
            showRealTimeUpdates={true}
            categories={categories}
            onPostUpdated={handlePostUpdated}
          />
          
          {/* Section des commentaires */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">
                Commentaires ({Math.max(0, post.comments_count)})
              </h2>
            </CardHeader>
            <CardContent>
              <CommentSection postId={post.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;
