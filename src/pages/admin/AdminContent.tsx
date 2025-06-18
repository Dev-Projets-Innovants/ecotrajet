
import React, { useState } from 'react';
import { MessageSquare, Image } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import ContentModerationHeader from '@/components/admin/content/ContentModerationHeader';
import TestimonialTable from '@/components/admin/content/TestimonialTable';
import PhotoTable from '@/components/admin/content/PhotoTable';
import ContentViewDialog from '@/components/admin/content/ContentViewDialog';

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
  const [activeTab, setActiveTab] = useState('testimonials');

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

  return (
    <AdminLayout title="Modération des contenus">
      <div className="space-y-6">
        <ContentModerationHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className="mt-6">
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
        onModerate={handleModerateItem}
      />
    </AdminLayout>
  );
};

export default AdminContent;
