import React, { useState } from 'react';
import { MessageSquare, Image, FileText } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import ContentModerationHeader from '@/components/admin/content/ContentModerationHeader';
import TestimonialTable from '@/components/admin/content/TestimonialTable';
import PhotoTable from '@/components/admin/content/PhotoTable';
import ForumPostsTable from '@/components/admin/content/ForumPostsTable';
import ContentViewDialog from '@/components/admin/content/ContentViewDialog';
import { useAdminContent } from '@/hooks/useAdminContent';
import { AdminForumPost } from '@/services/admin/contentModerationService';

// Mock content data
const TESTIMONIALS = [
  {
    id: 1,
    author: 'Marie Durand',
    authorId: 103,
    title: 'Changement de vie',
    content: 'Depuis que j\'utilise ÉcoTrajet pour mes déplacements quotidiens, j\'ai réduit mon empreinte carbone de 70% ! Je me sens vraiment actrice du changement.',
    dateSubmitted: '15/07/2023',
    status: 'pending',
    likes: 0
  },
  {
    id: 2,
    author: 'Jean Lefebvre',
    authorId: 218,
    title: 'Économies remarquables',
    content: 'Non seulement je fais un geste pour la planète, mais j\'économise aussi beaucoup d\'argent sur mes trajets. Une application qui change la donne !',
    dateSubmitted: '14/07/2023',
    status: 'approved',
    likes: 24
  },
  {
    id: 3,
    author: 'Antoine Moreau',
    authorId: 157,
    title: 'Communauté formidable',
    content: 'J\'adore la dimension communautaire d\'ÉcoTrajet. J\'ai rencontré des personnes formidables qui partagent mes valeurs écologiques.',
    dateSubmitted: '10/07/2023',
    status: 'approved',
    likes: 42
  },
  {
    id: 4,
    author: 'Claire Dubois',
    authorId: 289,
    title: 'Fonctionnalités impressionnantes',
    content: 'L\'application est extrêmement intuitive et propose des fonctionnalités vraiment utiles. Je recommande à tous ceux qui souhaitent réduire leur impact !',
    dateSubmitted: '08/07/2023',
    status: 'approved',
    likes: 37
  },
  {
    id: 5,
    author: 'Paul Martin',
    authorId: 103,
    title: 'Innovation écologique',
    content: 'Cette application représente l\'avenir de la mobilité urbaine. Les défis et récompenses me motivent à faire toujours plus pour l\'environnement.',
    dateSubmitted: '05/07/2023',
    status: 'rejected',
    likes: 0
  }
];

const PHOTOS = [
  {
    id: 1,
    author: 'Émilie Bernard',
    authorId: 125,
    title: 'Mon vélo électrique',
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890',
    description: 'Mon nouveau moyen de transport pour tous mes trajets en ville !',
    dateSubmitted: '16/07/2023',
    status: 'pending'
  },
  {
    id: 2,
    author: 'Thomas Petit',
    authorId: 342,
    title: 'Covoiturage matinal',
    imageUrl: 'https://images.unsplash.com/photo-1532751203793-812cbee97061',
    description: 'Partir au travail avec des collègues, c\'est économique et convivial !',
    dateSubmitted: '12/07/2023',
    status: 'approved'
  },
  {
    id: 3,
    author: 'Sarah Martin',
    authorId: 189,
    title: 'Transport en commun',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    description: 'Le tram, mon allié quotidien pour réduire mon empreinte carbone.',
    dateSubmitted: '09/07/2023',
    status: 'approved'
  }
];

const AdminContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  // Hook pour la modération des posts du forum
  const {
    posts: forumPosts,
    loading: forumLoading,
    filters,
    stats,
    updateFilters,
    approvePost,
    rejectPost
  } = useAdminContent();

  const filteredTestimonials = TESTIMONIALS.filter(
    (item) =>
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPhotos = PHOTOS.filter(
    (item) =>
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setItemDialogOpen(true);
  };

  const handleViewPost = (post: AdminForumPost) => {
    setSelectedItem({ ...post, type: 'forum_post' });
    setItemDialogOpen(true);
  };

  const handleModeratePost = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      if (newStatus === 'approved') {
        await approvePost(id);
      } else {
        await rejectPost(id);
      }
      setItemDialogOpen(false);
    } catch (error) {
      console.error('Error moderating post:', error);
    }
  };

  const handleModerateItem = (id: number, newStatus: string, type: string) => {
    const items = type === 'testimonial' ? TESTIMONIALS : PHOTOS;
    const item = items.find(i => i.id === id);
    
    if (item) {
      toast({
        title: newStatus === 'approved' ? "Contenu approuvé" : "Contenu rejeté",
        description: `Le ${type === 'testimonial' ? 'témoignage' : 'photo'} de ${item.author} a été ${newStatus === 'approved' ? 'approuvé' : 'rejeté'}.`,
      });
    }
    
    setItemDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600">En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Filtrer les posts du forum par recherche
  const filteredForumPosts = forumPosts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      (post.user_name && post.user_name.toLowerCase().includes(query))
    );
  });

  return (
    <AdminLayout title="Modération des contenus">
      <div className="space-y-6">
        {/* En-tête avec statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approuvés</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rejetés</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        <ContentModerationHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={updateFilters}
          showForumPosts={true}
        />
        
        <div className="mt-6">
          {activeTab === 'posts' && (
            <div>
              {forumLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green"></div>
                </div>
              ) : (
                <ForumPostsTable
                  posts={filteredForumPosts}
                  onViewPost={handleViewPost}
                  onApprovePost={(postId) => handleModeratePost(postId, 'approved')}
                  onRejectPost={(postId) => handleModeratePost(postId, 'rejected')}
                />
              )}
            </div>
          )}
          
          {activeTab === 'testimonials' && (
            <TestimonialTable
              testimonials={filteredTestimonials}
              onViewItem={handleViewItem}
              onModerateItem={handleModerateItem}
              getStatusBadge={getStatusBadge}
            />
          )}
          
          {activeTab === 'photos' && (
            <PhotoTable
              photos={filteredPhotos}
              onViewItem={handleViewItem}
              onModerateItem={handleModerateItem}
              getStatusBadge={getStatusBadge}
            />
          )}
        </div>
      </div>

      <ContentViewDialog
        isOpen={itemDialogOpen}
        onClose={() => setItemDialogOpen(false)}
        selectedItem={selectedItem}
        onModerate={(id: string | number, status: string, type?: string) => {
          if (selectedItem?.type === 'forum_post' && typeof id === 'string') {
            handleModeratePost(id, status as 'approved' | 'rejected');
          } else if (typeof id === 'number' && type) {
            handleModerateItem(id, status, type);
          }
        }}
      />
    </AdminLayout>
  );
};

export default AdminContent;
