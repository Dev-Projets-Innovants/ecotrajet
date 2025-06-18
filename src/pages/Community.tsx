
import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, TrendingUp, Users, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { forumService, ForumPost, ForumCategory } from '@/services/forumService';
import ForumPostCard from '@/components/forum/ForumPostCard';
import CreatePostDialog from '@/components/forum/CreatePostDialog';
import Layout from '@/components/Layout';

const Community = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load categories
      const { data: categoriesData } = await forumService.getCategories();
      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Load posts
      const categoryId = selectedCategory === 'all' ? undefined : selectedCategory;
      const { data: postsData } = await forumService.getPosts(categoryId);
      if (postsData) {
        setPosts(postsData);
      }
    } catch (error) {
      console.error('Error loading forum data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  const handlePostCreated = () => {
    setIsCreatePostOpen(false);
    loadData();
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalPosts: posts.length,
    totalCategories: categories.length,
    totalLikes: posts.reduce((sum, post) => sum + post.likes_count, 0),
    totalComments: posts.reduce((sum, post) => sum + post.comments_count, 0),
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Communauté ÉcoTrajet
                </h1>
                <p className="text-gray-600">
                  Partagez vos expériences et conseils sur la mobilité durable
                </p>
              </div>
              <Button onClick={handleCreatePost} className="bg-eco-green hover:bg-eco-green/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau post
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-eco-green mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Posts</p>
                        <p className="text-xl font-bold">{stats.totalPosts}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Likes</p>
                        <p className="text-xl font-bold">{stats.totalLikes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Catégories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-eco-light-green text-eco-green'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Toutes les catégories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-eco-light-green text-eco-green'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <Badge
                            variant="outline"
                            style={{ borderColor: category.color, color: category.color }}
                          >
                            {posts.filter(p => p.category_id === category.id).length}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher dans les discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>

              {/* Posts */}
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <ForumPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune discussion trouvée
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Soyez le premier à lancer une discussion dans cette catégorie !
                    </p>
                    <Button onClick={handleCreatePost} className="bg-eco-green hover:bg-eco-green/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <CreatePostDialog
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          onPostCreated={handlePostCreated}
          categories={categories}
        />
      </div>
    </Layout>
  );
};

export default Community;
