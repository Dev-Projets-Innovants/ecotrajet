
import React, { useState } from 'react';
import { Search, BellRing, SendHorizonal, Clock, Users, UserPlus, Award, AlertTriangle, Plus, Trash2 } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

// Mock notification history data
const NOTIFICATION_HISTORY = [
  {
    id: 1,
    title: "Nouveau badge disponible",
    content: "Un nouveau badge 'Champion de la ville' est disponible. Complétez 50 trajets dans votre ville pour le débloquer !",
    sentDate: "17/07/2023",
    sentTime: "14:30",
    type: "badge",
    target: "all",
    sentTo: "18,549 utilisateurs",
    status: "sent"
  },
  {
    id: 2,
    title: "Défi hebdomadaire",
    content: "Le défi hebdomadaire 'Transport en commun' est maintenant actif ! Utilisez les transports en commun 5 fois cette semaine pour gagner 500 points.",
    sentDate: "15/07/2023",
    sentTime: "09:15",
    type: "challenge",
    target: "active",
    sentTo: "12,893 utilisateurs actifs",
    status: "sent"
  },
  {
    id: 3,
    title: "Mise à jour importante",
    content: "L'application a été mise à jour avec de nouvelles fonctionnalités ! Découvrez le nouveau tableau de bord et les statistiques améliorées.",
    sentDate: "10/07/2023",
    sentTime: "11:45",
    type: "update",
    target: "all",
    sentTo: "18,245 utilisateurs",
    status: "sent"
  },
  {
    id: 4,
    title: "Événement écologique",
    content: "Rejoignez notre événement 'Journée sans voiture' le 22 juillet dans votre ville. Participez et gagnez des badges exclusifs !",
    sentDate: "05/07/2023",
    sentTime: "16:20",
    type: "event",
    target: "region",
    sentTo: "5,432 utilisateurs (Paris)",
    status: "sent"
  },
  {
    id: 5,
    title: "Bienvenue sur ÉcoTrajet !",
    content: "Bienvenue sur ÉcoTrajet ! Découvrez comment utiliser l'application et commencez à réduire votre empreinte carbone dès aujourd'hui.",
    sentDate: "01/07/2023",
    sentTime: "12:00",
    type: "welcome",
    target: "new",
    sentTo: "1,245 nouveaux utilisateurs",
    status: "scheduled",
    scheduledDate: "Automatique pour nouveaux utilisateurs"
  }
];

// Mock templates data
const NOTIFICATION_TEMPLATES = [
  {
    id: 1,
    name: "Bienvenue",
    title: "Bienvenue sur ÉcoTrajet !",
    content: "Merci de rejoindre notre communauté ! Découvrez comment utiliser l'application et commencez à réduire votre empreinte carbone.",
    type: "welcome"
  },
  {
    id: 2,
    name: "Nouveau badge",
    title: "Nouveau badge disponible",
    content: "Un nouveau badge [NOM_BADGE] est disponible. [DESCRIPTION_BADGE] pour le débloquer !",
    type: "badge"
  },
  {
    id: 3,
    name: "Défi hebdomadaire",
    title: "Défi hebdomadaire",
    content: "Le défi hebdomadaire [NOM_DÉFI] est maintenant actif ! [DESCRIPTION_DÉFI] pour gagner [POINTS] points.",
    type: "challenge"
  },
  {
    id: 4,
    name: "Mise à jour de l'application",
    title: "Mise à jour importante",
    content: "L'application a été mise à jour avec de nouvelles fonctionnalités ! [DESCRIPTION_MISE_À_JOUR]",
    type: "update"
  },
  {
    id: 5,
    name: "Évènement",
    title: "Évènement écologique",
    content: "Rejoignez notre événement [NOM_ÉVÉNEMENT] le [DATE_ÉVÉNEMENT] dans votre ville. Participez et gagnez des récompenses exclusives !",
    type: "event"
  }
];

