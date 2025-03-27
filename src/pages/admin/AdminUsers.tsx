
/**
 * Page d'administration des utilisateurs
 * 
 * Cette page permet aux administrateurs de gérer l'ensemble des utilisateurs du système:
 * - Consulter la liste complète des utilisateurs
 * - Filtrer et rechercher les utilisateurs par différents critères
 * - Ajouter de nouveaux utilisateurs
 * - Modifier les informations des utilisateurs existants
 * - Supprimer des utilisateurs
 * - Approuver ou rejeter des comptes utilisateurs
 */

import React, { useState } from 'react';
import { RefreshCw, Search, Filter, Plus, MoreHorizontal, Edit, Trash2, CheckCircle, XCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const useAdminUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', status: 'active', role: 'user', lastLogin: '2023-05-15' },
    { id: 2, name: 'Marie Curie', email: 'marie@example.com', status: 'active', role: 'admin', lastLogin: '2023-05-14' },
    { id: 3, name: 'Pierre Martin', email: 'pierre@example.com', status: 'inactive', role: 'user', lastLogin: '2023-04-20' },
    { id: 4, name: 'Sophie Dubois', email: 'sophie@example.com', status: 'active', role: 'user', lastLogin: '2023-05-10' },
    { id: 5, name: 'Lucas Bernard', email: 'lucas@example.com', status: 'pending', role: 'user', lastLogin: 'Never' },
    { id: 6, name: 'Emma Lefebvre', email: 'emma@example.com', status: 'active', role: 'user', lastLogin: '2023-05-08' },
    { id: 7, name: 'Léo Moreau', email: 'leo@example.com', status: 'inactive', role: 'user', lastLogin: '2023-03-15' },
    { id: 8, name: 'Chloé Rousseau', email: 'chloe@example.com', status: 'active', role: 'user', lastLogin: '2023-05-12' },
    { id: 9, name: 'Gabriel Fournier', email: 'gabriel@example.com', status: 'pending', role: 'user', lastLogin: 'Never' },
    { id: 10, name: 'Alice Girard', email: 'alice@example.com', status: 'active', role: 'admin', lastLogin: '2023-05-13' },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const refetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUsers = users.map(user => ({
          ...user,
          lastLogin: user.status === 'active' ? new Date().toISOString().split('T')[0] : user.lastLogin
        }));
        setUsers(updatedUsers);
        setIsLoading(false);
        resolve(updatedUsers);
      }, 1000);
    });
  };

  const addUser = (newUser) => {
    setUsers(prev => [
      ...prev,
      { ...newUser, id: Math.max(...prev.map(u => u.id), 0) + 1 }
    ]);
    return Promise.resolve();
  };

  const updateUser = (userId, updatedData) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updatedData } : user
    ));
    return Promise.resolve();
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    return Promise.resolve();
  };
  
  return { users, isLoading, error, refetchUsers, addUser, updateUser, deleteUser };
};

const AdminUsers = () => {
  const { 
    users, 
    isLoading, 
    error, 
    refetchUsers,
    addUser,
    updateUser,
    deleteUser
  } = useAdminUsers();

  // État pour la recherche et le filtrage
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // États pour les dialogues CRUD
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    status: 'pending',
    role: 'user',
    lastLogin: 'Never'
  });

  // Filtrer les utilisateurs selon les critères
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchUsers();
      toast({
        title: "Utilisateurs actualisés",
        description: "La liste des utilisateurs a été mise à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les utilisateurs.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddUser = async () => {
    try {
      await addUser(newUser);
      setIsAddUserDialogOpen(false);
      setNewUser({
        name: '',
        email: '',
        status: 'pending',
        role: 'user',
        lastLogin: 'Never'
      });
      toast({
        title: "Utilisateur ajouté",
        description: "Le nouvel utilisateur a été ajouté avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'utilisateur.",
        variant: "destructive"
      });
    }
  };

  const handleEditUser = async () => {
    try {
      await updateUser(selectedUser.id, selectedUser);
      setIsEditUserDialogOpen(false);
      toast({
        title: "Utilisateur modifié",
        description: "Les informations de l'utilisateur ont été mises à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'utilisateur.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser.id);
      setIsDeleteUserDialogOpen(false);
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive"
      });
    }
  };

  const handleApproveUser = async (user) => {
    try {
      await updateUser(user.id, { ...user, status: 'active' });
      toast({
        title: "Utilisateur approuvé",
        description: "Le compte utilisateur a été activé.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver l'utilisateur.",
        variant: "destructive"
      });
    }
  };

  const handleRejectUser = async (user) => {
    try {
      await updateUser(user.id, { ...user, status: 'inactive' });
      toast({
        title: "Utilisateur rejeté",
        description: "Le compte utilisateur a été désactivé.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'utilisateur.",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout title="Gestion des utilisateurs">
      <div className="grid gap-6">
        {/* Barre d'outils avec recherche, filtres et ajout */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
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
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-eco-green hover:bg-eco-dark-green">
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un utilisateur</DialogTitle>
                  <DialogDescription>
                    Remplissez le formulaire pour ajouter un nouvel utilisateur.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Nom</label>
                    <Input 
                      className="col-span-3" 
                      placeholder="Nom complet" 
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Email</label>
                    <Input 
                      className="col-span-3" 
                      placeholder="email@example.com" 
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Statut</label>
                    <Select 
                      value={newUser.status}
                      onValueChange={(value) => setNewUser({...newUser, status: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Rôle</label>
                    <Select 
                      value={newUser.role}
                      onValueChange={(value) => setNewUser({...newUser, role: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Utilisateur</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddUser} className="bg-eco-green hover:bg-eco-dark-green">
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">ID</th>
                  <th className="py-3 px-4 text-left font-medium">Nom</th>
                  <th className="py-3 px-4 text-left font-medium">Email</th>
                  <th className="py-3 px-4 text-left font-medium">Statut</th>
                  <th className="py-3 px-4 text-left font-medium">Rôle</th>
                  <th className="py-3 px-4 text-left font-medium">Dernière connexion</th>
                  <th className="py-3 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4">{user.id}</td>
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : user.status === 'inactive' 
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status === 'active' 
                          ? 'Actif' 
                          : user.status === 'inactive' 
                            ? 'Inactif' 
                            : 'En attente'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{user.lastLogin}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {user.status === 'pending' ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApproveUser(user)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approuver
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleRejectUser(user)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser({...user});
                                setIsEditUserDialogOpen(true);
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Éditer
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsDeleteUserDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} à {Math.min(currentPage * itemsPerPage, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage <= 1}
            >
              Précédent
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage >= totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog pour éditer un utilisateur */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Nom</label>
                <Input 
                  className="col-span-3" 
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Email</label>
                <Input 
                  className="col-span-3" 
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Statut</label>
                <Select 
                  value={selectedUser.status}
                  onValueChange={(value) => setSelectedUser({...selectedUser, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Rôle</label>
                <Select 
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditUser} className="bg-eco-green hover:bg-eco-dark-green">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour confirmer la suppression */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Nom:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
