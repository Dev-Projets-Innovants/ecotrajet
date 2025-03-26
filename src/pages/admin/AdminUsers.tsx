import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from '@/hooks/use-toast';

const useAdminUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', status: 'active', role: 'user', lastLogin: '2023-05-15' },
    { id: 2, name: 'Marie Curie', email: 'marie@example.com', status: 'active', role: 'admin', lastLogin: '2023-05-14' },
    { id: 3, name: 'Pierre Martin', email: 'pierre@example.com', status: 'inactive', role: 'user', lastLogin: '2023-04-20' },
    { id: 4, name: 'Sophie Dubois', email: 'sophie@example.com', status: 'active', role: 'user', lastLogin: '2023-05-10' },
    { id: 5, name: 'Lucas Bernard', email: 'lucas@example.com', status: 'pending', role: 'user', lastLogin: 'Never' },
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
  
  return { users, isLoading, error, refetchUsers };
};

const AdminUsers = () => {
  const { 
    users, 
    isLoading, 
    error, 
    refetchUsers 
  } = useAdminUsers();
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  return (
    <AdminLayout title="Gestion des utilisateurs">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

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
                {users.map((user) => (
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
                        <Button variant="outline" size="sm">Éditer</Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de 1 à {users.length} sur {users.length} utilisateurs
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>Précédent</Button>
            <Button variant="outline" size="sm" disabled>Suivant</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
