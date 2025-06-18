import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ForumPostCard from '@/components/forum/ForumPostCard';
import CreatePostDialog from '@/components/forum/CreatePostDialog';
import CommunityRulesTooltip from '@/components/forum/CommunityRulesTooltip';
import { forumService, ForumPost, ForumCategory } from '@/services/forumService';
import { toast } from '@/hooks/use-toast';

const Community = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
    setIsCreateDialogOpen(false);
    fetchPosts();
    toast({
      title: "Succès",
      description: "Votre post a été publié avec succès !",
    });
  };

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Communauté ÉcoTrajet
            </h1>
            <CommunityRulesTooltip />
          </div>
          <p className="text-gray-600 max-w-2xl">
            Partagez vos expériences, posez des questions et découvrez les conseils 
            de la communauté pour une mobilité plus durable.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Rechercher dans les discussions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-eco-green hover:bg-eco-green/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau post
            </Button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'Aucun post ne correspond à votre recherche.' : 'Aucun post disponible.'}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
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

        {/* Create Post Dialog */}
        <CreatePostDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onPostCreated={handlePostCreated}
          categories={categories}
        />
      </div>
    </Layout>
  );
};

export default Community;
