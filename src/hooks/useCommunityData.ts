
import { useState, useEffect } from 'react';
import { forumService, ForumPost, ForumCategory } from '@/services/forum';
import { toast } from '@/hooks/use-toast';

export const useCommunityData = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchInitialData = async () => {
    try {
      const [categoriesResult] = await Promise.all([
        forumService.getCategories()
      ]);

      if (categoriesResult.data) {
        setCategories(categoriesResult.data);
      }

      await fetchPosts();
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du forum",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const categoryId = selectedCategory === 'all' ? undefined : selectedCategory;
      const { data, error } = await forumService.getPosts(categoryId, 20, 0);

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match ForumPost interface
        const transformedPosts = data.map(post => ({
          ...post,
          forum_categories: post.forum_categories ? {
            ...post.forum_categories,
            description: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } : undefined
        }));
        setPosts(transformedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les posts",
        variant: "destructive",
      });
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
    toast({
      title: "Succès",
      description: "Votre post a été publié avec succès !",
    });
  };

  return {
    posts,
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    handlePostCreated,
  };
};
