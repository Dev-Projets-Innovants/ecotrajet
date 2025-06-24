
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Eye, MessageCircle, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGeminiRecommendations } from '@/hooks/useGeminiRecommendations';
import { useNavigate } from 'react-router-dom';

interface ForumRecommendation {
  postId: string;
  score: number;
  reason: string;
  post: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    location: string;
    forum_categories: {
      name: string;
      color: string;
    };
  };
}

const RecommendedPosts: React.FC = () => {
  const { user } = useAuth();
  const { getForumRecommendations, isLoading } = useGeminiRecommendations();
  const [recommendations, setRecommendations] = useState<ForumRecommendation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadRecommendations();
    }
  }, [user?.id]);

  const loadRecommendations = async () => {
    if (!user?.id) return;
    
    const recs = await getForumRecommendations(user.id, 3);
    setRecommendations(recs);
  };

  const truncateContent = (content: string, maxLength = 120) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const handlePostClick = (postId: string) => {
    navigate(`/community/post/${postId}`);
  };

  if (!user || recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-eco-light-green/20 to-white border-eco-green/20">
      <CardHeader>
        <CardTitle className="flex items-center text-eco-green">
          <Sparkles className="h-5 w-5 mr-2" />
          Recommandé pour vous
        </CardTitle>
        <CardDescription>
          Posts sélectionnés par IA selon vos centres d'intérêt
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-eco-green"></div>
            <span className="ml-2 text-sm text-gray-600">Génération des recommandations...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div 
                key={rec.postId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handlePostClick(rec.post.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 hover:text-eco-green">
                    {rec.post.title}
                  </h4>
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: rec.post.forum_categories?.color || '#4CAF50',
                      color: rec.post.forum_categories?.color || '#4CAF50'
                    }}
                    className="text-xs"
                  >
                    {rec.post.forum_categories?.name || 'Général'}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {truncateContent(rec.post.content)}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {rec.post.location && (
                      <span>📍 {rec.post.location}</span>
                    )}
                    {rec.post.tags && rec.post.tags.length > 0 && (
                      <span>🏷️ {rec.post.tags.slice(0, 2).join(', ')}</span>
                    )}
                  </div>
                  <div className="text-xs text-eco-green font-medium">
                    Score: {Math.round(rec.score * 100)}%
                  </div>
                </div>
                
                <div className="mt-2 p-2 bg-eco-light-green/10 rounded text-xs text-eco-green">
                  💡 {rec.reason}
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={loadRecommendations}
              disabled={isLoading}
            >
              Actualiser les recommandations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedPosts;
