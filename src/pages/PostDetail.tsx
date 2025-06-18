
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ForumPostCard from '@/components/forum/ForumPostCard';
import CommentSection from '@/components/forum/CommentSection';
import { forumService, ForumPost } from '@/services/forum';
import { toast } from '@/hooks/use-toast';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await forumService.getPostById(id);
      
      if (error) throw error;
      
      if (data) {
        // Transform the data to match ForumPost interface
        const transformedPost = {
          ...data,
          forum_categories: data.forum_categories ? {
            ...data.forum_categories,
            description: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } : undefined
        };
        setPost(transformedPost);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le post",
        variant: "destructive",
      });
      navigate('/community');
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Post principal */}
          <ForumPostCard post={post} />
          
          {/* Section des commentaires */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">
                Commentaires ({post.comments_count})
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
