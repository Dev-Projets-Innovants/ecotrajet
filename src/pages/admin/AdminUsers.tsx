
import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Mail, Edit } from 'lucide-react';
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

// Mock user data
const USERS = [
  {
    id: 1,
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    dateJoined: '12/01/2023',
    ecoLevel: 8,
    points: 7845,
    status: 'active',
    lastActive: '17/07/2023 14:23',
    completedTrips: 142
  },
  {
    id: 2,
    name: 'Thomas Bernard',
    email: 'thomas.bernard@example.com',
    dateJoined: '23/02/2023',
    ecoLevel: 5,
    points: 3420,
    status: 'active',
    lastActive: '17/07/2023 10:45',
    completedTrips: 89
  },
  {
    id: 3,
    name: 'Camille Dubois',
    email: 'camille.dubois@example.com',
    dateJoined: '05/03/2023',
    ecoLevel: 7,
    points: 6125,
    status: 'inactive',
    lastActive: '10/07/2023 09:12',
    completedTrips: 115
  },
  {
    id: 4,
    name: 'Lucas Petit',
    email: 'lucas.petit@example.com',
    dateJoined: '18/03/2023',
    ecoLevel: 3,
    points: 1540,
    status: 'suspended',
    lastActive: '02/07/2023 16:30',
    completedTrips: 32
  },
  {
    id: 5,
    name: 'Emma Roux',
    email: 'emma.roux@example.com',
    dateJoined: '29/03/2023',
    ecoLevel: 9,
    points: 9270,
    status: 'active',
    lastActive: '17/07/2023 13:05',
    completedTrips: 201
  },
  {
    id: 6,
    name: 'Noah Leroy',
    email: 'noah.leroy@example.com',
    dateJoined: '07/04/2023',
    ecoLevel: 6,
    points: 4850,
    status: 'active',
    lastActive: '16/07/2023 18:22',
    completedTrips: 97
  },
  {
    id: 7,
    name: 'Chloé Moreau',
    email: 'chloe.moreau@example.com',
    dateJoined: '15/04/2023',
    ecoLevel: 4,
    points: 2780,
    status: 'inactive',
    lastActive: '11/07/2023 11:45',
    completedTrips: 68
  },
  {
    id: 8,
    name: 'Louis Fournier',
    email: 'louis.fournier@example.com',
    dateJoined: '02/05/2023',
    ecoLevel: 2,
    points: 980,
    status: 'active',
    lastActive: '15/07/2023 09:10',
    completedTrips: 22
  }
];

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const filteredUsers = USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (userId: number, newStatus: string) => {
    // In a real app, this would call an API to update the user's status
    const user = USERS.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Statut modifié",
        description: `Le statut de ${user.name} a été changé en "${newStatus}".`,
      });
    }
  };

  const handleSendEmail = (userId: number) => {
    // In a real app, this would open an email composition interface
    const user = USERS.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Email en préparation",
        description: `Préparation d'un email pour ${user.name}.`,
      });
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Inactif</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500 hover:bg-red-600">Suspendu</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Gestion des utilisateurs">
      <div className="space-y-6">
        {/* Search and filter section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un utilisateur..."
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

        {/* Users table */}
        <div className="rounded-md border dark:border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Niveau Éco</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="hidden md:table-cell">Date d'inscription</TableHead>
                <TableHead className="hidden md:table-cell">Dernière activité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{user.ecoLevel}</div>
                      <Progress 
                        value={user.ecoLevel * 10} 
                        className="h-2 w-16 bg-gray-200 dark:bg-gray-700" 
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{user.points.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.completedTrips} trajets</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.dateJoined}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.lastActive}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendEmail(user.id)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Envoyer un email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="text-green-600 dark:text-green-400"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Marquer comme actif
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          className="text-red-600 dark:text-red-400"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Suspendre
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* User Edit Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur ci-dessous.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Nom</label>
                <Input 
                  defaultValue={selectedUser.name} 
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Email</label>
                <Input 
                  defaultValue={selectedUser.email} 
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Niveau Éco</label>
                <Input 
                  type="number" 
                  defaultValue={selectedUser.ecoLevel} 
                  min="1" 
                  max="10"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Points</label>
                <Input 
                  type="number" 
                  defaultValue={selectedUser.points} 
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setUserDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={() => {
              toast({
                title: "Utilisateur mis à jour",
                description: "Les informations de l'utilisateur ont été mises à jour.",
              });
              setUserDialogOpen(false);
            }}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
