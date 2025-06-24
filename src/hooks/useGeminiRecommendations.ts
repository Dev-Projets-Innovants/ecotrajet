
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

interface PersonalizedGuide {
  title: string;
  introduction: string;
  steps: Array<{
    id: number;
    title: string;
    content: string;
    tips: string[];
    citySpecific: string;
  }>;
  nextSteps: string;
  personalizedMessage: string;
}

export function useGeminiRecommendations() {
  const [isLoading, setIsLoading] = useState(false);

  const getForumRecommendations = async (userId: string, limit = 5): Promise<ForumRecommendation[]> => {
    setIsLoading(true);
    try {
      console.log('Récupération des recommandations forum pour:', userId);
      
      const { data, error } = await supabase.functions.invoke('gemini-recommendations', {
        body: {
          action: 'forum-recommendations',
          userId,
          limit
        }
      });

      if (error) {
        console.error('Erreur recommandations forum:', error);
        throw error;
      }

      console.log('Recommandations reçues:', data?.recommendations?.length || 0);
      return data?.recommendations || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les recommandations",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonalizedGuide = async (userId: string, section = 'premiers-pas'): Promise<PersonalizedGuide | null> => {
    setIsLoading(true);
    try {
      console.log('Génération du guide personnalisé pour:', userId, 'section:', section);
      
      const { data, error } = await supabase.functions.invoke('gemini-recommendations', {
        body: {
          action: 'personalized-guide',
          userId,
          section
        }
      });

      if (error) {
        console.error('Erreur guide personnalisé:', error);
        throw error;
      }

      console.log('Guide personnalisé généré');
      return data?.guide || null;
    } catch (error) {
      console.error('Erreur lors de la génération du guide:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le guide personnalisé",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getForumRecommendations,
    getPersonalizedGuide,
    isLoading
  };
}
