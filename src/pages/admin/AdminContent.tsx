
import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, ThumbsUp, MessageSquare, Image } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

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
    // In a real app, this would call an API to update the content status
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
        {/* Tabs for content types */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Témoignages
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Photos
            </TabsTrigger>
          </TabsList>
          
          {/* Search and filter section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder={`Rechercher un ${activeTab === 'testimonials' ? 'témoignage' : 'photo'}...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
          </div>
          
          <TabsContent value="testimonials" className="mt-6">
            <div className="rounded-md border dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Likes</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTestimonials.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.author}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {item.authorId}</div>
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.dateSubmitted}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-gray-500" />
                          {item.likes}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewItem(item)}>
                              Consulter
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleModerateItem(item.id, 'approved', 'testimonial')}
                              className="text-green-600 dark:text-green-400"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleModerateItem(item.id, 'rejected', 'testimonial')}
                              className="text-red-600 dark:text-red-400"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeter
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="photos" className="mt-6">
            <div className="rounded-md border dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPhotos.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.author}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {item.authorId}</div>
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.dateSubmitted}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewItem({...item, type: 'photo'})}>
                              Consulter
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleModerateItem(item.id, 'approved', 'photo')}
                              className="text-green-600 dark:text-green-400"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleModerateItem(item.id, 'rejected', 'photo')}
                              className="text-red-600 dark:text-red-400"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeter
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Content Preview Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.title || 'Détail du contenu'}
            </DialogTitle>
            <DialogDescription>
              Soumis par {selectedItem?.author} le {selectedItem?.dateSubmitted}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedItem?.type === 'photo' ? (
              <div className="space-y-4">
                <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-800">
                  <img 
                    src={selectedItem.imageUrl} 
                    alt={selectedItem.title} 
                    className="w-full h-64 object-cover"
                  />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedItem.description}</p>
              </div>
            ) : (
              <Textarea 
                readOnly 
                value={selectedItem?.content || ''} 
                className="min-h-[100px] bg-gray-50 dark:bg-gray-900"
              />
            )}
          </div>
          <DialogFooter className="flex justify-between sm:justify-between gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => handleModerateItem(
                selectedItem?.id, 
                'rejected', 
                selectedItem?.type === 'photo' ? 'photo' : 'testimonial'
              )}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
            <Button 
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleModerateItem(
                selectedItem?.id, 
                'approved', 
                selectedItem?.type === 'photo' ? 'photo' : 'testimonial'
              )}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminContent;