const AdminNotifications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newNotificationDialog, setNewNotificationDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('history');
  
  // Filtered history based on search query
  const filteredHistory = NOTIFICATION_HISTORY.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filtered templates based on search query
  const filteredTemplates = NOTIFICATION_TEMPLATES.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendNotification = () => {
    // In a real app, this would call an API to send the notification
    toast({
      title: "Notification envoyée",
      description: "La notification a été envoyée avec succès aux utilisateurs ciblés.",
    });
    setNewNotificationDialog(false);
  };

  const handleScheduleNotification = () => {
    // In a real app, this would call an API to schedule the notification
    toast({
      title: "Notification programmée",
      description: "La notification a été programmée avec succès.",
    });
    setNewNotificationDialog(false);
  };

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setNewNotificationDialog(true);
  };

  const getNotificationTypeBadge = (type: string) => {
    switch (type) {
      case 'badge':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Badge</Badge>;
      case 'challenge':
        return <Badge className="bg-green-500 hover:bg-green-600">Défi</Badge>;
      case 'update':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Mise à jour</Badge>;
      case 'event':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Évènement</Badge>;
      case 'welcome':
        return <Badge className="bg-teal-500 hover:bg-teal-600">Bienvenue</Badge>;
      case 'alert':
        return <Badge className="bg-red-500 hover:bg-red-600">Alerte</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getTargetAudienceBadge = (target: string) => {
    switch (target) {
      case 'all':
        return <Badge variant="outline">Tous les utilisateurs</Badge>;
      case 'active':
        return <Badge variant="outline">Utilisateurs actifs</Badge>;
      case 'new':
        return <Badge variant="outline">Nouveaux utilisateurs</Badge>;
      case 'region':
        return <Badge variant="outline">Par région</Badge>;
      default:
        return <Badge variant="outline">{target}</Badge>;
    }
  };

  return (
    <AdminLayout title="Notifications">
      <div className="space-y-6">
        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              Modèles
            </TabsTrigger>
          </TabsList>
          
          {/* Search and add section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder={`Rechercher ${activeTab === 'history' ? 'une notification' : 'un modèle'}...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog 
              open={newNotificationDialog} 
              onOpenChange={setNewNotificationDialog}
            >
              <DialogTrigger asChild>
                <Button className="gap-2 bg-eco-green hover:bg-eco-dark-green">
                  <SendHorizonal className="h-4 w-4" />
                  Nouvelle notification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Créer une notification</DialogTitle>
                  <DialogDescription>
                    Composez votre notification et choisissez le public cible.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Type</label>
                    <Select defaultValue={selectedTemplate?.type || "update"}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="badge">Badge</SelectItem>
                          <SelectItem value="challenge">Défi</SelectItem>
                          <SelectItem value="update">Mise à jour</SelectItem>
                          <SelectItem value="event">Évènement</SelectItem>
                          <SelectItem value="welcome">Bienvenue</SelectItem>
                          <SelectItem value="alert">Alerte</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Titre</label>
                    <Input 
                      className="col-span-3" 
                      placeholder="Titre de la notification"
                      defaultValue={selectedTemplate?.title || ""}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Contenu</label>
                    <Textarea 
                      className="col-span-3" 
                      placeholder="Contenu de la notification"
                      defaultValue={selectedTemplate?.content || ""}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Cible</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un public cible" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">Tous les utilisateurs</SelectItem>
                          <SelectItem value="active">Utilisateurs actifs</SelectItem>
                          <SelectItem value="new">Nouveaux utilisateurs</SelectItem>
                          <SelectItem value="region">Par région</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Programmer</label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Checkbox id="schedule" />
                      <label
                        htmlFor="schedule"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Programmer pour plus tard
                      </label>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between sm:justify-between gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setNewNotificationDialog(false)}
                  >
                    Annuler
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleScheduleNotification}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Programmer
                    </Button>
                    <Button 
                      type="button"
                      className="bg-eco-green hover:bg-eco-dark-green"
                      onClick={handleSendNotification}
                    >
                      <SendHorizonal className="h-4 w-4 mr-2" />
                      Envoyer
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <div className="rounded-md border dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notification</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Date d'envoi</TableHead>
                    <TableHead className="hidden lg:table-cell">Cible</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">{notification.content}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getNotificationTypeBadge(notification.type)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {notification.status === 'scheduled' 
                          ? notification.scheduledDate 
                          : `${notification.sentDate} à ${notification.sentTime}`
                        }
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div>
                          {getTargetAudienceBadge(notification.target)}
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.sentTo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {notification.status === 'sent' 
                          ? <Badge className="bg-green-500">Envoyée</Badge>
                          : <Badge className="bg-amber-500">Programmée</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>{template.title}</CardDescription>
                      </div>
                      {getNotificationTypeBadge(template.type)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{template.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/20 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleUseTemplate(template)}
                    >
                      Utiliser
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Add Template Card */}
              <Card className="border-dashed border-2 border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-6 h-full">
                <div className="text-center space-y-4">
                  <div className="mx-auto rounded-full p-3 bg-gray-100 dark:bg-gray-800">
                    <Plus className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Créer un modèle</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ajoutez un nouveau modèle de notification
                    </p>
                  </div>
                  <Button>
                    Créer un modèle
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
