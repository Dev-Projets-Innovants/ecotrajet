
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  ThumbsUp,
  Filter, 
  Send,
  Image as ImageIcon,
  MapPin
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

// Mock data for community posts
const MOCK_POSTS = [
  {
    id: 1,
    author: {
      name: 'Marie Leclerc',
      avatar: 'https://i.pravatar.cc/150?img=1',
      badge: 'Cycliste Expert'
    },
    content: "J'ai découvert une nouvelle piste cyclable magnifique le long de la Seine ! Parfaite pour les trajets domicile-travail. Moins de stress et plus de nature.",
    image: 'https://images.unsplash.com/photo-1598003098927-ac461a1fa060?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Paris, France',
    timeAgo: '2 heures',
    likes: 24,
    comments: 7,
    shares: 3,
    tags: ['#vélo', '#trajetdomiciletravail', '#mobilité']
  },
  {
    id: 2,
    author: {
      name: 'Thomas Durand',
      avatar: 'https://i.pravatar.cc/150?img=2',
      badge: 'Éco-Acteur'
    },
    content: "Conseils pour les nouveaux adeptes du covoiturage : utilisez l'application ÉcoTrajet pour trouver des collègues qui font le même trajet que vous. J'ai économisé 120€ ce mois-ci !",
    image: null,
    location: 'Lyon, France',
    timeAgo: '1 jour',
    likes: 43,
    comments: 12,
    shares: 8,
    tags: ['#covoiturage', '#économies', '#conseils']
  },
  {
    id: 3,
    author: {
      name: 'Sophie Martin',
      avatar: 'https://i.pravatar.cc/150?img=3',
      badge: 'Novice Mobilité'
    },
    content: "Premier jour de trajet en bus électrique plutôt que ma voiture. Franchement, c'est moins stressant et je peux lire pendant le trajet. Je vais continuer l'expérience !",
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Bordeaux, France',
    timeAgo: '3 jours',
    likes: 18,
    comments: 5,
    shares: 1,
    tags: ['#busélectrique', '#premièreexpérience', '#lecturetrajet']
  }
];

const Community = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('tous');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [commentText, setCommentText] = useState('');

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez ajouter du contenu à votre publication.",
        variant: "destructive",
      });
      return;
    }

    const newPost = {
      id: posts.length + 1,
      author: {
        name: 'Votre Nom',
        avatar: 'https://i.pravatar.cc/150?img=8',
        badge: 'Éco-Citoyen'
      },
      content: newPostContent,
      image: null,
      location: 'Votre Localisation',
      timeAgo: 'à l\'instant',
      likes: 0,
      comments: 0,
      shares: 0,
      tags: []
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    toast({
      title: "Publication réussie",
      description: "Votre expérience a été partagée avec la communauté.",
    });
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleComment = (postId: number) => {
    if (!commentText.trim()) return;
    
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, comments: post.comments + 1 } : post
    ));
    
    setCommentText('');
    toast({
      title: "Commentaire ajouté",
      description: "Votre commentaire a été ajouté avec succès.",
    });
  };

  return (
    <Layout title="Communauté ÉcoTrajet">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-eco-green">Communauté ÉcoTrajet</h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-300">
          Partagez vos expériences et découvrez celles des autres membres de la communauté.
        </p>
        
        <div className="grid gap-6">
          {/* Create post card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Partagez votre expérience</CardTitle>
              <CardDescription>Racontez vos trajets écologiques et inspirez la communauté</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Qu'avez-vous à partager aujourd'hui ?" 
                className="min-h-24 mb-4"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  <span>Photo</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Lieu</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="https://i.pravatar.cc/150?img=8" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">Visible par tous</span>
              </div>
              <Button 
                className="bg-eco-green hover:bg-eco-dark-green"
                onClick={handlePostSubmit}
              >
                Publier
              </Button>
            </CardFooter>
          </Card>
          
          {/* Posts filter tabs */}
          <div className="flex justify-between items-center">
            <Tabs 
              defaultValue="tous" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="tous">Tous</TabsTrigger>
                <TabsTrigger value="tendance">Tendance</TabsTrigger>
                <TabsTrigger value="récents">Récents</TabsTrigger>
                <TabsTrigger value="suivis">Suivis</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Posts feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{post.author.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{post.timeAgo}</span>
                          {post.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" /> 
                                {post.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-eco-light-green text-eco-green">
                      {post.author.badge}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="mb-3">{post.content}</p>
                  {post.image && (
                    <div className="mt-3 rounded-md overflow-hidden">
                      <img 
                        src={post.image} 
                        alt="Post" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs text-eco-green hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-3 flex items-center justify-between">
                  <div className="flex gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 text-muted-foreground"
                      onClick={() => handleLike(post.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1 text-muted-foreground"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Commentaires</AlertDialogTitle>
                          <AlertDialogDescription>
                            Partagez votre avis sur cette publication.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="max-h-72 overflow-y-auto px-1 py-2 space-y-3">
                          {/* Here would be the comments list */}
                          <div className="flex gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="bg-accent p-2 rounded-md text-sm flex-1">
                              <div className="font-semibold">Jean Dupont</div>
                              <p>Super initiative ! Je vais essayer ce trajet.</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Input 
                            placeholder="Ajouter un commentaire..." 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                          />
                          <Button 
                            size="icon" 
                            onClick={() => handleComment(post.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        <AlertDialogFooter className="mt-2">
                          <AlertDialogCancel>Fermer</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 text-muted-foreground"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>{post.shares}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-eco-green">
                    <Heart className="h-4 w-4 mr-1" />
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
